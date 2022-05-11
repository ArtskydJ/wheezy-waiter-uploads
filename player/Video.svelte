<script>
	export let snippet
	export let width
	export let height
	export let autoplay = false

	$: src = `https://www.youtube.com/embed/${snippet.resourceId.videoId}?ecver=1&autoplay=${autoplay ? 1 : 0}&iv_load_policy=1&yt:stretch=16:9&autohide=1&color=red&width=1280&height=720`
</script>

<iframe title="youtube" allowFullScreen="allowFullScreen" {src} {width} {height} allowtransparency="true" frameborder="0"></iframe>
