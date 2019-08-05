"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.releaseCSS3DRendererThree = releaseCSS3DRendererThree;
exports.CSS3DRendererThree = void 0;

var _CSS3DRendererNested = require("../lib/three/CSS3DRendererNested");

const sceneStates = new WeakMap();
let instance = null;
let isCreatingSingleton = false;

class CSS3DRendererThree {
  static singleton() {
    if (instance) return instance;else {
      try {
        isCreatingSingleton = true;
        return instance = new CSS3DRendererThree();
      } catch (e) {
        throw e;
      } finally {
        isCreatingSingleton = false;
      }
    }
  }

  constructor() {
    if (!isCreatingSingleton) throw new Error('class is a singleton, use the static .singleton() method to get an instance');
  } // TODO rename


  initialize(scene) {
    let sceneState = sceneStates.get(scene);
    if (sceneState) return;
    sceneStates.set(scene, sceneState = {
      renderer: new _CSS3DRendererNested.CSS3DRendererNested(),
      sizeChangeHandler: () => this.updateResolution(scene)
    });
    const {
      renderer
    } = sceneState;
    this.updateResolution(scene);
    scene.on('sizechange', sceneState.sizeChangeHandler); // @ts-ignore: access protected property

    scene._cssLayer //
    .appendChild(renderer.domElement);
  }

  uninitialize(scene) {
    const sceneState = sceneStates.get(scene);
    if (!sceneState) return;
    scene.off('sizechange', sceneState.sizeChangeHandler); // @ts-ignore: access protected property

    scene._cssLayer //
    .removeChild(sceneState.renderer.domElement);

    sceneStates.delete(scene);
  }

  drawScene(scene) {
    const sceneState = sceneStates.get(scene);
    if (!sceneState) throw new ReferenceError('Can not draw scene. Scene state should be initialized first.');
    const {
      renderer
    } = sceneState;
    renderer.render(scene.threeCSS, scene.threeCamera);
  }

  updateResolution(scene) {
    const state = sceneStates.get(scene);
    if (!state) throw new ReferenceError('Unable to update resolution. Scene state should be initialized first.'); // @ts-ignore: call protected method

    scene._updateCameraAspect(); // @ts-ignore: call protected method


    scene._updateCameraPerspective(); // @ts-ignore: call protected method


    scene._updateCameraProjection();

    const {
      x,
      y
    } = scene.calculatedSize;
    state.renderer.setSize(x, y);
    scene.needsUpdate();
  }

  requestFrame(_scene, fn) {
    requestAnimationFrame(fn);
  }

}

exports.CSS3DRendererThree = CSS3DRendererThree;

function releaseCSS3DRendererThree() {
  instance = null;
}