"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initImperativeBase = initImperativeBase;
exports.default = exports.ImperativeBase = void 0;

var _three = require("three");

var _lowclass = require("lowclass");

var _Transformable = _interopRequireDefault(require("./Transformable"));

var _ElementOperations = _interopRequireDefault(require("./ElementOperations"));

var _Motor = _interopRequireDefault(require("./Motor"));

var _CSS3DRendererNested = require("../lib/three/CSS3DRendererNested");

var _three2 = require("../utils/three");

var _Events = require("./Events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('error', event => {
  const error = event.error;

  if (/Illegal constructor/i.test(error.message)) {
    console.error(`
            One of the reasons the following error can happen is if a Custom
            Element is called with 'new' before being defined.
            For other reasons, see: https://www.google.com/search?q=chrome%20illegal%20constructor
        `);
  }
}); // The following isScene and isNode functions are used in order to avoid using
// instanceof, which would mean that we would need to import Node and Scene as
// references, which would cause a circular depdency problem. The problem exists
// only when compiling to CommonJS modules, where the initImperativeBase trick
// won't work because functions don't hoiste in CommonJS like they do with
// ES-Module-compliant builds like with Webpack. We can look into the "internal
// module" pattern to solve the issue if we wish to switch back to using
// instanceof:
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de

function isScene(s) {
  return s.isScene;
}

function isNode(n) {
  return n.isNode;
} // TODO replace with Partial<DeclarativeBase> instead of re-writing properties manually
// @prod-prune @dev-prune


class PossiblyWebComponent {}

