import { Eventful } from '@lume/eventful';
import { Element as LumeElement } from '@lume/element';
import { Effectful } from './Effectful.js';
export class TreeNode extends Effectful(Eventful(LumeElement)) {
    get parentLumeElement() {
        if (this.parentElement instanceof TreeNode)
            return this.parentElement;
        return null;
    }
    get lumeChildren() {
        return Array.prototype.filter.call(this.children, c => c instanceof TreeNode);
    }
    get lumeChildCount() {
        return this.lumeChildren.length;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopEffects();
    }
}
//# sourceMappingURL=TreeNode.js.map