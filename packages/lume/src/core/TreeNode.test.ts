import TreeNode from './TreeNode'

describe('TreeNode', () => {
	it('.constructor', () => {
		expect(typeof TreeNode).toBe('function')

		const t = new TreeNode()

		expect(t.subnodes).toEqual([])
		expect(t.parent).toBe(null)
		expect(t.childCount).toBe(0)
	})

	it('.add', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()

		t.add(a)

		// Adding an already-added node is a no-op.
		expect(() => t.add(a)).not.toThrow()

		expect(t.subnodes).toEqual([a])

		t.add(b)

		expect(t.subnodes).toEqual([a, b])
	})

	it('.addChildren', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()
		const c = new TreeNode()

		t.addChildren([b, c])

		// If children are re-added, it's a no-op.
		expect(() => t.addChildren([b, c])).not.toThrow()

		expect(t.childCount).toBe(2)
		expect(t.subnodes).toEqual([b, c])

		t.addChildren([a])
		expect(() => t.addChildren([a, b])).not.toThrow()

		expect(t.childCount).toBe(3)
		expect(t.subnodes).toEqual([b, c, a])
	})

	it('.removeNode', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()
		const c = new TreeNode()

		t.addChildren([b, a, c])

		expect(t.childCount).toBe(3)
		expect(t.subnodes).toEqual([b, a, c])

		t.removeNode(b)
		expect(() => t.removeNode(b)).toThrowError(ReferenceError, 'childNode is not a child of this parent.')

		expect(t.childCount).toBe(2)
		expect(t.subnodes).toEqual([a, c])

		t.removeNode(a)

		expect(t.childCount).toBe(1)
		expect(t.subnodes).toEqual([c])

		t.removeNode(c)

		expect(t.childCount).toBe(0)
		expect(t.subnodes).toEqual([])
	})

	it('.removeChildren', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()
		const c = new TreeNode()
		const d = new TreeNode()

		t.addChildren([b, a, c, d])

		expect(t.childCount).toBe(4)
		expect(t.subnodes).toEqual([b, a, c, d])

		t.removeChildren([c])
		expect(() => t.removeChildren([c])).toThrowError(ReferenceError, 'childNode is not a child of this parent.')

		expect(t.childCount).toBe(3)
		expect(t.subnodes).toEqual([b, a, d])

		t.removeChildren([b, d])

		expect(t.childCount).toBe(1)
		expect(t.subnodes).toEqual([a])

		t.removeChildren([a])

		expect(t.childCount).toBe(0)
		expect(t.subnodes).toEqual([])
	})

	it('.removeAllChildren', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()
		const c = new TreeNode()
		const d = new TreeNode()

		t.addChildren([b, a, c, d])

		expect(t.childCount).toBe(4)
		expect(t.subnodes).toEqual([b, a, c, d])

		// debugger
		t.removeAllChildren()
		expect(() => t.removeAllChildren()).toThrowError(ReferenceError, 'This node has no children.')

		expect(t.childCount).toBe(0)
		expect(t.subnodes).toEqual([])
	})

	xit('lifecycle callbacks', () => {
		// TODO
		expect(false).toBe(true)
	})
})
