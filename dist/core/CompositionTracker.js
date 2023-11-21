import { Constructor } from 'lowclass';
import { observeChildren } from './utils/observeChildren.js';
import { isDomEnvironment, isScene } from './utils/isThisOrThat.js';
export function CompositionTracker(Base) {
    return class CompositionTracker extends Constructor(Base) {
        // TODO remove isScene and isElement3D from here, sub-classes should filter
        // out undesired elements while CompositionTracker should be generic (and
        // moved to a separate lib).
        // from Scene
        isScene = false;
        // from Element3D
        isElement3D = false;
        // A subclass can set this to false to skip observation of its ShadowRoot.
        skipShadowObservation = false;
        // COMPOSED TREE TRACKING:
        // Overriding HTMLElement.prototype.attachShadow here is part of our
        // implementation for tracking the composed tree and connecting THREE
        // objects in the same structure as the DOM composed tree so that it will
        // render as expected when end users compose elements with ShadowDOM and
        // slots.
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
            // Arrray.from is needed for older Safari which can't iterate on HTMLCollection
            const children = Array.from(this.children);
            for (const child of children) {
                if (!(child instanceof CompositionTracker))
                    continue;
                child.__isPossiblyDistributedToShadowRoot = true;
                this.__triggerChildUncomposedCallback(child, 'actual');
            }
            return root;
        }
        // COMPOSED TREE TRACKING:
        get _hasShadowRoot() {
            return !!this.__shadowRoot;
        }
        // COMPOSED TREE TRACKING:
        get _isPossiblyDistributedToShadowRoot() {
            return this.__isPossiblyDistributedToShadowRoot;
        }
        // COMPOSED TREE TRACKING:
        get _shadowRootParent() {
            return this.__shadowRootParent;
        }
        get _shadowRootChildren() {
            if (!this.__shadowRoot)
                return [];
            return Array.from(this.__shadowRoot.children).filter((n) => n instanceof CompositionTracker);
        }
        // COMPOSED TREE TRACKING: Elements that are distributed to a slot that is
        // child of a ShadowRoot of this element.
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
        // COMPOSED TREE TRACKING:
        get _distributedParent() {
            return this.__distributedParent;
        }
        // COMPOSED TREE TRACKING:
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
        // COMPOSED TREE TRACKING: The composed parent is the parent that this element renders relative
        // to in the flat tree (composed tree).
        __getComposedParent() {
            let parent = this.parentElement;
            // Special case only for Nodes that are children of a Scene.
            // TODO filtering should be done by subclasses
            if (parent && isScene(parent))
                return parent;
            parent = this.__distributedParent || this.__shadowRootParent;
            // Shortcut in case we have already detected distributed or shadowRoot parent.
            if (parent)
                return parent;
            parent = this.parentNode;
            if (parent instanceof HTMLSlotElement) {
                const slot = parent;
                // If this element is a child of a <slot> element (i.e. this
                // element is a slot's default content), then return null if the
                // slot has anything slotted to it in which case default content
                // does not participate in the composed tree.
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
                // a child of a host with a shadow has a composed parent if the child is slotted
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
        // COMPOSED TREE TRACKING: Composed children are the children that render relative to this
        // element in the flat tree (composed tree), whether as children of a
        // shadow root, or distributed children (assigned nodes) of a <slot>
        // element.
        get _composedChildren() {
            if (this.__shadowRoot) {
                return [...this._distributedShadowRootChildren, ...this._shadowRootChildren];
            }
            else {
                return [
                    ...(this.__distributedChildren || []),
                    // We only care about other nodes of the same type.
                    ...Array.from(this.children).filter((n) => n instanceof CompositionTracker),
                ];
            }
        }
        // COMPOSED TREE TRACKING: This element's shadow root, if any. This always points to the shadow
        // root, even if it is a closed root, unlike the public shadowRoot
        // property.
        __shadowRoot;
        // COMPOSED TREE TRACKING: True when this element has a parent that has a shadow root.
        __isPossiblyDistributedToShadowRoot = false;
        __prevAssignedNodes;
        // COMPOSED TREE TRACKING:
        // A map of the slot elements that are children of this element and
        // their last-known assigned elements. When a slotchange happens while
        // this element is in a shadow root and has a slot child, we can
        // detect what the difference is between the last known assigned elements and the new
        // ones.
        get __previousSlotAssignedNodes() {
            if (!this.__prevAssignedNodes)
                this.__prevAssignedNodes = new WeakMap();
            return this.__prevAssignedNodes;
        }
        // COMPOSED TREE TRACKING:
        // If this element is distributed into a shadow tree, this will
        // reference the parent element of the <slot> element where this element is
        // distributed to. This element will render as a child of
        // that parent element in the flat tree (composed tree).
        __distributedParent = null;
        // COMPOSED TREE TRACKING:
        // If this element is a top-level child of a shadow root, then this points
        // to the shadow root host. The shadow root host is the prent element that
        // this element renders relative to in the flat tree (composed tree).
        __shadowRootParent = null;
        // COMPOSED TREE TRACKING:
        // If this element has a child <slot> element while in
        // a shadow root, then this will be a Set of the nodes distributed
        // into the <slot>, and those nodes render relatively
        // to this element in the flat tree. We instantiate this later, only
        // when/if needed.
        __distributedChildren;
        // COMPOSED TREE TRACKING: Called when a child is added to the ShadowRoot of this element.
        // This does not run for Scene instances, which already have a root for their rendering implementation.
        __shadowRootChildAdded(child) {
            // NOTE Logic here is similar to childConnectedCallback
            if (child instanceof CompositionTracker) {
                child.__shadowRootParent = this;
                this.__triggerChildComposedCallback(child, 'root');
            }
            else if (child instanceof HTMLSlotElement) {
                child.addEventListener('slotchange', this.__onChildSlotChange);
                this.__handleDistributedChildren(child);
            }
        }
        // COMPOSED TREE TRACKING: Called when a child is removed from the ShadowRoot of this element.
        // This does not run for Scene instances, which already have a root for their rendering implementation.
        __shadowRootChildRemoved(child) {
            // NOTE Logic here is similar to childDisconnectedCallback
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
        // COMPOSED TREE TRACKING: Called when a slot child of this element emits a slotchange event.
        // TODO we need an @lazy decorator instead of making this a getter manually.
        get __onChildSlotChange() {
            if (this.__onChildSlotChange__)
                return this.__onChildSlotChange__;
            this.__onChildSlotChange__ = (event) => {
                // event.currentTarget is the slot that this event handler is on,
                // while event.target is always the slot from the ancestor-most
                // tree if that slot is assigned to this slot or another slot that
                // ultimate distributes to this slot.
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
            // The theory is we don't need to defer here like we did in
            // __triggerChildComposedCallback because if an element is uncomposed,
            // it won't load anything even if its class gets defined later.
            child.__composedParent = null;
            this.childUncomposedCallback?.(child, connectionType);
        }
        // COMPOSED TREE TRACKING: This is called in certain cases when distributed
        // children may have changed, f.e. when a slot was added to this element, or
        // when a child slot of this element has had assigned nodes changed
        // (slotchange).
        __handleDistributedChildren(slot) {
            const diff = this.__getDistributedChildDifference(slot);
            const { added } = diff;
            for (let l = added.length, i = 0; i < l; i += 1) {
                const addedNode = added[i];
                if (!(addedNode instanceof CompositionTracker))
                    continue;
                // Keep track of the final distribution of a node.
                //
                // If the given slot is assigned to another
                // slot, then this logic will run again for the next slot on
                // that next slot's slotchange, so we remove the distributed
                // node from the previous distributedParent and add it to the next
                // one. If we don't do this, then the distributed node will
                // exist in multiple distributedChildren lists when there is a
                // chain of assigned slots. For more info, see
                // https://github.com/w3c/webcomponents/issues/611
                const distributedParent = addedNode.__distributedParent;
                if (distributedParent) {
                    const distributedChildren = distributedParent.__distributedChildren;
                    if (distributedChildren) {
                        distributedChildren.delete(addedNode);
                        if (!distributedChildren.size)
                            distributedParent.__distributedChildren = undefined;
                    }
                }
                // The node is now distributed to `this` element.
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
        // COMPOSED TREE TRACKING: Get the difference between the last assigned
        // elements and current assigned elements of a child slot of this element.
        __getDistributedChildDifference(slot) {
            const previousNodes = this.__previousSlotAssignedNodes.get(slot) ?? [];
            // If this slot is assigned to another slot, then we don't consider any
            // of the slot's assigned nodes as being distributed to the current element,
            // because instead they are distributed to an element further down in the
            // composed tree where this slot is assigned to.
            //
            // Special case for Scenes: we don't care if slot children of a Scene
            // distribute to a deeper slot, because a Scene's ShadowRoot is for the rendering
            // implementation and not the user's distribution, so we only want to detect
            // elements slotted directly to the Scene in that case.
            // TODO filtering should be done by subclasses
            // TODO move filtering to parent
            const newNodes = !this.isScene && slot.assignedSlot ? [] : slot.assignedElements({ flatten: true });
            // Save the newNodes to be used as the previousNodes for next time
            // (clone it so the following in-place modification doesn't ruin any
            // assumptions in the next round).
            this.__previousSlotAssignedNodes.set(slot, [...newNodes]);
            const diff = {
                added: newNodes,
                removed: [],
            };
            for (let i = 0, l = previousNodes.length; i < l; i += 1) {
                const oldNode = previousNodes[i];
                const newIndex = newNodes.indexOf(oldNode);
                // if it exists in the previousNodes but not the newNodes, then
                // the node was removed.
                if (!(newIndex >= 0)) {
                    diff.removed.push(oldNode);
                }
                // otherwise the node wasn't added or removed.
                else {
                    newNodes.splice(i, 1);
                }
            }
            // The remaining nodes in newNodes must have been added.
            return diff;
        }
        traverseComposed(visitor, waitForUpgrade = false) {
            if (!waitForUpgrade) {
                for (const child of this._composedChildren)
                    child.traverseComposed(visitor, waitForUpgrade);
                return;
            }
            // if waitForUpgrade is true, we make a promise chain so that traversal
            // order is still the same as when waitForUpgrade is false.
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