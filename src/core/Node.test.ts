import Node from './Node'
import Scene from './Scene'
import {useDefaultNames} from '../html'

useDefaultNames()

describe('Node', () => {
	let scene = new Scene()
	const body = document.body

	afterEach(() => {
		scene.unmount()
		body.innerHTML = ''
		scene = new Scene()
		scene.mount(body)
	})

	it('default values', async () => {
		const n = new Node()

		expect(n.position.x).toEqual(0)
		expect(n.position.y).toEqual(0)
		expect(n.position.z).toEqual(0)

		expect(n.rotation.x).toEqual(0)
		expect(n.rotation.y).toEqual(0)
		expect(n.rotation.z).toEqual(0)

		expect(n.scale.x).toEqual(1)
		expect(n.scale.y).toEqual(1)
		expect(n.scale.z).toEqual(1)

		expect(n.align.x).toEqual(0)
		expect(n.align.y).toEqual(0)
		expect(n.align.z).toEqual(0)

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

		scene.add(n)

		expect(n instanceof Node).toBe(true)
		expect(n.constructor.name).toBe('Node')
		expect(n.three).not.toBeUndefined()
		expect(n.scene).not.toBeUndefined()
		expect(n.scene.constructor.name).toBe('Scene')
	})

	it('element is an instance of Node, created with `document.createElement`', async () => {
		// TODO: is there a better way than casting the result of createElement?
		const n = document.createElement('i-node') as Node

		scene.add(n)

		expect(n instanceof Node).toBe(true)
		expect(n.constructor.name).toBe('Node')
		expect(n.three).not.toBeUndefined()
		expect(n.scene).not.toBeUndefined()
		expect(n.scene.constructor.name).toBe('Scene')
	})
})
