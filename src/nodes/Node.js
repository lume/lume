import THREE from 'three'
import TWEEN from 'tween.js'
import _ from 'lodash'

import '../ThreeTrackballControls'

import Curve   from './Curve'
import Utility from './Utility'

const CSS_CLASS_NODE = 'infamous-dom-node';

/**
 * Node Class
 *
 * @class Node
 * @return {Node} A new instance of Node
 */
export default
class Node extends THREE.Object3D {

  /**
   * @constructor
   *
   * @param {Object} properties Properties object -- see example
   *
   * @example
   * var node = new Node({
   *   classes: ['open'],
   *   position: [200, 300, 0],
   *   rotation: [3, 0, 0],
   *   scale: [1, 1, 1],
   *   size: {
   *     modes: ['absolute', 'relative'],
   *     absolute: [300, null],
   *     proportional: [null, .5]
   *   },
   *   opacity: .9
   * })
   */
  constructor (properties) {
    super();

    // DOM representation of Node
    this.element = document.createElement('div');
    this._mounted = false;

    // Class Cache
    this._classes = [
      CSS_CLASS_NODE
    ];

    // Force initial class set;
    this.setClasses();

    // Property Cache
    this._propertyCache = {
      opacity: 1,
      origin: [0.5, 0.5],
      mountPoint: [0.5, 0.5],
      align: [.5, .5, 0],
      size: {
        modes: ['absolute', 'absolute'],
        absolute: [100, 100],
        proportional: [1, 1]
      }
    };

    // Style Cache
    this._styleCache = {
      transform:{
        matrix3d: []
      }
    };

    // Tweens
    this._tweens = {
      opacity: null,
      position: null,
      rotation: null,
      scale: null
    };

    Object.defineProperties(this, {
      opacity: {
        set: function (value) {
          this._styleCache.opacity = value;
           this._applyStyle('opacity', value);
        }.bind(this),
        get: function () {
          return this._styleCache.opacity;
        }.bind(this)
      }
    });

    this.addEventListener('removed', function (event) {
      if (this.element.parentNode !== null) {
        this.element.parentNode.removeChild(this.element);
      }
    });

    if (properties)
      this.setProperties(properties);
  }

  /**
   * [applySize description]
   *
   * @method
   * @private
   * @memberOf Node
   */
  _applySize () {
    var modes = this._propertyCache.size.modes;
    var absolute = this._propertyCache.size.absolute;
    var proportional = this._propertyCache.size.proportional;

    if (modes[0] === 'absolute')
      this._applyStyle('width', `${absolute[0]}px`);
    else if (modes[0] === 'relative')
      this._applyStyle('width', `${proportional[0] * 100}%`);

    if (modes[1] === 'absolute')
      this._applyStyle('height', `${absolute[1]}px`);
    else if (modes[1] === 'relative')
      this._applyStyle('height', `${proportional[1] * 100}%`);
  }

  /**
   * [applyTransform description]
   *
   * @method
   * @private
   * @memberOf Node
   */
  _applyTransform (){
    var matrix3d = this._styleCache.transform.matrix3d;

    var transform = `
      matrix3d(
        ${ Utility.epsilon(  matrix3d[0]  ) },
        ${ Utility.epsilon(  matrix3d[1]  ) },
        ${ Utility.epsilon(  matrix3d[2]  ) },
        ${ Utility.epsilon(  matrix3d[3]  ) },
        ${ Utility.epsilon(- matrix3d[4]  ) },
        ${ Utility.epsilon(- matrix3d[5]  ) },
        ${ Utility.epsilon(- matrix3d[6]  ) },
        ${ Utility.epsilon(- matrix3d[7]  ) },
        ${ Utility.epsilon(  matrix3d[8]  ) },
        ${ Utility.epsilon(  matrix3d[9]  ) },
        ${ Utility.epsilon(  matrix3d[10] ) },
        ${ Utility.epsilon(  matrix3d[11] ) },
        ${ Utility.epsilon(  matrix3d[12] ) },
        ${ Utility.epsilon(  matrix3d[13] ) },
        ${ Utility.epsilon(  matrix3d[14] ) },
        ${ Utility.epsilon(  matrix3d[15] ) }
      )
    `;

    this._applyStyle('transform', transform);
  }

