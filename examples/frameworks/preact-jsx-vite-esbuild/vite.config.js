import {defineConfig} from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		noDiscovery: true,
		include: [],
	},
	assetsInclude: ['**/*.glb'],
	build: {
		target: 'esnext',
		// FIXME ^ why do private fields get compiled to __pricateAdd(), __privateGet(), etc, although we use esnext?
		minify: false,
	},
	esbuild: {
		minify: false,
		jsx: 'automatic',
		jsxImportSource: 'preact',
		target: 'esnext',
		// FIXME ^ why do private fields get compiled to __pricateAdd(), __privateGet(), etc, although we use esnext?
	},
	resolve: {
		alias: {
			'solid-js': path.resolve('./node_modules/solid-js'),
			'classy-solid': path.resolve('./node_modules/classy-solid'),
		},
	},
})
