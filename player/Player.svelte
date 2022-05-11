<script>
	import Sidebar from './Sidebar.svelte'
	import Video from './Video.svelte'
	import Description from './Description.svelte'

	const localStorageKey = 'videos'

	let videos = []
	let snippet

	const uploadsJson = localStorage.getItem(localStorageKey)
	if (uploadsJson) {
		videos = JSON.parse(uploadsJson)
		loadVideoFromHash()
	} else {
		console.log('Fetching video list')
		fetch('./player.json')
			.then(response => response.text())
			.then(json => {
				videos = JSON.parse(json)
				loadVideoFromHash()
				localStorage.setItem(localStorageKey, json)
			})
	}

	function loadVideoFromHash() {
		const videoId = document.location.hash.replace('#', '')
		const video = videos.find(v => v.snippet.resourceId.videoId === videoId) || videos[0]
		snippet = video.snippet
		document.title = snippet.title
	}

	let windowWidth
	$: width = Math.min(windowWidth, 1280)
	$: height = Math.floor(width * 9 / 16)

	window.addEventListener('hashchange', loadVideoFromHash)
</script>

{#if !snippet}
	<p style="text-align: center;">Loading...</p>
{:else}
	<div class="split">
		<div class="left" bind:clientWidth={windowWidth}>
			<Video {snippet} {width} {height} autoplay={true} />
			<Description {snippet} />
		</div>
		<div class="right">
			<Sidebar {videos} currentVideoId={snippet.resourceId.videoId} />
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
	.split {
		display: flex;
		flex-direction: row;
		max-height: 100%;
	}
	.split > div {
		max-height: 100%;
		overflow-y: auto;
		flex: 1 0 auto;
	}
	.left {
		flex-basis: calc(100% - 350px);
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.right {
		flex-basis: 350px;
	}
</style>
