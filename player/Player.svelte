<script>
	import Sidebar from './Sidebar.svelte'
	import Video from './Video.svelte'
	import Description from './Description.svelte'

	let videos = []
	let snippet

	const uploadsJson = localStorage.getItem('videos')
	if (uploadsJson) {
		videos = JSON.parse(uploadsJson)
	} else {
		console.log('Fetching video list')
		fetch('./player.json')
			.then(response => response.text())
			.then(json => {
				videos = JSON.parse(json)
				localStorage.setItem('videos', json)
			})
	}

	function onHashChange() {
		const videoId = document.location.hash.replace('#', '')
		snippet = (videos.find(v => v.snippet.resourceId.videoId === videoId) || videos[0]).snippet
		document.title = snippet.title
	}

	let windowWidth
	$: videoWidth = Math.min(windowWidth, 1280)
	$: videoHeight = Math.floor(videoWidth * 9 / 16)

	onHashChange()

	window.addEventListener('hashchange', onHashChange)
</script>

<div class="split">
	<div style="flex-basis: calc(100% - 350px); overflow-x: hidden; overflow-y: scroll;" bind:clientWidth={windowWidth}>
		{#if snippet}
			<Video snippet={snippet} width={videoWidth} height={videoHeight} autoplay={true} />
			<Description snippet={snippet} />
		{/if}
	</div>
	<div style="flex-basis: 350px">
		<Sidebar {videos} currentVideoId={snippet.resourceId.videoId} />
	</div>
</div>

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
</style>
