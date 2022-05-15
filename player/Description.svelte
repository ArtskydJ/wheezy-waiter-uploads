<script>
	import Date from './Date.svelte'

	export let video

	function escape_html(str) {
		const p = document.createElement('p')
		p.appendChild(document.createTextNode(str))
		return p.innerHTML
	}

	function linkify(text) {
		return text
			.replace(/(?<!(?:\.|\/))(\b(?:[a-z0-9-]+\.)+[a-z0-9-]{2,20}(\/.+?)?)(?: |$)/gi, '<a href="http://$1" title="http://$1">$1</a>')
			.replace(/(?<!(?:>|"))(https?:\/\/[^ \n]+)/g, '<a href="$1" title="$1">$1</a>')
	}
</script>

<div class="meta">
	<Date isoDate={video.publishedAt} />
	<hr />

	<article>{@html linkify(escape_html(video.description))}</article>
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