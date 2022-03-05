import {TreeNode} from './TreeNode.js'

// TreeNode is not normally used as an element, but we define it for these
// tests so that `new` works (otherwise it'll have an IllegalConstructor error
// on the LumeElement base class)
customElements.define('tree-node', TreeNode)

describe('TreeNode', () => {
	it('.constructor', () => {
		expect(typeof TreeNode).toBe('function')

		const t = new TreeNode()

		expect(t.lumeChildren).toEqual([])
		expect(t.parentLumeElement).toBe(null)
		expect(t.lumeChildCount).toBe(0)
	})

	// The below tests are essentially a placeholder for when the day comes to
	// ensure that some DOM-like APIs work in non-DOM environments (f.e. we're
	// planning to bind to OpenGL in Node.js, or in AssemblyScript, without a
	// DOM).

	it('.append(single)', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()

		t.append(a)

		// Adding an already-added node is a no-op.
		expect(() => t.append(a)).not.toThrow()

		expect(t.lumeChildren).toEqual([a])

		t.append(b)

		expect(t.lumeChildren).toEqual([a, b])
	})

	it('.append(...multiple)', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()
		const c = new TreeNode()

		t.append(b, c)

		// If children are re-added, it's a no-op.
		expect(() => t.append(b, c)).not.toThrow()

		expect(t.lumeChildCount).toBe(2)
		expect(t.lumeChildren).toEqual([b, c])

		t.append(a)
		expect(() => t.append(a, b)).not.toThrow()

		expect(t.lumeChildCount).toBe(3)
		expect(t.lumeChildren).toEqual([b, c, a])
	})

	it('.removeChild', () => {
		const t = new TreeNode()
		const a = new TreeNode()
		const b = new TreeNode()
		const c = new TreeNode()

		t.append(b, a, c)

		expect(t.lumeChildCount).toBe(3)
		expect(t.lumeChildren).toEqual([b, a, c])

		t.removeChild(b)
		expect(() => t.removeChild(b)).toThrowError(DOMException)

		expect(t.lumeChildCount).toBe(2)
		expect(t.lumeChildren).toEqual([a, c])

		t.removeChild(a)

		expect(t.lumeChildCount).toBe(1)
		expect(t.lumeChildren).toEqual([c])

		t.removeChild(c)

		expect(t.lumeChildCount).toBe(0)
		expect(t.lumeChildren).toEqual([])
	})
})
