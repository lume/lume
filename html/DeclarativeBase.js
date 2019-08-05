"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeclarativeBase = initDeclarativeBase;
exports.default = exports.DeclarativeBase = void 0;

var _WebComponent = _interopRequireDefault(require("./WebComponent"));

var _Utility = require("../core/Utility");

var _lowclass = require("lowclass");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global HTMLSlotElement */
const observers = new WeakMap(); // using isNode instead of instanceof HTMLNode to avoid runtime reference,
// thus prevent circular dependency between this module and HTMLNode
// TODO consolidate with one in ImperativeBase

function isNode(n) {
  return n.isNode;
}

initDeclarativeBase();

function initDeclarativeBase() {
  if (!DeclarativeBase) exports.default = exports.DeclarativeBase = DeclarativeBase = makeDeclarativeBase();
}

function makeDeclarativeBase() {
  var _a;
  /**
   * @implements {EventListener}
   */


  return _a = class DeclarativeBase extends (0, _lowclass.Constructor)(_WebComponent.default) {
    constructor() {
      super(...arguments); // from Scene
      // TODO PossiblyScene type for this mixin?

      this.isScene = false; // from HTMLNode
      // TODO PossiblyHTMLNode type for this mixin?

      this.isNode = false; // This node's shadow root, if any. This always points to the shadow
      // root, even if it is a closed root, unlike the public shadowRoot
      // property.

      this.__shadowRoot = null; // All <slot> elements of this node, if any.

      this.__slots = null; // True when this node has a parent that has a shadow root. When
      // using the HTML API, Imperative API can look at this to determine
      // whether to render this node or not, in the case of WebGL.

      this.__isPossiblyDistributedToShadowRoot = false; // A map of the slot elements that are children of this node and
      // their last-known assigned nodes. When a slotchange happens while
      // this node is in a shadow root and has a slot child, we can
      // detect what the difference is between the last known and the new
      // assignments, and notate the new distribution of child nodes. See
      // issue #40 for background on why we do this.

      this.__previousSlotAssignedNodes = new WeakMap(); // If this node is distributed into a shadow tree, this will
      // reference the parent of the <slot> element where this node is
      // distribuetd to. Basically, this node will render as a child of
      // that parent node in the flat tree (composed tree).

      this.__distributedParent = null; // If this node is a top-level child of a shadow root, then this
      // points to the parent of the shadow root. The shadow root parent
      // is the node that this node renders relative to in the flat tree
      // (composed tree).

      this.__shadowRootParent = null;
      this.__isComposed = false; // get __isComposed() {
      //     return this.__distributedParent || this.__shadowRootParent
      // },
      // If this element has a child <slot> element while in
      // a shadow root, then this will be a Set of the nodes distributed
      // into the <slot>, and those nodes render relatively
      // to this node in the flat tree. We instantiate this later, only
      // when/if needed.

      this.__distributedChildren = null;
    }

    static define(name) {
      name = name || this.defaultElementName;
      customElements.define(name, this);
      this._definedElementName = name; // TODO static protected members in lowclass
    }

    static get definedElementName() {
      return this._definedElementName || null;
    } // We use this to Override HTMLElement.prototype.attachShadow in v1 so
    // that we can make the connection between parent and child on the
    // imperative side when the HTML side is using shadow roots.


    attachShadow(options) {
      const root = super.attachShadow(options);
      this.__shadowRoot = root;
      const observer = (0, _Utility.observeChildren)(root, this.__shadowRootChildAdded.bind(this), this.__shadowRootChildRemoved.bind(this), true);
      observers.set(root, observer); // Arrray.from isn't needed for older Safari which can't iterate on HTMLCollection

      const children = Array.from(this.children);

      for (const child of children) {
        // debugger
        if (!(child instanceof DeclarativeBase)) continue; // TODO replace this with generic private access for
        // any object, so we can check instanceof HTMLElement instead of
        // DeclarativeBase, and make it more generic?

        child.__isPossiblyDistributedToShadowRoot = true;
        console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, BY ADDING SHADOW ROOT', child.constructor.name, child.id);

        this.__childUncomposedCallback(child, 'slot');
      }

      return root;
    }

    childConnectedCallback(child) {
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4'); // mirror the DOM connections in the imperative API's virtual scene graph.

      if (isNode(child)) {
        console.log(' ----------------------- childConnectedCallback', this.constructor.name, child.constructor.name, child.id);

        if (!this.isScene && this.__shadowRoot) {
          console.log(' *************** parent has shadow, dont compose child here', this.tagName);
          child.__isPossiblyDistributedToShadowRoot = true;
        } else {
          // If there's no shadow root, call the childComposedCallback
          // with connection type "actual". This is effectively
          // similar to childConnectedCallback.
          console.log('   >>>>>>>>>>>>>>> CHILD SHOULD BE COMPOSED, NORMALLY', child.constructor.name, child.id); // debugger

          this.__childComposedCallback(child, 'actual');
        }
      } else if (_Utility.hasShadowDomV1 && child instanceof HTMLSlotElement) {
        if (!this.__slots) this.__slots = [];

        this.__slots.push(child);

        child.addEventListener('slotchange', // @ts-ignore: allow handleEvent to be protected (upstream
        // type needs update, the addEventListener method expects it
        // to be public)
        this); // TODO do we need __handleDistributedChildren for initial
        // slotted nodes? Or does `slotchange` conver that? Also, does
        // `slotchange` fire for distributed slots? Or do we need to
        // also look at assigned nodes of distributed slots in the
        // initial __handleDistributedChildren call?

        this.__handleDistributedChildren(child
        /*, true*/
        );
      }
    }

    childDisconnectedCallback(child) {
      // mirror the connection in the imperative API's virtual scene graph.
      if (isNode(child)) {
        if (this.__shadowRoot) {
          child.__isPossiblyDistributedToShadowRoot = false;
        } else {
          // If there's no shadow root, call the
          // childUncomposedCallback with connection type "actual".
          // This is effectively similar to childDisconnectedCallback.
          console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, NORMALLY', child.constructor.name, child.id);

          this.__childUncomposedCallback(child, 'actual');
        }
      } else if (_Utility.hasShadowDomV1 && child instanceof HTMLSlotElement) {
        child.removeEventListener('slotchange', // @ts-ignore: allow handleEvent to be protected (upstream
        // type needs update, the addEventListener method expects it
        // to be public)
        this);

        this.__slots.splice(this.__slots.indexOf(child), 1);

        if (!this.__slots.length) this.__slots = null;

        this.__handleDistributedChildren(child);

        this.__previousSlotAssignedNodes.delete(child);
      }
    } // TODO use this to render only to WebGL without HTMLElements.


    get hasHtmlApi() {
      if (this instanceof HTMLElement) return true;
      return false;
    } // Traverses a tree while considering ShadowDOM disribution.
    //
    // This isn't used for anything at the moment. It was going to be used
    // to traverse the composed tree and render using our own WebGL
    // renderer, but at the moment we're using Three.js nodes and composing
    // them in the structured of the composed tree, then Three.js handles
    // the traversal for rendering the WebGL.


    traverseComposed(isShadowChild) {
      console.log(isShadowChild ? 'distributedNode:' : 'node:', this); // in the future, the user will be use a pure-JS API with no HTML
      // DOM API.

      const hasHtmlApi = this.hasHtmlApi;
      const {
        children
      } = this;

      for (let l = children.length, i = 0; i < l; i += 1) {
        const child = children[i];
        if (!(child instanceof DeclarativeBase)) continue; // skip nodes that are possiblyDistributed, i.e. they have a parent
        // that has a ShadowRoot.

        if ((!hasHtmlApi || !child.__isPossiblyDistributedToShadowRoot) && child.traverseComposed) child.traverseComposed();
      }

      const distributedChildren = this.__distributedChildren;

      if (hasHtmlApi && distributedChildren) {
        for (const shadowChild of distributedChildren) shadowChild.traverseComposed(true);
      }
    } // TODO: make setAttribute accept non-string values.


    setAttribute(attr, value) {
      //if (this.tagName.toLowerCase() == 'motor-scene')
      //console.log('setting attribute', arguments[1])
      super.setAttribute(attr, value);
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

    get _distributedParent() {
      return this.__distributedParent;
    }

    get _distributedChildren() {
      return this.__distributedChildren ? [...this.__distributedChildren] : null;
    } // The composed parent is the parent that this node renders relative
    // to in the flat tree (composed tree).


    get _composedParent() {
      return this.__distributedParent || this.__shadowRootParent || this.parentElement;
    } // Composed children are the children that render relative to this
    // node in the flat tree (composed tree), whether as children of a
    // shadow root, or distributed children (assigned nodes) of a <slot>
    // element.


    get _composedChildren() {
      if (this.__shadowRoot) {
        return [...Array.prototype.filter.call(this.__shadowRoot.children, n => n instanceof DeclarativeBase)];
      } else {
        return [...(this.__distributedChildren || []), ...Array.from(this.children)];
      }
    }

    __shadowRootChildAdded(child) {
      // NOTE Logic here is similar to childConnectedCallback
      if (child instanceof DeclarativeBase) {
        child.__shadowRootParent = this; // this.add(child)
        // this.possiblyLoadThree(child)

        console.log('   >>>>>>>>>>>>>>> CHILD SHOULD BE COMPOSED, SHADOW ROOT', child.constructor.name, child.id);

        this.__childComposedCallback(child, 'root');
      } else if (_Utility.hasShadowDomV1 && child instanceof HTMLSlotElement) {
        child.addEventListener('slotchange', // @ts-ignore: allow handleEvent to be protected (upstream
        // type needs update, the addEventListener method expects it
        // to be public)
        this);

        this.__handleDistributedChildren(child
        /*, true*/
        );
      }
    }

    __shadowRootChildRemoved(child) {
      // NOTE Logic here is similar to childDisconnectedCallback
      if (child instanceof DeclarativeBase) {
        child.__shadowRootParent = null; // this.removeNode(child)

        console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, SHADOW ROOT', child.constructor.name, child.id);

        this.__childUncomposedCallback(child, 'root');
      } else if (_Utility.hasShadowDomV1 && child instanceof HTMLSlotElement) {
        child.removeEventListener('slotchange', // @ts-ignore: allow handleEvent to be protected (upstream
        // type needs update, the addEventListener method expects it
        // to be public)
        this);

        this.__handleDistributedChildren(child);

        this.__previousSlotAssignedNodes.delete(child);
      }
    } // This method is called by EventTarget.addEventListener. It cannot
    // be prefixed with double underscores like the other private
    // methods, because EventTarget explicitly looks for and calls the
    // "handleEvent" method.


    handleEvent(event) {
      if (event.type == 'slotchange') {
        const slot = event.target; // must be a slot, if the event is slotchange

        console.log('######################### SLOT CHANGE');

        this.__handleDistributedChildren(slot);
      }
    }

    __childComposedCallback(child, connectionType) {
      if (child.__isComposed) return;
      child.__isComposed = true;
      console.log(' ---------------- __childComposedCallback');
      this.childComposedCallback && this.childComposedCallback(child, connectionType);
    }

    __childUncomposedCallback(child, connectionType) {
      if (!child.__isComposed) return;
      child.__isComposed = false;
      this.childUncomposedCallback && this.childUncomposedCallback(child, connectionType);
    }

    __handleDistributedChildren(slot
    /*, isInitial = false*/
    ) {
      const diff = this.__getDistributedChildDifference(slot);

      const {
        added
      } = diff;

      for (let l = added.length, i = 0; i < l; i += 1) {
        const addedNode = added[i];
        if (!(addedNode instanceof DeclarativeBase)) continue; // Keep track of the final distribution of a node.
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
            if (!distributedChildren.size) distributedParent.__distributedChildren = null;
          }
        } // The node is now distributed to `this` element.


        addedNode.__distributedParent = this;
        if (!this.__distributedChildren) this.__distributedChildren = new Set();

        this.__distributedChildren.add(addedNode); // ********** copied from ImperativeBase#add {{
        // // Calculate sizing because proportional size might depend on
        // // the new parent.
        // childNode._calcSize()
        // childNode.needsUpdate()
        //
        // // child should watch the parent for size changes.
        // this.on('sizechange', childNode._onParentSizeChange, childNode)
        // ******** }}
        // addedNode._connectThree()


        console.log('   >>>>>>>>>>>>>>> CHILD SHOULD BE COMPOSED, SLOTTED', addedNode.constructor.name, addedNode.id); // debugger

        this.__childComposedCallback(addedNode, 'slot');
      }

      const {
        removed
      } = diff;

      for (let l = removed.length, i = 0; i < l; i += 1) {
        const removedNode = removed[i];
        if (!(removedNode instanceof DeclarativeBase)) continue;
        removedNode.__distributedParent = null;

        this.__distributedChildren.delete(removedNode);

        if (!this.__distributedChildren.size) this.__distributedChildren = null;
        console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, UN SLOTTED', removedNode.constructor.name, removedNode.id); // debugger

        this.__childUncomposedCallback(removedNode, 'slot');
      }
    }

    __getDistributedChildDifference(slot) {
      let previousNodes;
      if (this.__previousSlotAssignedNodes.has(slot)) previousNodes = this.__previousSlotAssignedNodes.get(slot);else previousNodes = [];
      const newNodes = slot.assignedNodes({
        flatten: true
      }); // debugger
      // save the newNodes to be used as the previousNodes for next time.

      this.__previousSlotAssignedNodes.set(slot, newNodes);

      const diff = {
        added: newNodes,
        removed: []
      }; // let last: Node

      for (let i = 0, l = previousNodes.length; i < l; i += 1) {
        const oldNode = previousNodes[i];
        const newIndex = newNodes.indexOf(oldNode); // if it exists in the previousNodes but not the newNodes, then
        // the node was removed.

        if (!(newIndex >= 0)) {
          diff.removed.push(oldNode);
        } // otherwise the node wasn't added or removed.
        else {
            newNodes.splice(i, 1); // TODO test version faster than slice:
            // last = newNodes[newNodes.length - 1]
            // newNodes[i] = last
            // newNodes.pop()
          }
      } // The remaining nodes in newNodes must have been added.


      return diff;
    }

  }, _a.defaultElementName = 'ERROR: Subclass needs to set defaultElementName', _a;
}

var DeclarativeBase; // "as default" style default export is required here. Try it the othe way to see how it breaks.

exports.default = exports.DeclarativeBase = DeclarativeBase;