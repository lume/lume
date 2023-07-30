import {Element3D} from './Element3D.js'
import {Scene} from './Scene.js'
import '../index.js'
import {Object3D} from 'three/src/core/Object3D.js'

describe('Element3D', () => {
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
		const n = new Element3D()

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

	it('element is an instance of Element3D, created with `new`', async () => {
		const n = new Element3D()

		scene.append(n)

		expect(n instanceof Element3D).toBe(true)
		expect(n.three).toBeInstanceOf(Object3D)
		expect(n.scene).not.toBeUndefined()
	})

	it('element is an instance of Element3D, created with `document.createElement`', async () => {
		const n = document.createElement('lume-element3d')

		scene.append(n)

		expect(n instanceof Element3D).toBe(true)
		expect(n.three).toBeInstanceOf(Object3D)
		expect(n.scene).not.toBeUndefined()
	})
})
