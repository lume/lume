"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.releaseWebGLRendererThree = releaseWebGLRendererThree;
exports.WebGLRendererThree = void 0;

var _WebVR = _interopRequireDefault(require("../lib/three/WebVR.js"));

var _three = require("three");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sceneStates = new WeakMap();
let instance = null;
let isCreatingSingleton = false; // A singleton responsible for setting up and drawing a WebGL scene for a given
// infamous/core/Scene using Three.js

class WebGLRendererThree {
  static singleton() {
    if (instance) return instance;else {
      try {
        isCreatingSingleton = true;
        return instance = new WebGLRendererThree();
      } catch (e) {
        throw e;
      } finally {
        isCreatingSingleton = false;
      }
    }
  }

  constructor() {
    if (!isCreatingSingleton) throw new Error('class is a singleton, use the static .singleton() method to get an instance');
  }

  initialize(scene) {
    let sceneState = sceneStates.get(scene);
    if (sceneState) return;
    sceneStates.set(scene, sceneState = {
      // TODO: get the active camera from the scene
      //camera: new PerspectiveCamera( 75, 16/9, 0.1, 1000 ),
      // TODO: options controlled by HTML attributes on scene elements.
      renderer: new _three.WebGLRenderer({
        // TODO: how do we change alpha:true to alpha:false after the
        // fact?
        alpha: true,
        antialias: true
      }),
      sizeChangeHandler: () => this.updateResolution(scene)
    });
    const {
      renderer
    } = sceneState; // TODO: make configurable by property/attribute

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = _three.PCFSoftShadowMap; // default PCFShadowMap

    this.updateResolution(scene);
    scene.on('sizechange', sceneState.sizeChangeHandler); // TODO? Maybe the html/scene.js element should be responsible for
    // making this, so that DOM logic is encapsulated there?
    // @ts-ignore: access protected member

    scene._glLayer //
    .appendChild(renderer.domElement);
  }

  uninitialize(scene) {
    const sceneState = sceneStates.get(scene);
    if (!sceneState) return;
    scene.off('sizechange', sceneState.sizeChangeHandler); // @ts-ignore: access protected member

    scene._glLayer //
    .removeChild(sceneState.renderer.domElement);

    sceneState.renderer.dispose();
    sceneStates.delete(scene);
  }

  drawScene(scene) {
    const sceneState = sceneStates.get(scene);
    if (!sceneState) throw new ReferenceError('Can not draw scene. Scene state should be initialized first.');
    const {
      renderer
    } = sceneState;
    renderer.render(scene.three, scene.threeCamera);
  } // TODO FIXME This is tied to the `sizechange` event of Scene, which means
  // camera and renderer resize happens outside of the animation loop, but as
  // with _calcSize, we want to see if we can put this in the animation loop
  // as well. Putting this logic in the loop depends on putting _calcSize in
  // the loop. #66


  updateResolution(scene) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to update resolution. Scene state should be initialized first.'); // @ts-ignore: access protected member

    scene._updateCameraAspect(); // @ts-ignore: access protected member


    scene._updateCameraPerspective(); // @ts-ignore: access protected member


    scene._updateCameraProjection();

    const {
      x,
      y
    } = scene.calculatedSize;
    state.renderer.setSize(x, y);
    scene.needsUpdate();
  }

  setClearColor(scene, color, opacity) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to set clear color. Scene state should be initialized first.');
    state.renderer.setClearColor(color, opacity);
  }

  setClearAlpha(scene, opacity) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to set clear alpha. Scene state should be initialized first.');
    state.renderer.setClearAlpha(opacity);
  }

  setShadowMapType(scene, type) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to set clear alpha. Scene state should be initialized first.'); // TODO shouldn't need a cast here. Bug on TypeScript: https://github.com/microsoft/TypeScript/issues/32054

    type = type.toLowerCase();

    if (type == 'pcf') {
      state.renderer.shadowMap.type = _three.PCFShadowMap;
    } else if (type == 'pcfsoft') {
      state.renderer.shadowMap.type = _three.PCFSoftShadowMap;
    } else if (type == 'basic') {
      state.renderer.shadowMap.type = _three.BasicShadowMap;
    } else {
      // default
      state.renderer.shadowMap.type = _three.PCFShadowMap;
    }
  }

  requestFrame(scene, fn) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to request frame. Scene state should be initialized first.');
    const {
      renderer
    } = state;
    if (renderer.animate) // < r94
      renderer.animate(fn);else if (renderer.setAnimationLoop) // >= r94
      renderer.setAnimationLoop(fn);
  } // TODO: at the moment this has only been tested toggling it on
  // once. Should we be able to turn it off too (f.e. the vr attribute is removed)?


  enableVR(scene, enable) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to enable VR. Scene state should be initialized first.');
    const {
      renderer
    } = state;
    renderer.vr.enabled = enable;
  } // TODO the UI here should be configurable via HTML


  createDefaultWebVREntryUI(scene) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to create VR button. Scene state should be initialized first.');
    const {
      renderer
    } = state;
    window.addEventListener('vrdisplaypointerrestricted', onPointerRestricted, false);
    window.addEventListener('vrdisplaypointerunrestricted', onPointerUnrestricted, false);

    function onPointerRestricted() {
      var pointerLockElement = renderer.domElement;

      if (pointerLockElement && typeof pointerLockElement.requestPointerLock === 'function') {
        pointerLockElement.requestPointerLock();
      }
    }

    function onPointerUnrestricted() {
      var currentPointerLockElement = document.pointerLockElement;
      var expectedPointerLockElement = renderer.domElement;

      if (currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof document.exitPointerLock === 'function') {
        document.exitPointerLock();
      }
    }

    const button = _WebVR.default.createButton(renderer);

    button.setAttribute('id', 'vrButton');
    button.style.color = 'black';
    button.style.setProperty('border-color', 'black');
    button.setAttribute('slot', 'misc');
    scene.appendChild(button);
    return button;
  }

}

exports.WebGLRendererThree = WebGLRendererThree;

function releaseWebGLRendererThree() {
  instance = null;
}