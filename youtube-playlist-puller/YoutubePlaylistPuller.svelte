<!--
https://svelte.dev/repl/7ac9ea9a37c24706bebbff1d751498f7?version=3.48.0
-->

<script>
	let apiKey = ''
	let channelId = 'UCQL5ABUvwY7YoW5lgMyAS_w'
	let videos = null
	let prettyJson = ''
	let errorMessage = null
	
	function ytFetch(path, query) {
		const prefix = 'https://youtube.googleapis.com/youtube/v3/'
		const queryString = new URLSearchParams({
			...query,
			key: apiKey,
		}).toString()
		const url = `${prefix}${path}?${queryString}`
		return fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})
	}
	
	async function ytFetchEntirePlaylist(playlistId) {
		const maxResults = 50
		let pageToken = null
	
		videos = []
		while (true) {
			const result = await ytFetch('playlistItems', {
				part: 'snippet,id', // 'snippet,contentDetails,id,status'
				maxResults,
				playlistId,
				...(pageToken ? { pageToken } : {}),
			})
			/*
				{
					"kind": "youtube#playlistItemListResponse",
					"etag": "3kscMIbwrPvz5Hmdkvxzmzk-J8w",
					"nextPageToken": "EAAaBlBUOkNESQ",
					"items": [
						// see ./example-video.json
					],
					"pageInfo": {
						"totalResults": 1583,
						"resultsPerPage": 50
					}
				}
			*/

			if (result.ok) {
				console.log(result)

				const { kind, etag, nextPageToken, items, pageInfo } = await result.json()

				videos = [
					...items.reverse(),
					...videos,
				]

				pageToken = nextPageToken

				if (items.length < maxResults) {
					break
				}
			} else {
				throw new Error((await result.json()).error.message)
			}
		}
	}
	
	function uploadsPlaylistFromChannelId(channelId) {
		if (!channelId.startsWith('UC')) {
			throw new Error('Invalid channel ID')
		}
		return 'UU' + channelId.slice(2)
	}

	function customStringify(arr) {
		return `[\n\t${ arr.map(e => JSON.stringify(e)).join(',\n\t') }\n]`
	}
	
	async function go() {
		if (apiKey && channelId) {
			const playlistId = uploadsPlaylistFromChannelId(channelId)
			try {
				await ytFetchEntirePlaylist(playlistId)
			} catch (e) {
				errorMessage = e.message
			}

			prettyJson = customStringify(videos)
		}
	}

</script>

<form class="row" on:submit|preventDefault={go}>
	<div class="cell">
		<label for="apiKey">API key</label>
		<input id="apiKey" type="text" bind:value={apiKey} placeholder="FaKe_7sXWg42vs_unYlUvVpUrBTwSyYeN9_fAkE" />
	</div>
	<div class="cell">
		<label for="channelId">Channel ID</label>
		<input id="channelId" type="text" bind:value={channelId} placeholder="UCQL5ABUvwY7YoW5lgMyAS_w"/>
	</div>
	<div class="cell">
		<button>Go</button>
	</div>
</form>

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}
{#if videos}
	<p>Pulled {videos.length} videos</p>
	{#if prettyJson}
		<a href="data:text/plain;charset=utf-8,{encodeURIComponent(prettyJson)}" download="uploads-{channelId}.json">Download JSON</a>
	{/if}
{/if}

<style>
	.row {
		display: flex;
		flex-direction: row;
		gap: 1em;
		align-items: flex-end; /* make the button at the same level as the inputs */
		margin-bottom: 1em;
	}
	label {
		display: block;
		color: #555;
		font-size: 0.75em;
	}
	input {
		width: 350px;
	}
</style>
