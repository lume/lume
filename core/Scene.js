"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Scene = void 0;

var _lowclass = require("lowclass");

var _documentReady = _interopRequireDefault(require("@awaitbox/document-ready"));

var _three = require("three");

var _Motor = _interopRequireDefault(require("./Motor"));

var _WebGLRendererThree = require("./WebGLRendererThree");

var _CSS3DRendererThree = require("./CSS3DRendererThree");

var _ImperativeBase = _interopRequireWildcard(require("./ImperativeBase"));

var _XYZSizeModeValues = _interopRequireDefault(require("./XYZSizeModeValues"));

var _XYZNonNegativeValues = _interopRequireDefault(require("./XYZNonNegativeValues"));

var _HTMLScene = _interopRequireDefault(require("../html/HTMLScene"));

var _props = require("./props");

var _Utility = require("./Utility");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
} // TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem


(0, _ImperativeBase.initImperativeBase)();

function SceneMixin(Base) {
  // NOTE for now, we assume Scene is mixed with its HTMLInterface.
  const Parent = _ImperativeBase.default.mixin((0, _lowclass.Constructor)(Base));

  class Scene extends Parent {
    // protected _scene: this | null = this
    constructor(...args) {
      super(...args);
      this.isScene = true; // Used by the `scene` getter in ImperativeBase

      this._scene = this;
      this._mounted = false; // TODO get default camera values from somewhere.

      this._perspective = 1000;
      this.__glRenderer = null;
      this.__cssRenderer = null;
      this.__activeCameras = null; // Set<Camera>

      this.__sizePollTask = null;
      this.__parentSize = {
        x: 0,
        y: 0,
        z: 0
      }; // The scene should always render CSS properties (it needs to always
      // be rendered on resized, for example, because it contains the
      // WebGL canvas which also needs to be resized). Namely, we still
      // want to apply size values to the scene so that it can size
      // relative to it's parent container, or literally if size mode is
      // "literal".

      this._elementOperations.shouldRender = true; // size of the element where the Scene is mounted
      // NOTE: z size is always 0, since native DOM elements are always flat.

      this._elementParentSize = {
        x: 0,
        y: 0,
        z: 0
      };

      this._cameraSetup();

      this._calcSize();

      this.needsUpdate();
    }

    drawScene() {
      this.__glRenderer && this.__glRenderer.drawScene(this);
      this.__cssRenderer && this.__cssRenderer.drawScene(this);
    } // TODO perspective SkateJS prop


    set perspective(value) {
      this._perspective = value;

      this._updateCameraPerspective();

      this._updateCameraProjection();

      this.needsUpdate();
    }

    get perspective() {
      return this._perspective;
    }
    /**
     * Mount the scene into the given target.
     * Resolves the Scene's mountPromise, which can be use to do something once
     * the scene is mounted.
     *
     * @param {string|HTMLElement} [mountPoint=document.body] If a string selector is provided,
     * the mount point will be selected from the DOM. If an HTMLElement is
     * provided, that will be the mount point. If no mount point is provided,
     * the scene will be mounted into document.body.
     */


    async mount(mountPoint) {
      // if no mountPoint was provided, just mount onto the <body> element.
      if (!mountPoint) {
        if (!document.body) await (0, _Utility.documentBody)();
        mountPoint = document.body;
      } // if the user supplied a selector, mount there.
      else if (typeof mountPoint === 'string') {
          const selector = mountPoint;
          mountPoint = document.querySelector(selector);

          if (!mountPoint && document.readyState === 'loading') {
            // maybe the element wasn't parsed yet, check again when the
            // document is ready.
            await (0, _documentReady.default)();
            mountPoint = document.querySelector(selector);
          }
        } // At this point we should have an actual mount point (the user may have passed it in)


      if (!(mountPoint instanceof HTMLElement)) {
        throw new Error(`
                    Invalid mount point specified in Scene.mount() call. Pass a
                    selector, an actual HTMLElement, or don\'t pass anything to
                    mount to <body>.
                `);
      } // The user can mount to a new location without calling unmount
      // first. Call it automatically in that case.


      if (this._mounted) this.unmount();
      if (mountPoint !== this.parentNode) mountPoint.appendChild(this);
      this._mounted = true;

      this.__startOrStopSizePolling();
    }
    /**
     * Unmount the scene from it's mount point. Resets the Scene's
     * mountPromise.
     */


    unmount() {
      if (!this._mounted) return;

      this.__stopSizePolling();

      if (this.parentNode) this.parentNode.removeChild(this);
      this._mounted = false;
    }

    updated(oldProps, moddedProps) {
      if (!this.isConnected) return;

      if (moddedProps.experimentalWebgl) {
        if (this.experimentalWebgl) this._triggerLoadGL();else this._triggerUnloadGL();
      }

      if (moddedProps.disableCss) {
        if (!this.disableCss) this._triggerLoadCSS();else this._triggerUnloadCSS();
      } // call super.updated() after the above _triggerLoadGL() so that WebGL
      // stuff will be ready in super.updated()


      super.updated(oldProps, moddedProps); // if this.experimentalWebgl is true, then this.__glRenderer is defined in the following

      if (this.experimentalWebgl) {
        if (moddedProps.backgroundColor) {
          this.__glRenderer.setClearColor(this, this.backgroundColor, this.backgroundOpacity);

          this.needsUpdate();
        }

        if (moddedProps.backgroundOpacity) {
          this.__glRenderer.setClearAlpha(this, this.backgroundOpacity);

          this.needsUpdate();
        }

        if (moddedProps.shadowmapType) {
          this.__glRenderer.setShadowMapType(this, this.shadowmapType);

          this.needsUpdate();
        }

        if (moddedProps.vr) {
          this.__glRenderer.enableVR(this, this.vr);

          if (this.vr) {
            _Motor.default.setFrameRequester(fn => this.__glRenderer.requestFrame(this, fn));

            this.__glRenderer.createDefaultWebVREntryUI(this);
          } else {// TODO else return back to normal requestAnimationFrame
          }
        }
      }

      if (moddedProps.sizeMode) {
        this.__startOrStopSizePolling();
      }
    }

    makeDefaultProps() {
      return Object.assign(super.makeDefaultProps(), {
        sizeMode: new _XYZSizeModeValues.default('proportional', 'proportional', 'literal'),
        size: new _XYZNonNegativeValues.default(1, 1, 0)
      });
    }

    _makeThreeObject3d() {
      return new _three.Scene();
    }

    _makeThreeCSSObject() {
      return new _three.Scene();
    }

    _cameraSetup() {
      // this.threeCamera holds the active camera. There can be many
      // cameras in the scene tree, but the last one with active="true"
      // will be the one referenced here.
      // If there are no cameras in the tree, a virtual default camera is
      // referenced here, who's perspective is that of the scene's
      // perspective attribute.
      // this.threeCamera = null
      this._createDefaultCamera(); // holds active cameras found in the DOM tree (if this is empty, it
      // means no camera elements are in the DOM, but this.threeCamera
      // will still have a reference to the default camera that scenes
      // are rendered with when no camera elements exist).


      this.__activeCameras = new Set();
    }

    _createDefaultCamera() {
      const size = this.calculatedSize; // THREE-COORDS-TO-DOM-COORDS
      // We apply Three perspective the same way as CSS3D perspective here.
      // TODO CAMERA-DEFAULTS, get defaults from somewhere common.
      // TODO the "far" arg will be auto-calculated to encompass the furthest objects (like CSS3D).

      this.threeCamera = new _three.PerspectiveCamera(45, size.x / size.y || 1, 0.1, 10000);
      this.perspective = 1000;
    } // TODO can this be moved to a render task like _calcSize? It depends
    // on size values.


    _updateCameraPerspective() {
      const perspective = this._perspective;
      this.threeCamera.fov = 180 * (2 * Math.atan(this.calculatedSize.y / 2 / perspective)) / Math.PI;
      this.threeCamera.position.z = perspective;
    }

    _updateCameraAspect() {
      this.threeCamera.aspect = this.calculatedSize.x / this.calculatedSize.y || 1;
    }

    _updateCameraProjection() {
      this.threeCamera.updateProjectionMatrix();
    } // TODO leak SceneProtected to Camera to call this, and move to protected


    _addCamera(camera) {
      this.__activeCameras.add(camera);

      this.__setCamera(camera);
    }

    _removeCamera(camera) {
      this.__activeCameras.delete(camera);

      if (this.__activeCameras.size) {
        // get the last camera in the Set
        this.__activeCameras.forEach(c => camera = c);
      }

      this.__setCamera(camera);
    }
    /** @override */


    _getParentSize() {
      return this.parent ? this.parent.calculatedSize : this._elementParentSize;
    } // For now, use the same program (with shaders) for all objects.
    // Basically it has position, frag colors, point light, directional
    // light, and ambient light.


    _loadGL() {
      if (this._glLoaded) return;
      console.log('    ---------------------------- LOAD SCENE GL');
      this._composedChildren; // THREE
      // maybe keep this in sceneState in WebGLRendererThree

      super._loadGL(); // We don't let Three update any matrices, we supply our own world
      // matrices.


      this.three.autoUpdate = false; // TODO: default ambient light when no AmbientLight elements are
      // present in the Scene.
      //const ambientLight = new AmbientLight( 0x353535 )
      //this.three.add( ambientLight )

      this.__glRenderer = this.__getRenderer('three'); // default orange background color and 0 opacity. Use the
      // backgroundColor and backgroundOpacity attributes to
      // customize.

      this.__glRenderer.setClearColor(this, new _three.Color(0xff6600), 0);

      this.traverse(node => {
        // skip `this`, we already handled it above
        if (node === this) return;
        if (isImperativeBase(node)) // @ts-ignore: access protected member
          node._triggerLoadGL();
      });
    }

    _unloadGL() {
      if (!this._glLoaded) return;
      console.log('    ---------------------------- UNLOAD SCENE GL');

      super._unloadGL();

      if (this.__glRenderer) {
        this.__glRenderer.uninitialize(this);

        this.__glRenderer = null;
      }

      this.traverse(node => {
        // skip `this`, we already handled it above
        if (node === this) return;
        if (isImperativeBase(node)) // @ts-ignore: access protected member
          node._triggerUnloadGL();
      });
    }

    _loadCSS() {
      if (this._cssLoaded) return;
      console.log('    ---------------------------- LOAD SCENE CSS');

      super._loadCSS();

      this.__cssRenderer = this.__getCSSRenderer('three');
      this.traverse(node => {
        // skip `this`, we already handled it above
        if (node === this) return;
        if (isImperativeBase(node)) // @ts-ignore: access protected member
          node._loadCSS();
      });
      console.log([].map.call(this.children, n => [n.constructor.name, n.parent, n.position]));
      setTimeout(() => {
        console.log([].map.call(this.children, n => [n.constructor.name, n.parent, n.position]));
      }, 1000);
    }

    _unloadCSS() {
      if (!this._cssLoaded) return;
      console.log('    ---------------------------- UNLOAD SCENE CSS');

      super._unloadCSS();

      if (this.__cssRenderer) {
        this.__cssRenderer.uninitialize(this);

        this.__cssRenderer = null;
      }

      this.traverse(node => {
        // skip `this`, we already handled it above
        if (node === this) return;
        if (isImperativeBase(node)) // @ts-ignore: access protected member
          node._unloadCSS();
      });
    } // The idea here is that in the future we might have "babylon",
    // "playcanvas", etc, on a per scene basis. We'd needed to abstract the
    // renderer more, have abstract base classes to define the common
    // interfaces.


    __getRenderer(type) {
      if (this.__glRenderer) return this.__glRenderer;
      let renderer;
      if (type === 'three') renderer = _WebGLRendererThree.WebGLRendererThree.singleton();else throw new Error('invalid WebGL renderer');
      renderer.initialize(this);
      return renderer;
    }

    __getCSSRenderer(type) {
      if (this.__cssRenderer) return this.__cssRenderer;
      let renderer;
      if (type === 'three') renderer = _CSS3DRendererThree.CSS3DRendererThree.singleton();else throw new Error('invalid WebGL renderer');
      renderer.initialize(this);
      return renderer;
    } // TODO FIXME: manual camera doesn't work after we've added the
    // default-camera feature.


    __setCamera(camera) {
      if (!camera) {
        this._createDefaultCamera();
      } else {
        // TODO?: implement an changecamera event/method and emit/call
        // that here, then move this logic to the renderer
        // handler/method?
        this.threeCamera = camera.three;

        this._updateCameraAspect();

        this._updateCameraProjection();

        this.needsUpdate();
      }
    } // HTM-API


    __startOrStopSizePolling() {
      if (this._mounted && (this._properties.sizeMode.x == 'proportional' || this._properties.sizeMode.y == 'proportional' || this._properties.sizeMode.z == 'proportional')) {
        this.__startSizePolling();
      } else {
        this.__stopSizePolling();
      }
    } // observe size changes on the scene element.
    // HTM-API


    __startSizePolling() {
      // NOTE Polling is currently required because there's no other way to do this
      // reliably, not even with MutationObserver. ResizeObserver hasn't
      // landed in browsers yet.
      if (!this.__sizePollTask) this.__sizePollTask = _Motor.default.addRenderTask(this.__checkSize.bind(this));
      this.on('parentsizechange', this.__onElementParentSizeChange, this);
    } // HTM-API


    __stopSizePolling() {
      this.off('parentsizechange', this.__onElementParentSizeChange);

      _Motor.default.removeRenderTask(this.__sizePollTask);

      this.__sizePollTask = null;
    } // NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
    // we haven't taken that into consideration here.
    // HTM-API


    __checkSize() {
      const parent = this.parentNode;
      const parentSize = this.__parentSize;
      const style = getComputedStyle(parent);
      const width = parseFloat(style.width || '0');
      const height = parseFloat(style.height || '0'); // if we have a size change, trigger parentsizechange

      if (parentSize.x != width || parentSize.y != height) {
        parentSize.x = width;
        parentSize.y = height;
        this.trigger('parentsizechange', Object.assign({}, parentSize));
      }
    } // HTM-API


    __onElementParentSizeChange(newSize) {
      this._elementParentSize = newSize;

      this._calcSize();

      this.needsUpdate();
    }

  }

  Scene.defaultElementName = 'i-scene';
  Scene.props = _objectSpread({}, Parent.props || {}, {
    backgroundColor: _props.props.THREE.Color,
    backgroundOpacity: _props.props.number,
    shadowmapType: _props.props.string,
    vr: _props.props.boolean,
    experimentalWebgl: _props.props.boolean,
    disableCss: _props.props.boolean
  });
  return Scene;
}

function isImperativeBase(_n) {
  // TODO make sure instanceof works. For all intents and purposes, we assume
  // to always have an ImperativeNode where we use this.
  // return n instanceof ImperativeBase
  return true;
} // TODO cleanup above parentsizechange code


const _Scene = (0, _lowclass.Mixin)(SceneMixin); // TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.


const Scene = _Scene.mixin(_HTMLScene.default); // export interface Scene extends InstanceType<typeof _Scene> {}


exports.Scene = Scene;
var _default = Scene; // const s: Scene = new Scene()
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
// s.possiblyLoadThree(new ImperativeBase!())
// s.possiblyLoadThree(1)
// s.mount('somewhere')
// s.mount(123)

exports.default = _default;