import {Node} from './Node.js'
import {Scene} from './Scene.js'
import {defineElements} from '../index.js'
import {Object3D} from 'three/src/core/Object3D.js'

defineElements()

describe('Node', () => {
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

	it('has default values', async () => {
		const n = new Node()

		expect(n.position.x).toEqual(0)
		expect(n.position.x).toEqual(0)
		expect(n.position.y).toEqual(0)
		expect(n.position.z).toEqual(0)

		expect(n.rotation.x).toEqual(0)
		expect(n.rotation.y).toEqual(0)
		expect(n.rotation.z).toEqual(0)

		expect(n.scale.x).toEqual(1)
		expect(n.scale.y).toEqual(1)
		expect(n.scale.z).toEqual(1)

		expect(n.alignPoint.x).toEqual(0)
		expect(n.alignPoint.y).toEqual(0)
		expect(n.alignPoint.z).toEqual(0)

		expect(n.mountPoint.x).toEqual(0)
		expect(n.mountPoint.y).toEqual(0)
		expect(n.mountPoint.z).toEqual(0)

		expect(n.opacity).toEqual(1)

		expect(n.size.x).toEqual(0, 'default size value not as expected')
		expect(n.size.y).toEqual(0, 'default size value not as expected')
		expect(n.size.z).toEqual(0, 'default size value not as expected')

		expect(n.sizeMode.x).toEqual('literal')
		expect(n.sizeMode.y).toEqual('literal')
		expect(n.sizeMode.z).toEqual('literal')
	})

	it('element is an instance of Node, created with `new`', async () => {
		const n = new Node()

		scene.append(n)

		expect(n instanceof Node).toBe(true)
		expect(n.three).toBeInstanceOf(Object3D)
		expect(n.scene).not.toBeUndefined()
	})

	it('element is an instance of Node, created with `document.createElement`', async () => {
		const n = document.createElement('lume-node')

		scene.append(n)

		expect(n instanceof Node).toBe(true)
		expect(n.three).toBeInstanceOf(Object3D)
		expect(n.scene).not.toBeUndefined()
	})
})
