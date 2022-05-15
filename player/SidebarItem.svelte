<script>
	import Date from './Date.svelte'
	import { onMount } from 'svelte'

	export let hoverText
	export let isSelected
	export let video

	const sizeMultiplier = 0.6

	$: width = video.thumbnails.default.width * sizeMultiplier
	$: height = video.thumbnails.default.height * sizeMultiplier

	onMount(() => {
		if (isSelected) {
			document.querySelector('.item[data-selected="true"]').scrollIntoView()
		}
	})
</script>

<a class="item" title="{hoverText}" href="#{video.resourceId.videoId}" data-selected={isSelected}>
	<img class="lozad" data-src={video.thumbnails.default.url} {width} {height} alt="thumbnail" />
	<div class="text">
		{video.title}
		<div class="small"><Date isoDate={video.publishedAt} /></div>
	</div>
</a>

<style>
	img {
		color: transparent; /* hide alt text for lazy load */
	}
	.item {
		display: flex;
		flex-direction: row;
		cursor: pointer;
		border: 1px solid transparent;
		box-sizing: border-box;
		width: 100%;
		align-items:center;
		text-decoration: none;
		color: black;
	}
	.item:hover {
		border: 1px solid #aaa;
		background-color: #ddd;
	}
	.item[data-selected="true"] {
		background-color:#eee;
	}
	.text {
		padding: 0 0.5em;
	}
	.small {
		font-size: 0.6em;
	}
</style>
