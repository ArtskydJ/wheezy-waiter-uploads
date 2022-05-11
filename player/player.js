import Player from './Player.svelte'

new Player({
	target: document.body,
})

const observer = window.lozad()
observer.observe()
