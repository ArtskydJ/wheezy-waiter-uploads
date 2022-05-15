<script>
	import Sidebar from './Sidebar.svelte'
	import Video from './Video.svelte'
	import Description from './Description.svelte'

	const autoplay = true

	export let videos
	export let video

	$: console.log('player video', video)

	let windowWidth
	$: width = Math.min(windowWidth, 1280)
	$: height = Math.floor(width * 9 / 16)
</script>

<div class="split">
	<div class="left" bind:clientWidth={windowWidth}>
		<Video {video} {width} {height} {autoplay} />
		<Description {video} />
	</div>
	<div class="right">
		<Sidebar {videos} currentVideoId={video.resourceId.videoId} />
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
		flex: 1 0 auto;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.split > .left {
		flex-basis: calc(100% - 350px);
	}
	.split > .right {
		flex-basis: 350px;
	}
</style>
