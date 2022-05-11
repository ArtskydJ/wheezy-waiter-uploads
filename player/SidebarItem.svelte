<script>
	import Date from './Date.svelte'
	import { onMount } from 'svelte'

	export let hoverText
	export let isSelected
	export let snippet

	const sizeMultiplier = 0.6

	$: width = snippet.thumbnails.default.width * sizeMultiplier
	$: height = snippet.thumbnails.default.height * sizeMultiplier

	onMount(() => {
		if (isSelected) {
			document.querySelector('.item[data-selected="true"]').scrollIntoView()
		}
	})
</script>

<a class="item" title="{hoverText}" href="#{snippet.resourceId.videoId}" data-selected={isSelected}>
	<img class="lozad" data-src={snippet.thumbnails.default.url} {width} {height} alt="thumbnail" />
	<div class="text">
		{snippet.title}
		<div class="small"><Date isoDate={snippet.publishedAt} /></div>
	</div>
</a>

<style>
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
