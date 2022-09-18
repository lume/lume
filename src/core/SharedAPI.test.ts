import {createEffect, createRoot} from 'solid-js'
import {Element3D} from './Element3D.js'
import {Scene} from './Scene.js'
import {defineElements} from '../index.js'

defineElements()

describe('SharedAPI', () => {
	const root = document.createElement('div')
	document.body.append(root)
	let scene = new Scene()
	root.append(scene)

	function newScene() {
		root.innerHTML = ''
		scene = new Scene()
		root.append(scene)
	}

	afterEach(() => {
		newScene()
	})

	describe('.scene', () => {
		it('tells us what scene a node is in', async () => {
			const n = new Element3D()

			expect(n.scene).toBe(null)
			expect(scene.scene).toBe(scene)

			scene.append(n)

			// It is reactive
			let count = 0
			// CONTINUE switched from variable to solid/classy-solid, make sure it works
			const stop = createRoot(stop => {
				createEffect(() => {
					count++
					if (count === 1) expect(n.scene).toBe(null)
					else if (count === 2) expect(n.scene).toBe(scene)
				})

				return stop
			})

			await Promise.resolve() // allow MutationObserver to operate first.
			expect(n.scene).toBe(scene)
			expect(count).toBe(2)
			stop()

			n.remove()
			expect(n.scene).toBe(null)

			// make sure it changes scenes without first disconnecting

			newScene()
			scene.append(n)
			await Promise.resolve() // allow MutationObserver to operate first.
			expect(n.scene).toBe(scene)

			const scene2 = new Scene()
			root.append(scene2)
			scene2.append(n)
			await Promise.resolve() // allow MutationObserver to operate first.
			expect(n.scene).toBe(scene2)

			newScene()
			expect(n.scene).toBe(null)
		})
	})
})
