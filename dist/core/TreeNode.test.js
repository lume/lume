import { TreeNode } from './TreeNode.js';
customElements.define('tree-node', TreeNode);
describe('TreeNode', () => {
    it('.constructor', () => {
        expect(typeof TreeNode).toBe('function');
        const t = new TreeNode();
        expect(t.lumeChildren).toEqual([]);
        expect(t.parentLumeElement).toBe(null);
        expect(t.lumeChildCount).toBe(0);
    });
    it('.append(single)', () => {
        const t = new TreeNode();
        const a = new TreeNode();
        const b = new TreeNode();
        t.append(a);
        expect(() => t.append(a)).not.toThrow();
        expect(t.lumeChildren).toEqual([a]);
        t.append(b);
        expect(t.lumeChildren).toEqual([a, b]);
    });
    it('.append(...multiple)', () => {
        const t = new TreeNode();
        const a = new TreeNode();
        const b = new TreeNode();
        const c = new TreeNode();
        t.append(b, c);
        expect(() => t.append(b, c)).not.toThrow();
        expect(t.lumeChildCount).toBe(2);
        expect(t.lumeChildren).toEqual([b, c]);
        t.append(a);
        expect(() => t.append(a, b)).not.toThrow();
        expect(t.lumeChildCount).toBe(3);
        expect(t.lumeChildren).toEqual([b, c, a]);
    });
    it('.removeChild', () => {
        const t = new TreeNode();
        const a = new TreeNode();
        const b = new TreeNode();
        const c = new TreeNode();
        t.append(b, a, c);
        expect(t.lumeChildCount).toBe(3);
        expect(t.lumeChildren).toEqual([b, a, c]);
        t.removeChild(b);
        expect(() => t.removeChild(b)).toThrowError(DOMException);
        expect(t.lumeChildCount).toBe(2);
        expect(t.lumeChildren).toEqual([a, c]);
        t.removeChild(a);
        expect(t.lumeChildCount).toBe(1);
        expect(t.lumeChildren).toEqual([c]);
        t.removeChild(c);
        expect(t.lumeChildCount).toBe(0);
        expect(t.lumeChildren).toEqual([]);
    });
});
//# sourceMappingURL=TreeNode.test.js.map