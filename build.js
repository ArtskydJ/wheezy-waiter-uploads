import esbuild from 'esbuild'
import svelte from 'esbuild-svelte'

const dir = process.argv[2]

esbuild
	.build({
		entryPoints: [ `./${dir}/${dir}.js` ],
		mainFields: [ 'svelte', 'browser', 'module', 'main' ],
		bundle: true,
		outfile: `./docs/${dir}.bundle.js`,
		plugins: [
			svelte(),
		],
		logLevel: 'info',
	})
	.catch(() => process.exit(1))
