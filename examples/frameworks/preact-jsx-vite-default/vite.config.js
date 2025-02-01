import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'

const preactPlugin = preact()

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		noDiscovery: true,
		include: [],
	},
	plugins: [preactPlugin],
	assetsInclude: ['**/*.glb'],
	build: {
		target: 'esnext',
		// FIXME ^ why do private fields get compiled to __pricateAdd(), __privateGet(), etc, although we use esnext?
		minify: false,
	},
})
