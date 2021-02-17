import Node from './Node.js'
import Scene from './Scene.js'
import {useDefaultNames} from '../html/index.js'

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

		expect(n.getPosition().x).toEqual(0)
		expect(n.getPosition().y).toEqual(0)
		expect(n.getPosition().z).toEqual(0)

		expect(n.getRotation().x).toEqual(0)
		expect(n.getRotation().y).toEqual(0)
		expect(n.getRotation().z).toEqual(0)

		expect(n.getScale().x).toEqual(1)
		expect(n.getScale().y).toEqual(1)
		expect(n.getScale().z).toEqual(1)

		expect(n.getAlign().x).toEqual(0)
		expect(n.getAlign().y).toEqual(0)
		expect(n.getAlign().z).toEqual(0)

		expect(n.getMountPoint().x).toEqual(0)
		expect(n.getMountPoint().y).toEqual(0)
		expect(n.getMountPoint().z).toEqual(0)

		expect(n.getOpacity()).toEqual(1)

		expect(n.getSize().x).toEqual(0, 'default size value not as expected')
		expect(n.getSize().y).toEqual(0, 'default size value not as expected')
		expect(n.getSize().z).toEqual(0, 'default size value not as expected')

		expect(n.getSizeMode().x).toEqual('literal')
		expect(n.getSizeMode().y).toEqual('literal')
		expect(n.getSizeMode().z).toEqual('literal')
	})

	it('element is an instance of Node, created with `new`', async () => {
		const n = new Node()

		scene.add(n)

		expect(n instanceof Node).toBe(true)
		// expect(n.constructor.name).toBe('Node') // Not reliable, minification can mangle the names, or decorators can inject constructors with differing names.
		expect(n.three).not.toBeUndefined()
		expect(n.scene).not.toBeUndefined()
		// expect(n.scene.constructor.name).toBe('Scene') // Not reliable, minification can mangle the names, or decorators can inject constructors with differing names.
	})

	it('element is an instance of Node, created with `document.createElement`', async () => {
		// TODO: is there a better way than casting the result of createElement?
		const n = document.createElement('lume-node') as Node

		scene.add(n)

		expect(n instanceof Node).toBe(true)
		// expect(n.constructor.name).toBe('Node') // Not reliable, minification can mangle the names, or decorators can inject constructors with differing names.
		expect(n.three).not.toBeUndefined()
		expect(n.scene).not.toBeUndefined()
		// expect(n.scene.constructor.name).toBe('Scene') // Not reliable, minification can mangle the names, or decorators can inject constructors with differing names.
	})
})
