"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSS3DRendererNested = exports.CSS3DNestedSprite = exports.CSS3DObjectNested = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _three2 = require("../../utils/three");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// based on THREE.CSS3DRenderer from https://github.com/mrdoob/three.js/blob/51ac0084709d4d3795ccb7119ee24e6a808618df/examples/js/renderers/CSS3DRenderer.js
class CSS3DObjectNested extends THREE.Object3D {
  constructor(element) {
    super();
    this.element = element;
    this.__initialFrame = requestAnimationFrame(() => {
      // delay to the next frame because attributes are not allowed be set
      // inside Custom Element (i.e. Web Component) constructors, otherwise
      // this can throw an error if called inside a Custom Element
      // constructor.
      this.element.style.position = 'absolute';
    });
  }

  dispose() {
    cancelAnimationFrame(this.__initialFrame);
  }

} // TODO Sprite is still untested in this new nested renderer


exports.CSS3DObjectNested = CSS3DObjectNested;

class CSS3DNestedSprite extends CSS3DObjectNested {} //


exports.CSS3DNestedSprite = CSS3DNestedSprite;

class CSS3DRendererNested {
  constructor() {
    this.matrix = new THREE.Matrix4();
    this.cache = {
      camera: {
        fov: 0,
        style: ''
      },
      objects: new WeakMap()
    };
    this._width = 0;
    this._height = 0;
    this._widthHalf = 0;
    this._heightHalf = 0;
    console.log('THREE.CSS3DRendererNested', THREE.REVISION);
    const domElement = document.createElement('div');
    domElement.classList.add('CSS3DRendererNested');
    domElement.style.overflow = 'hidden';
    this.domElement = domElement;
    const cameraElement = document.createElement('div');
    cameraElement.classList.add('cameraElement');
    cameraElement.appendChild(document.createElement('slot'));
    cameraElement.style.transformStyle = 'preserve-3d';
    domElement.appendChild(cameraElement);
    this.__cameraElement = cameraElement;
  }

  getSize() {
    return {
      width: this._width,
      height: this._height
    };
  }

  setSize(width, height) {
    this._width = width;
    this._height = height;
    this._widthHalf = width / 2;
    this._heightHalf = height / 2;
    this.domElement.style.width = width + 'px';
    this.domElement.style.height = height + 'px';
    this.__cameraElement.style.width = width + 'px';
    this.__cameraElement.style.height = height + 'px';
  }

  __renderObject(object, camera) {
    if (object instanceof CSS3DObjectNested) {
      let style = '';

      if (object instanceof CSS3DNestedSprite) {
        // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/
        this.matrix.copy(camera.matrixWorldInverse);
        this.matrix.transpose();
        this.matrix.copyPosition(object.matrixWorld);
        this.matrix.scale(object.scale);
        this.matrix.elements[3] = 0;
        this.matrix.elements[7] = 0;
        this.matrix.elements[11] = 0;
        this.matrix.elements[15] = 1;
        style = getObjectCSSMatrix(object, this.matrix);
      } else {
        style = getObjectCSSMatrix(object, object.matrix);
      }

      const element = object.element;
      const cachedStyle = this.cache.objects.get(object); // if ( cachedStyle === undefined || cachedStyle !== style ) { // BUG, https://github.com/mrdoob/three.js/pull/15470

      if (cachedStyle === undefined || cachedStyle.style !== style) {
        element.style.transform = style;
        const objectData = {
          style: style
        };
        this.cache.objects.set(object, objectData);
      }
    }

    for (let i = 0, l = object.children.length; i < l; i++) {
      this.__renderObject(object.children[i], camera);
    }
  }

  render(scene, camera) {
    const fov = camera.projectionMatrix.elements[5] * this._heightHalf;

    if (this.cache.camera.fov !== fov) {
      if ((0, _three2.isPerspectiveCamera)(camera)) {
        this.domElement.style.perspective = fov + 'px';
      }

      this.cache.camera.fov = fov;
    }

    scene.updateMatrixWorld();
    if (camera.parent === null) camera.updateMatrixWorld(void 0);
    let tx = 0;
    let ty = 0;

    if ((0, _three2.isOrthographicCamera)(camera)) {
      tx = -(camera.right + camera.left) / 2;
      ty = (camera.top + camera.bottom) / 2;
    } // prettier-ignore


    const cameraCSSMatrix = (0, _three2.isOrthographicCamera)(camera) ? 'scale(' + fov + ')' + 'translate(' + epsilon(tx) + 'px,' + epsilon(ty) + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse) : 'translateZ(' + fov + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse);
    const style = cameraCSSMatrix + 'translate(' + this._widthHalf + 'px,' + this._heightHalf + 'px)';

    if (this.cache.camera.style !== style) {
      this.__cameraElement.style.transform = style;
      this.cache.camera.style = style;
    }

    this.__renderObject(scene, camera);
  }

}

exports.CSS3DRendererNested = CSS3DRendererNested;

function getCameraCSSMatrix(matrix) {
  const elements = matrix.elements;
  return 'matrix3d(' + epsilon(elements[0]) + ',' + epsilon(-elements[1]) + ',' + epsilon(elements[2]) + ',' + epsilon(elements[3]) + ',' + epsilon(elements[4]) + ',' + epsilon(-elements[5]) + ',' + epsilon(elements[6]) + ',' + epsilon(elements[7]) + ',' + epsilon(elements[8]) + ',' + epsilon(-elements[9]) + ',' + epsilon(elements[10]) + ',' + epsilon(elements[11]) + ',' + epsilon(elements[12]) + ',' + epsilon(-elements[13]) + ',' + epsilon(elements[14]) + ',' + epsilon(elements[15]) + ')';
}

function getObjectCSSMatrix(object, matrix) {
  const parent = object.parent;
  const childOfScene = parent && parent.type === 'Scene';
  const elements = matrix.elements;
  const matrix3d = 'matrix3d(' + epsilon(elements[0]) + ',' + epsilon(elements[1]) + ',' + epsilon(elements[2]) + ',' + epsilon(elements[3]) + ',' + epsilon((childOfScene ? -1 : 1) * elements[4]) + ',' + epsilon((childOfScene ? -1 : 1) * elements[5]) + ',' + epsilon((childOfScene ? -1 : 1) * elements[6]) + ',' + epsilon((childOfScene ? -1 : 1) * elements[7]) + ',' + epsilon(elements[8]) + ',' + epsilon(elements[9]) + ',' + epsilon(elements[10]) + ',' + epsilon(elements[11]) + ',' + epsilon(elements[12]) + ','
  /* X position */
  + epsilon((childOfScene ? 1 : -1) * elements[13]) + ','
  /* Y position */
  + epsilon(elements[14]) + ','
  /* Z position */
  + epsilon(elements[15]) + ')'; // similar to mountPoint

  return `${childOfScene ? 'translate(-50%, -50%)' : ''} ${matrix3d}`;
}

function epsilon(value) {
  return Math.abs(value) < 1e-10 ? 0 : value;
}