function ImperativeBaseMixin(Base) {
  const Parent = _Transformable.default.mixin((0, _lowclass.Constructor)(Base)); // type Parent = InstanceType<typeof Parent>
  // const s = new Parent()
  // s.asdfasdf
  // s.calculatedSize = 123
  // s.innerHTML = 123
  // s.innerHTML = 'asdf'
  // s.emit('asfasdf', 1, 2, 3)
  // s.removeNode('asfasdf')
  // s.updated(1, 2, 3, 4)
  // s.blahblah
  // s.sizeMode
  // s._render(1, 2, 3)
  // s.qwerqwer
  // s.rotation
  // s.three.sdf
  // s.threeCSS.sdf


  class ImperativeBase extends Parent {
    // constructor(options = {}) {
    constructor(...args) {
      // super(options)
      super(...args); // we don't need this, keep for backward compatibility (mainly
      // all my demos at trusktr.io).

      this.imperativeCounterpart = this; // TODO re-organize variables like isScene and isNode, so they come from
      // one place. f.e. isScene is currently also used in DeclarativeBase.
      // for Scene instances

      this.isScene = false; // for Node instances

      this.isNode = false;
      this._glLoaded = false;
      this._cssLoaded = false;
      this._willBeRendered = false; // Here we create the DOM HTMLElement associated with this
      // Imperative-API Node.

      this._elementOperations = new _ElementOperations.default(this); // stores a ref to this Node's root Scene when/if this Node is
      // in a scene.
      // protected _scene: Scene | null = null

      this._scene = null;
      this.__three = null;
      this.__threeCSS = null; // TODO possible to constrain this to THREE.Scene or CSS3DObjectNested? Maybe with StrictUnion.
      // TODO type of options in subclasses that use it.
      // const options: any = args[0]
      // See Transformable/Sizeable propertychange event.
      // TODO: defer size calculation to render task

      this.on('propertychange', this.__onPropertyChange, this);
    }

    get glLoaded() {
      return this._glLoaded;
    }

    get cssLoaded() {
      return this._cssLoaded;
    }

    get three() {
      // if (!(this.scene && this.scene.experimentalWebgl)) return null
      if (!this.__three) {
        this.__three = this._makeThreeObject3d();
        this.__three.pivot = new _three.Vector3();
      }

      return this.__three;
    }

    get threeCSS() {
      // if (!(this.scene && !this.scene.disableCss)) return null
      if (!this.__threeCSS) {
        this.__threeCSS = this._makeThreeCSSObject();
        this.__threeCSS.pivot = new _three.Vector3();
      }

      return this.__threeCSS;
    }

    possiblyLoadThree(child) {
      // children can be non-lib DOM nodes (f.e. div, h1, etc)
      if (isNode(child)) {
        console.log('     >> LOAD THREE', child._renderParent.constructor.name, child.constructor.name, child.id);

        child._triggerLoadGL();

        child._triggerLoadCSS();
      }
    }

    possiblyUnloadThree(child) {
      // children can be non-lib DOM nodes (f.e. div, h1, etc)
      // TODO, this check is redundant because call site already checks
      // for ImperativeBase? Or do we not want to run this on Scene
      // instances?
      if (isNode(child)) {
        console.log('     >> UNLOAD THREE', '<No Parent>', child.constructor.name, child.id);

        child._triggerUnloadGL();

        child._triggerUnloadCSS();
      }
    } // called when child is connected to a node directly, not when
    // distributed to a slot or added to a shadow root. For that,
    // see childComposedCallback


    childConnectedCallback(child) {
      super.childConnectedCallback && super.childConnectedCallback(child); // console.log(' ================== CHILD CONNECTED', child.parentElement.constructor.name, child.constructor.name, child.id)
      // // mirror the DOM connections in the imperative API's virtual scene graph.
      // if ((child instanceof ImperativeBase)) {
      //     // If ImperativeBase#add was called first, child's
      //     // `parent` will already be set, so prevent recursion.
      //     if (child.parent) return
      //
      //     this.add(child)
      // }
      // console.log(' ------------------ NODE CONNECTED NORMALLY', child.constructor.name, child.id)
      // TODO handle in composed and remove this call
      // this.possiblyLoadThree(child)
    } // called when a child is disconnected from a node directly, not
    // when undistributed from a slot or removed from a shadow root.
    // For that, see childUncomposedCallback


    childDisconnectedCallback(child) {
      super.childDisconnectedCallback && super.childDisconnectedCallback(child); // // mirror the connection in the imperative API's virtual scene graph.
      // if ((child instanceof ImperativeBase)) {
      //     // If ImperativeBase#removeNode was called first, child's
      //     // `parent` will already be null, so prevent recursion.
      //     if (!child.parent) return
      //
      //     this.removeNode(child)
      // }
      // TODO handle in composed and remove this call
      // this.possiblyUnloadThree(child)
    }
    /**
     * Called whenever a node is connected, but this is called with
     * a connectionType that tells us how the node is connected
     * (relative to the "flat tree" or "composed tree").
     *
     * @param  {"root" | "slot" | "actual"} connectionType - If the
     * value is "root", then the child was connected as a child of a
     * shadow root of the current node. If the value is "slot", then
     * the child was distributed to the current node via a slot. If
     * the value is "actual", then the child was connect to the
     * current node as a regular child ("actual" is the same as
     * childConnectedCallback).
     */


    childComposedCallback(child, connectionType) {
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ImerativeBase.childComposedCallback', child.tagName);

      if (child instanceof ImperativeBase) {
        console.log(' ------------------ CHILD COMPOSED', child._composedParent.constructor.name + '#' + child._composedParent.id, child.constructor.name + '#' + child.id);

        if (connectionType === 'root') {
          console.log('    >>> CHILD CONNECTED VIA SHADOW ROOT');
        } else if (connectionType === 'slot') {
          console.log('    >>> CHILD DISTRIBUTED TO SLOT');
        } else if (connectionType === 'actual') {
          console.log('    >>> CHILD CONNECTED NORMALLY');
        } // If ImperativeBase#add was called first, child's
        // `parent` will already be set, so prevent recursion.
        // debugger


        if (!child.parent) {
          // mirror the DOM connections in the imperative API's virtual scene graph.
          const __updateDOMConnection = connectionType === 'actual';

          this.add(child, __updateDOMConnection);
        } // Calculate sizing because proportional size might depend on
        // the new parent.


        child._calcSize();

        child.needsUpdate(); // child should watch the parent for size changes.

        if (child._onParentSizeChange) this.on('sizechange', child._onParentSizeChange, child);
        this.possiblyLoadThree(child);
      }
    }

    childUncomposedCallback(child, connectionType) {
      if (child instanceof ImperativeBase) {
        console.log(' ------------------ CHILD UNCOMPOSED', child.constructor.name + '#' + child.id); // If ImperativeBase#removeNode was called first, child's
        // `parent` will already be null, so prevent recursion.

        if (child.parent) {
          // mirror the connection in the imperative API's virtual scene graph.
          const __updateDOMConnection = connectionType === 'actual';

          this.removeNode(child, __updateDOMConnection);
        }

        this.off('sizechange', child._onParentSizeChange); // Unload GL/CSS on _deinit instead of here, but change
        // Object3D hierarchy here.

        this.possiblyUnloadThree(child);
      }
    }
    /**
     * Get the Scene that this Node is in, null if no Scene. This traverses up recursively
     * at first, then the value is cached.
     *
     * @readonly
     */


    get scene() {
      // NOTE: this._scene is initally null.
      const parent = this.parent; // if already cached, return it. Or if no parent, return it (it'll be null).
      // Additionally, Scenes have this._scene already set to themselves.

      if (this._scene || !parent) return this._scene;
      if (!(parent instanceof ImperativeBase)) throw new Error('Expected instance of ImperativeBase'); // if the parent node already has a ref to the scene, use that.

      if (parent._scene) {
        this._scene = parent._scene;
      } else if (isScene(parent)) {
        // we could use instanceof here, but that causes a circular dependency
        this._scene = parent;
      } // otherwise call the scene getter on the parent, which triggers
      // traversal up the scene graph in order to find the root scene (null
      // if none).
      else {
          this._scene = parent.scene;
        }

      return this._scene;
    }
    /**
     * @override
     */
    // @ts-ignore: strict function types normally prevent differing subclass method signatures.


    add( // prettier-ignore
    childNode, __updateDOMConnection = true) {
      if (!(childNode instanceof ImperativeBase)) return this; // We cannot add Scenes to Nodes, for now.

      if (isScene(childNode)) {
        throw new TypeError(`
                    A Scene cannot be added to another Node or Scene (at
                    least for now). To place a Scene in a Node, just mount
                    a new Scene onto an HTMLNode with Scene.mount().
                `);
      }

      super.add(childNode); // // Calculate sizing because proportional size might depend on
      // // the new parent.
      // childNode._calcSize()
      // childNode.needsUpdate()
      //
      // // child should watch the parent for size changes.
      // this.on('sizechange', childNode._onParentSizeChange, childNode)

      if (__updateDOMConnection) this._elementOperations.connectChildElement(childNode);
      return this;
    }

    removeNode(childNode,
    /* private */
    __updateDOMConnection = true) {
      if (!isNode(childNode)) return this;
      super.removeNode(childNode); // this.off('sizechange', childNode._onParentSizeChange, childNode)

      if (__updateDOMConnection) this._elementOperations.disconnectChildElement(childNode);
      return this;
    }

    needsUpdate() {
      // we don't need to render until we're connected into a tree with a scene.
      if (!this.scene || !this.isConnected) return; // TODO make sure we render when connected into a tree with a scene

      this._willBeRendered = true;

      _Motor.default.setNodeToBeRendered(this);
    }

    _makeThreeObject3d() {
      return new _three.Object3D();
    }

    _makeThreeCSSObject() {
      return new _CSS3DRendererNested.CSS3DObjectNested(this);
    }

    _connectThree() {
      if (this._isPossiblyDistributedToShadowRoot && // check parent isn't a Scene because Scenes always
      // have shadow roots, and we treat distribution into
      // the Scene shacow root different than with all
      // other Nodes.
      this.parent !== this.scene) {
        this.scene.removeNode;

        if (this._distributedParent) {
          console.log('    --- CONNECT THREE TO SHADOW PARENT', this._distributedParent.constructor.name, this.constructor.name); // @prod-prune

          if (!(this._distributedParent instanceof ImperativeBase)) throw new Error('expected _distributedParent to be ImperativeBase');
          this._distributedParent && this._distributedParent.three.add(this.three);
        }
      } else {
        if (this.parent) console.log('    --- CONNECT THREE TO NORMAL PARENT', this.parent.constructor.name, this.constructor.name); // @prod-prune
        // TODO instanceof check doesn't work here. Investigate Symbol.hasInstance feature in Mixin.
        // if (!(this.parent instanceof ImperativeBase)) throw new Error('expected parent to be ImperativeBase')

        this.parent && this.parent.three.add(this.three);
      }

      this.needsUpdate();
    }

    _connectThreeCSS() {
      if (this._isPossiblyDistributedToShadowRoot && // check parent isn't a Scene because Scenes always
      // have shadow roots, and we treat distribution into
      // the Scene shacow root different than with all
      // other Nodes.
      this.parent !== this.scene) {
        if (this._distributedParent) {
          console.log('    --- CONNECT THREE TO SHADOW PARENT', this._distributedParent.constructor.name, this.constructor.name); // @prod-prune

          if (!(this._distributedParent instanceof ImperativeBase)) throw new Error('expected _distributedParent to be ImperativeBase');
          this._distributedParent && this._distributedParent.threeCSS.add(this.threeCSS);
        }
      } else {
        if (this.parent) console.log('    --- CONNECT THREE TO NORMAL PARENT', this.parent.constructor.name, this.constructor.name); // @prod-prune
        // if (!(this.parent instanceof ImperativeBase)) throw new Error('expected parent to be ImperativeBase')

        this.parent && this.parent.threeCSS.add(this.threeCSS);
      }

      this.needsUpdate();
    }

    _loadGL() {
      if (!(this.scene && this.scene.experimentalWebgl)) return;
      if (this._glLoaded) return;
      this._glLoaded = true; // we don't let Three update local matrices automatically, we do
      // it ourselves in Transformable._calculateMatrix and
      // Transformable._calculateWorldMatricesInSubtree

      this.three.matrixAutoUpdate = false; // NOTE, this.parent works here because _loadGL
      // is called by childConnectedCallback (or when
      // distributed to a shadow root) at which point a child
      // is already upgraded and thus has this.parent
      // API ready. Only a Scene has no parent.
      //
      // this.parent && this.parent.three.add(this.three)

      this._connectThree();

      console.log(' >>>>>>>>>>>>>>>>>>>>>>> load GL!', this.constructor.name, this.id); // If a subclass needs to initialize values in its Three.js
      // object, it will have the passInitialValuesToThree method for
      // that.
      //
      // TODO we shouldn't need to define passInitialValuesToThree in
      // sub classes, the default values of the props should
      // automatically be in place.

      this.passInitialValuesToThree && this.passInitialValuesToThree();
      this.needsUpdate();
    }

    _unloadGL() {
      if (!this._glLoaded) return;
      this._glLoaded = false;
      (0, _three2.disposeObject)(this.__three);
      this.__three = null;
      this.needsUpdate();
    }

    _loadCSS() {
      if (!(this.scene && !this.scene.disableCss)) return;
      if (this._cssLoaded) return;
      this._cssLoaded = true;
      this.triggerUpdateForProp('visible'); // we don't let Three update local matrices automatically, we do
      // it ourselves in Transformable._calculateMatrix and
      // Transformable._calculateWorldMatricesInSubtree

      this.threeCSS.matrixAutoUpdate = false; // NOTE, this.parent works here because _loadCSS
      // is called by childConnectedCallback (or when
      // distributed to a shadow root) at which point a child
      // is already upgraded and thus has this.parent
      // API ready. Only a Scene has no parent.
      // this.parent && this.parent.threeCSS.add(this.threeCSS)

      this._connectThreeCSS();

      console.log(' >>>>>>>>>>>>>>>>>>>>>>> load CSS!', this.constructor.name, this.id);
      this.needsUpdate();
    }

    _unloadCSS() {
      if (!this._cssLoaded) return;
      this._cssLoaded = false;
      this.triggerUpdateForProp('visible');
      (0, _three2.disposeObject)(this.__threeCSS);
      this.__threeCSS = null;
      this.needsUpdate();
    }

    _triggerLoadGL() {
      this._loadGL();

      this.emit(_Events.Events.BEHAVIOR_GL_LOAD, this);
      Promise.resolve().then(() => {
        this.emit(_Events.Events.GL_LOAD, this);
      });
    }

    _triggerUnloadGL() {
      this._unloadGL();

      this.emit(_Events.Events.BEHAVIOR_GL_UNLOAD, this);
      Promise.resolve().then(() => {
        this.emit(_Events.Events.GL_UNLOAD, this);
      });
    }

    _triggerLoadCSS() {
      this._loadCSS();

      this.emit(_Events.Events.CSS_LOAD, this);
    }

    _triggerUnloadCSS() {
      this._unloadCSS();

      this.emit(_Events.Events.CSS_UNLOAD, this);
    }

    _render(timestamp) {
      if (super._render) super._render(timestamp);

      this._elementOperations.applyImperativeNodeProperties();
    } // This method is used by Motor._renderNodes().


    _getNearestAncestorThatShouldBeRendered() {
      let parent = this.parent;

      while (parent) {
        // TODO it'd be nice to have a way to prune away runtime type checks in prod mode.
        // @prod-prune
        if (!(parent instanceof ImperativeBase)) throw new Error('expected ImperativeBase');
        if (parent._willBeRendered) return parent;
        parent = parent.parent;
      }

      return false;
    }

    __onPropertyChange(prop
    /*TODO keyof props*/
    ) {
      if (prop == 'sizeMode' || prop == 'size') {
        if (this.parent) this._calcSize();
      }

      if (this.constructor.name === 'ShimmerCube' && prop === 'rotation') {
        const rot = this._props.rotation;
        console.log(rot.x, rot.y, rot.z);
        debugger;
      }

      this.needsUpdate();
    }

  }

  return ImperativeBase; // TODO see "function MixinResult" below
  // return MixinResult<T>(class ImperativeBase extends Parent {
  //     // ...
  // })
} // We explicitly use `var` instead of `let` here because it is hoisted for the
// Node and Scene modules. This, along with the following initImperativeBase
// function, allows the circular dependency between this module and the Node and
// Scene modules to work. For details on why, see
// https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem.


