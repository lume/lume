import { Constructor } from 'lowclass';
import { observeChildren } from './utils/observeChildren.js';
import { isDomEnvironment, isScene } from './utils/isThisOrThat.js';
export function CompositionTracker(Base) {
    return class CompositionTracker extends Constructor(Base) {
        isScene = false;
        isElement3D = false;
        skipShadowObservation = false;
        attachShadow(options) {
            const root = super.attachShadow(options);
            if (this.skipShadowObservation)
                return root;
            this.__shadowRoot = root;
            observeChildren({
                target: root,
                onConnect: this.__shadowRootChildAdded.bind(this),
                onDisconnect: this.__shadowRootChildRemoved.bind(this),
                skipTextNodes: true,
            });
            const children = Array.from(this.children);
            for (const child of children) {
                if (!(child instanceof CompositionTracker))
                    continue;
                child.__isPossiblyDistributedToShadowRoot = true;
                this.__triggerChildUncomposedCallback(child, 'actual');
            }
            return root;
        }
        get _hasShadowRoot() {
            return !!this.__shadowRoot;
        }
        get _isPossiblyDistributedToShadowRoot() {
            return this.__isPossiblyDistributedToShadowRoot;
        }
        get _shadowRootParent() {
            return this.__shadowRootParent;
        }
        get _shadowRootChildren() {
            if (!this.__shadowRoot)
                return [];
            return Array.from(this.__shadowRoot.children).filter((n) => n instanceof CompositionTracker);
        }
        get _distributedShadowRootChildren() {
            const result = [];
            for (const child of Array.from(this.__shadowRoot?.children || [])) {
                if (child instanceof HTMLSlotElement && !child.assignedSlot) {
                    for (const distributed of child.assignedElements({ flatten: true })) {
                        if (distributed instanceof CompositionTracker)
                            result.push(distributed);
                    }
                }
            }
            return result;
        }
        get _distributedParent() {
            return this.__distributedParent;
        }
        get _distributedChildren() {
            return this.__distributedChildren ? [...this.__distributedChildren] : null;
        }
        __composedParent = null;
        get composedParent() {
            let result = this.__composedParent;
            if (!result) {
                result = this.__getComposedParent();
            }
            return result;
        }
        __getComposedParent() {
            let parent = this.parentElement;
            if (parent && isScene(parent))
                return parent;
            parent = this.__distributedParent || this.__shadowRootParent;
            if (parent)
                return parent;
            parent = this.parentNode;
            if (parent instanceof HTMLSlotElement) {
                const slot = parent;
                if (slot.assignedElements({ flatten: true }).length)
                    return null;
                const slotParent = slot.parentNode;
                if (slotParent instanceof ShadowRoot)
                    return slotParent.host;
                else
                    return slot.parentElement;
            }
            else if (parent instanceof ShadowRoot) {
                return parent.host;
            }
            else if (parent instanceof HTMLElement) {
                if (!hasShadow(parent))
                    return parent;
                const slot = this.assignedSlot;
                if (!slot)
                    return null;
                const slotParent = slot.parentNode;
                if (slotParent instanceof ShadowRoot)
                    return slotParent.host;
                else
                    return slot.parentElement;
            }
            return null;
        }
        get _composedChildren() {
            if (this.__shadowRoot) {
                return [...this._distributedShadowRootChildren, ...this._shadowRootChildren];
            }
            else {
                return [
                    ...(this.__distributedChildren || []),
                    ...Array.from(this.children).filter((n) => n instanceof CompositionTracker),
                ];
            }
        }
        __shadowRoot;
        __isPossiblyDistributedToShadowRoot = false;
        __prevAssignedNodes;
        get __previousSlotAssignedNodes() {
            if (!this.__prevAssignedNodes)
                this.__prevAssignedNodes = new WeakMap();
            return this.__prevAssignedNodes;
        }
        __distributedParent = null;
        __shadowRootParent = null;
        __distributedChildren;
        __shadowRootChildAdded(child) {
            if (child instanceof CompositionTracker) {
                child.__shadowRootParent = this;
                this.__triggerChildComposedCallback(child, 'root');
            }
            else if (child instanceof HTMLSlotElement) {
                child.addEventListener('slotchange', this.__onChildSlotChange);
                this.__handleDistributedChildren(child);
            }
        }
        __shadowRootChildRemoved(child) {
            if (child instanceof CompositionTracker) {
                child.__shadowRootParent = null;
                this.__triggerChildUncomposedCallback(child, 'root');
            }
            else if (child instanceof HTMLSlotElement) {
                child.removeEventListener('slotchange', this.__onChildSlotChange, { capture: true });
                this.__handleDistributedChildren(child);
                this.__previousSlotAssignedNodes.delete(child);
            }
        }
        get __onChildSlotChange() {
            if (this.__onChildSlotChange__)
                return this.__onChildSlotChange__;
            this.__onChildSlotChange__ = (event) => {
                const slot = event.currentTarget;
                this.__handleDistributedChildren(slot);
            };
            return this.__onChildSlotChange__;
        }
        __onChildSlotChange__;
        __triggerChildComposedCallback(child, connectionType) {
            if (!this.childComposedCallback)
                return;
            const isUpgraded = child.matches(':defined');
            if (isUpgraded) {
                child.__composedParent = this;
                this.childComposedCallback(child, connectionType);
            }
            else {
                customElements.whenDefined(child.tagName.toLowerCase()).then(() => {
                    child.__composedParent = this;
                    this.childComposedCallback(child, connectionType);
                });
            }
        }
        __triggerChildUncomposedCallback(child, connectionType) {
            child.__composedParent = null;
            this.childUncomposedCallback?.(child, connectionType);
        }
        __handleDistributedChildren(slot) {
            const diff = this.__getDistributedChildDifference(slot);
            const { added } = diff;
            for (let l = added.length, i = 0; i < l; i += 1) {
                const addedNode = added[i];
                if (!(addedNode instanceof CompositionTracker))
                    continue;
                const distributedParent = addedNode.__distributedParent;
                if (distributedParent) {
                    const distributedChildren = distributedParent.__distributedChildren;
                    if (distributedChildren) {
                        distributedChildren.delete(addedNode);
                        if (!distributedChildren.size)
                            distributedParent.__distributedChildren = undefined;
                    }
                }
                addedNode.__distributedParent = this;
                if (!this.__distributedChildren)
                    this.__distributedChildren = new Set();
                this.__distributedChildren.add(addedNode);
                this.__triggerChildComposedCallback(addedNode, 'slot');
            }
            const { removed } = diff;
            for (let l = removed.length, i = 0; i < l; i += 1) {
                const removedNode = removed[i];
                if (!(removedNode instanceof CompositionTracker))
                    continue;
                removedNode.__distributedParent = null;
                this.__distributedChildren.delete(removedNode);
                if (!this.__distributedChildren.size)
                    this.__distributedChildren = undefined;
                this.__triggerChildUncomposedCallback(removedNode, 'slot');
            }
        }
        __getDistributedChildDifference(slot) {
            const previousNodes = this.__previousSlotAssignedNodes.get(slot) ?? [];
            const newNodes = !this.isScene && slot.assignedSlot ? [] : slot.assignedElements({ flatten: true });
            this.__previousSlotAssignedNodes.set(slot, [...newNodes]);
            const diff = {
                added: newNodes,
                removed: [],
            };
            for (let i = 0, l = previousNodes.length; i < l; i += 1) {
                const oldNode = previousNodes[i];
                const newIndex = newNodes.indexOf(oldNode);
                if (!(newIndex >= 0)) {
                    diff.removed.push(oldNode);
                }
                else {
                    newNodes.splice(i, 1);
                }
            }
            return diff;
        }
        traverseComposed(visitor, waitForUpgrade = false) {
            if (!waitForUpgrade) {
                for (const child of this._composedChildren)
                    child.traverseComposed(visitor, waitForUpgrade);
                return;
            }
            let promise = Promise.resolve();
            for (const child of this._composedChildren) {
                const isUpgraded = child.matches(':defined');
                if (isUpgraded) {
                    promise = promise.then(() => child.traverseComposed(visitor, waitForUpgrade));
                }
                else {
                    promise = promise
                        .then(() => customElements.whenDefined(child.tagName.toLowerCase()))
                        .then(() => child.traverseComposed(visitor, waitForUpgrade));
                }
            }
            return promise;
        }
    };
}
const shadowHosts = new WeakSet();
if (isDomEnvironment()) {
    const original = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function attachShadow(...args) {
        const result = original.apply(this, args);
        shadowHosts.add(this);
        return result;
    };
}
export function hasShadow(el) {
    return shadowHosts.has(el);
}
//# sourceMappingURL=CompositionTracker.js.map