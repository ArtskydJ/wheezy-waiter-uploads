<script>
	import SidebarItem from './SidebarItem.svelte'

	export let videos
	export let currentVideoId
</script>

<div class="hideoverflow">
	{#each videos as { snippet, etag }, i (snippet.resourceId.videoId)}
		<SidebarItem
			hoverText="{i + 1} of {videos.length}"
			isSelected={snippet.resourceId.videoId === currentVideoId}
			{snippet} />
	{/each}
</div>

<style>
	.hideoverflow { overflow: hidden; }
</style>