  /**
   * [applyStyle description]
   *
   * @method
   * @private
   * @memberOf Node
   * @param  {String} property [description]
   * @param  {String} value    [description]
   */
  _applyStyle (property, value) {
    this.element.style[property] = value;
  }

  /**
   * [setMatrix3d description]
   *
   * @method
   * @private
   * @memberOf Node
   * @param {Array} matrix [description]
   */
  _setMatrix3d (matrix){
    if (true || ! _.isEqual(this._styleCache.transform.matrix3d, matrix)) {
      this._styleCache.transform.matrix3d = matrix;
      this._applyTransform();
    }
  }

  /**
   * [setPosition description]
   *
   * @method
   * @memberOf Node
   * @param {Array} position [description]
   * @param {Object} transition [description]
   */
  setPosition (position, transition) {
    if (! transition)
      this.position.set(position[0], position[1], position[2]);
    else {
      if (! this._tweens.position)
        this._tweens.position = new TWEEN.Tween(this.position);
      this._tweens.position.stop()
        .to({ x: position[0], y: position[1], z: position[2] }, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setRotation description]
   *
   * @method
   * @memberOf Node
   * @param {Array} rotation [description]
   * @param {Object} transition [description]
   */
  setRotation (rotation, transition) {
    if (! transition)
      this.rotation.set(rotation[0], rotation[1], rotation[2]);
    else {
      if (! this._tweens.rotation)
        this._tweens.rotation = new TWEEN.Tween(this.rotation);
      this._tweens.rotation.stop()
        .to({ x: rotation[0], y: rotation[1], z: rotation[2] }, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setScale description]
   *
   * @method
   * @memberOf Node
   * @param {Array} scale [description]
   * @param {Object} transition [description]
   */
  setScale (scale, transition) {
    if (! transition)
      this.scale.set(scale[0], scale[1], scale[2]);
    else {
      if (! this._tweens.scale)
        this._tweens.scale = new TWEEN.Tween(this.scale);
      this._tweens.scale.stop()
        .to({ x: scale[0], y: scale[1], z: scale[2] }, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setOpacity description]
   *
   * @method
   * @memberOf Node
   * @param {Number} opacity [description]
   * @param {Object} transition [description]
   */
  setOpacity (opacity, transition) {
    if (! transition)
      this.opacity = opacity;
    else {
      if (! this._tweens.opacity)
        this._tweens.opacity = new TWEEN.Tween(this);
      this._tweens.opacity.stop()
        .to( {opacity: opacity}, transition.duration)
        .easing(new Curve(transition.curve).get())
        .start();
    }
  }

  /**
   * [setSizeModes description]
   *
   * @method
   * @memberOf Node
   * @param {Array} modes [description]
   */
  setSizeModes (modes) {
    if (! _.isEqual(modes, this._propertyCache.size.modes)) {
      this._propertyCache.size.modes = modes;
      this._applySize();
    }
  }

  /**
   * [setAbsolute description]
   *
   * @method
   * @memberOf Node
   * @param {Array} size [description]
   * @param {Object} transition [description]
   */
  setAbsoluteSize (size, transition) {
    if (! transition) {
      if (! _.isEqual(size, this._propertyCache.size.absolute)) {
        this._propertyCache.size.absolute = size;

        if (this._propertyCache.size.modes.indexOf('absolute') > -1)
          this._applySize();
      }
    } else {
      // Handle transition
    }
  }

  /**
   * [setProportionalSize description]
   *
   * @method
   * @memberOf Node
   * @param {Array} size [description]
   * @param {Object} transition [description]
   */
  setProportionalSize (size, transition) {
    if (! transition) {
      if (! _.isEqual(size, this._propertyCache.size.proportional)) {
        this._propertyCache.size.proportional = size;

        if (this._propertyCache.size.modes.indexOf('relative') > -1)
          this._applySize();
      }
    } else {
      // Handle transition
    }
  }

  /**
   * [setAlign description]
   *
   * @method
   * @memberOf Node
   * @param {Array} alignment [description]
   * @param {Object} transition [description]
   */
  setAlign (alignment, transition) {
    if (! transition) {
      if (! _.isEqual(alignment, this._propertyCache.align)) {
        this._propertyCache.align = alignment;
        this._applyTransform();
      }
    } else {
      // Handle transition
    }
  }

  /**
   * [setClasses description]
   *
   * @todo check to see if updating classes name causes layout thrashing
   *
   * @method
   * @memberOf Node
   * @param {Array} classses [description]
   */
  setClasses (classes = []) {
    var changed = false;

    for (var c of classes) {
      // If the class isn't already in the class cache add it
      if (this._classes.indexOf(c) == -1) {
        this._classes.push(c);
        changed = true;
      }
    }

    // If the classes have changed update element
    if (changed)
      this.element.className = this._classes.join(" ");
  }

  /**
   * Set all properties of the Node in one method with optional transition
   *
   * @todo Maybe make the second parameter a Transition class
   *
   * @method
   * @memberOf Node
   * @param {Object} properties Properties object - see example
   * @param {String} transition Transition
   *
   * @example
   * node.setProperties({
   *   classes: ['open'],
   *   position: [200, 300, 0],
   *   rotation: [3, 0, 0],
   *   scale: [1, 1, 1],
   *   size: {
   *     modes: ['absolute', 'relative'],
   *     absolute: [300, null],
   *     proportional: [null, .5]
   *   },
   *   opacity: .9
   * }, {
   *   duration: 2000,
   *   curve: 'ExponentialIn'
   * })
   */
  setProperties (properties, transition) {
    // Classes
    if (properties.classes)
      this.setClasses(properties.classes);

    // Position
    if (properties.position && properties.position.length === 3)
      this.setPosition(properties.position, transition);

    // Rotation
    if (properties.rotation && properties.rotation.length === 3)
      this.setRotation(properties.rotation, transition);

    // Scale
    if (properties.scale && properties.scale.length === 3)
      this.setScale(properties.scale, transition);

    // Align
    if (properties.align && properties.align.length === 3)
      this.setAlign(properties.align);

    // Size
    if (properties.size) {

      // Size Modes
      if (properties.size.modes && properties.size.modes.length === 2)
        this.setSizeModes(properties.size.modes);

      // Absolute Size
      if (properties.size.absolute && properties.size.absolute.length === 2)
        this.setAbsoluteSize(properties.size.absolute);

      // Relative Size
      if (properties.size.proportional && properties.size.proportional.length === 2)
        this.setProportionalSize(properties.size.proportional);

    }

    // Opacity
    if (typeof properties.opacity != 'undefined')
      this.setOpacity(properties.opacity, transition);
  }

  /**
   * Method to add child Node
   *
   * @method
   * @memberof Node
   * @param {Node} node [description]
   */
  addChild (node) {
    this.add(node);
  }

  /**
   * [render description]
   *
   * @method
   * @memberOf Node
   * @param  {Scene} scene [description]
   */
  render (scene) {
    this._setMatrix3d(this.matrixWorld.elements);

    //If Node isn't mounted.. mount it to the camera element
    if (! this._mounted) {

      // Mount to parent if parent is a Node
      if (this.parent instanceof Node) {
        this.parent.element.appendChild(this.element);
        this._mounted = true;

      // Mount to camera if top level Node
      } else {
        scene.camera.element.appendChild(this.element);
        this._mounted = true;
      }
    }

    // Render Children
    for (var child of this.children){
      child.render(scene);
    }
  }
}
