import {Node} from './Node.js'
import {Scene} from './Scene.js'
import {useDefaultNames} from '../index.js'

useDefaultNames()

describe('ImperativeBase', () => {
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
			const n = new Node()

			expect(n.scene).toBe(null)
			expect(scene.scene).toBe(scene)

			scene.append(n)
			await Promise.resolve() // allow MutationObserver to operate first.
			expect(n.scene).toBe(scene)

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