var ImperativeBase; // Here we wrap the definition of the ImperativeBase class with this function in
// order to solve the circular depdendency problem caused by the
// Node<->ImperativeBase and Scene<->ImperativeBase circles. The Node and Scene
// modules call initImperativeBase to ensure that the ImperativeBase declaration
// happens first, and then those modules can use the live binding in their
// declarations.

exports.default = exports.ImperativeBase = ImperativeBase;
initImperativeBase();

function initImperativeBase() {
  /**
   * The ImperativeBase class is the base class for the Imperative version of the
   * API, for people who chose to take the all-JavaScript approach and who will
   * not use the HTML-based API (infamous/motor-html).
   *
   * In the future when there is an option to disable the HTML-DOM rendering (and
   * render only WebGL, for example) then the imperative API will be the only API
   * available since the HTML API will be turned off as a result of disabling
   * HTML rendering. Disabling both WebGL and HTML won't make sense, as we'll need
   * at least one of those to render with.
   */
  if (!ImperativeBase) exports.default = exports.ImperativeBase = ImperativeBase = makeMixin();
}

function makeMixin() {
  return (0, _lowclass.Mixin)(ImperativeBaseMixin);
} // "as default" form is required here, otherwise it'll break.
// const i: ImperativeBase = new ImperativeBase()
// i.asdfasdf
// i.calculatedSize = 123
// i.innerHTML = 123
// i.innerHTML = 'asdf'
// i.emit('asfasdf', 1, 2, 3)
// i.removeNode('asfasdf')
// i.updated(1, 2, 3, 4)
// i.blahblah
// i.sizeMode
// i._render(1, 2, 3)
// i.qwerqwer
// i.rotation
// i.three.sdf
// i.threeCSS.sdf
// i.possiblyLoadThree(new ImperativeBase!())
// i.possiblyLoadThree(1)