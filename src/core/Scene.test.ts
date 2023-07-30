import '../index.js'

describe('Scene', () => {
	let container: HTMLDivElement = document.createElement('div')
	const root = document.createElement('div')
	document.body.append(root)

	beforeEach(() => {
		root.append((container = document.createElement('div')))
	})

	afterEach(() => {
		root.innerHTML = ''
	})

	describe('swapLayers', () => {
		it('allows us to swap the layer order of the CSS and WebGL layers', () => {
			const scene = document.createElement('lume-scene')
			container.append(scene)

			expect(scene.swapLayers).toBe(false)
			expect((scene.shadowRoot?.querySelector('.CSS3DLayer') as HTMLElement).style.zIndex).toBe('')

			scene.swapLayers = true

			// A z-index of 1 puts CSS on top of WebGL, otherwise its DOM order normally puts it below.
			expect((scene.shadowRoot?.querySelector('.CSS3DLayer') as HTMLElement).style.zIndex).toBe('1')
		})
	})
})
