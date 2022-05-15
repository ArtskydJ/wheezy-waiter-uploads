<script>
	export let video
	export let width
	export let height
	export let autoplay = false
</script>

<iframe title="youtube" allowFullScreen="allowFullScreen" src="https://www.youtube.com/embed/{video.resourceId.videoId}?ecver=1&autoplay={autoplay ? 1 : 0}&iv_load_policy=1&yt:stretch=16:9&autohide=1&color=red&width=1280&height=720&rel=0" {width} {height} allowtransparency="true" frameborder="0"></iframe>
