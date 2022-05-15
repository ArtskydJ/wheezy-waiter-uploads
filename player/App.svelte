<script>
	import Player from './Player.svelte'

	const localStorageKey = 'videos'
	let videos = []
	let hash = document.location.hash

	$: videoId = hash.replace('#', '')
	$: console.log('videoid: ', videoId)
	$: video = videos.find(v => v.resourceId.videoId === videoId) || videos[0]
	$: console.log('VIDEO', videos.length, video)

	$: if (video) {
		document.title = video.title
	}

	window.addEventListener('hashchange', () => hash = document.location.hash)

	async function getVideos() {
		const uploadsJson = null // localStorage.getItem(localStorageKey)
		if (uploadsJson) {
			videos = JSON.parse(uploadsJson).map(({ snippet }) => snippet)
		} else {
			console.log('Fetching video list')
			const response = await fetch('./player.json')
			const json = await response.text()
			// Invalid JSON is prevented from entering localStoragea, because parse errors will throw
			videos = JSON.parse(json).map(({ snippet }) => snippet)
			localStorage.setItem(localStorageKey, json)
		}

		console.log('then')
		return videos
	}

	let loadingPromise = getVideos()
</script>

{#await loadingPromise}
	<p style="text-align: center;">Loading...</p>
{:then videos}
	<!-- {#if video} -->
		<Player {videos} {video} />
	<!-- {/if} -->
{/await}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
