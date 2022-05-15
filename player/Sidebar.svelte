<script>
	import { onMount } from 'svelte'
	import SidebarItem from './SidebarItem.svelte'
	import lozad from 'lozad'

	export let videos
	export let currentVideoId

	onMount(() => {
		const observer = lozad()
		observer.observe()
	})
</script>

<div class="hideoverflow">
	{#each videos as video, i (video.resourceId.videoId)}
		<SidebarItem
			hoverText="{i + 1} of {videos.length}"
			isSelected={video.resourceId.videoId === currentVideoId}
			{video} />
	{/each}
</div>

<style>
	.hideoverflow { overflow: hidden; }
</style>
