<script>
	import Date from './Date.svelte'

	export let snippet

	function linkify(text) {
		return text
			// .replace(/((?:[a-z-]+(\.[a-z-]+)+)[^\. ]*)/gi, '<a href="http://$1" title="http://$1">$1</a>')
			.replace(/(https?:\/\/[^ \n]+)/g, '<a href="$1" title="$1">$1</a>')
	}
</script>

<div class="meta">
	<Date isoDate={snippet.publishedAt} />
	<hr />

	<article>{@html linkify(snippet.description)}</article>
</div>

<style>
	.meta {
		padding: 0 0.5em 2em;
		box-sizing: border-box;
	}
	hr {
		border: 0;
		border-bottom: 1px solid #bbb;
	}
	article {
		white-space: pre-wrap;
	}
</style>