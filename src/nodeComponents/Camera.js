import THREE from 'three'

import utilities from '../utilities'

const CSS_CLASS_CAMERA = 'infamous-dom-camera';

/**
 * Camera Class
 * @class Camera
 * @return {Camera} A new instance of Camera
 */
export default
class Camera {

  /**
   * @constructor
   */
  constructor () {
    this.fov = 0;
    this._style = '';
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._styleCache = {
      transform: {
        matrix3d: [],
        translate3d: []
      }
    };

    this.element = document.createElement('div');
    this.element.className = CSS_CLASS_CAMERA;

    this._camera = new THREE.PerspectiveCamera(40, this._width / this._height, 1, 10000);
    this._camera.position.z = 3000;
  }

  /**
   * [setAlign description]
   * @param {[type]} x [description]
   * @param {[type]} y [description]
   * @param {[type]} z [description]
   */
  setAlign (x, y, z) {
    var align = [x, y, z];

    if (align != this._styleCache.transform.translate3d){
      this._styleCache.transform.translate3d = align;
      this.applyTransform();
    }
  }

  /**
   * [setMatrix3d description]
   * @param {[type]} matrix [description]
   */
  setMatrix3d (matrix){
    if (this._styleCache.transform.matrix3d != matrix) {
      this._styleCache.transform.matrix3d = matrix;
      this.applyTransform();
    }
  }

  /**
   * [setSize description]
   *
   * @method
   * @memberOf Renderer
   * @param {[type]} width  [description]
   * @param {[type]} height [description]
   */
  setSize (width, height) {
    this._width = width;
    this._height = height;

    this.applyStyle('width', width + 'px');
    this.applyStyle('height', height + 'px');
  }

  /**
   * [applyTransform description]
   * @return {[type]} [description]
   */
  applyTransform (){
    var translate3d = this._styleCache.transform.translate3d;
    var matrix3d = this._styleCache.transform.matrix3d;

    var transform = `
      translate3d(
        0,
        0,
        ${ utilities.applyCSSLabel(translate3d[2], 'px') }
      )

      matrix3d(
        ${ utilities.epsilon(  matrix3d[0]  ) },
        ${ utilities.epsilon(- matrix3d[1]  ) },
        ${ utilities.epsilon(  matrix3d[2]  ) },
        ${ utilities.epsilon(  matrix3d[3]  ) },
        ${ utilities.epsilon(  matrix3d[4]  ) },
        ${ utilities.epsilon(- matrix3d[5]  ) },
        ${ utilities.epsilon(  matrix3d[6]  ) },
        ${ utilities.epsilon(  matrix3d[7]  ) },
        ${ utilities.epsilon(  matrix3d[8]  ) },
        ${ utilities.epsilon(- matrix3d[9]  ) },
        ${ utilities.epsilon(  matrix3d[10] ) },
        ${ utilities.epsilon(  matrix3d[11] ) },
        ${ utilities.epsilon(  matrix3d[12] ) },
        ${ utilities.epsilon(- matrix3d[13] ) },
        ${ utilities.epsilon(  matrix3d[14] ) },
        ${ utilities.epsilon(  matrix3d[15] ) }
      )

      translate3d(
        ${ utilities.applyCSSLabel(translate3d[0], 'px') },
        ${ utilities.applyCSSLabel(translate3d[1], 'px') },
        0
      )
    `;

    this.applyStyle('transform', transform);
  }

  /**
   * [applyStyle description]
   * @param  {[type]} property [description]
   * @param  {[type]} value    [description]
   * @return {[type]}          [description]
   */
  applyStyle (property, value) {
    this.element.style[property] = value;
  }

  /**
   * [get description]
   * @return {[type]} [description]
   */
  get () {
    return this._camera;
  }

}
