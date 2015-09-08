var Curve = Infamous.engine.Curve;
var Utility = Infamous.engine.Utility;

const CSS_CLASS_NODE = 'infamous-dom-node';

/**
 * Node Class
 *
 * @class Node
 * @return {Node} A new instance of Node
 */
class Node extends THREE.Object3D {

  /**
   * @constructor
   */
  constructor (properties) {
    super();

    // DOM representation of Node
    this.element = document.createElement('div');

    // Class Cache
    this._classes = [
      CSS_CLASS_NODE
    ];

    // Force initial class set;
    this.setClasses();

    // Style Cache
    this._styleCache = {
      opacity: 1,
      sizes: {
        modes: ['absolute', 'absolute'],
        absolute: [100, 100],
        proportional: [1, 1]
      },
      transform:{
        matrix3d: [],
        translate3d: [.5, .5, 0]
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
           this.applyStyle('opacity', value);
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
   * [setProperties description]
   *
   * @method
   * @memberOf Node
   * @param {[type]} properties [description]
   * @param {[type]} transition [description]
   */
  setProperties (properties, transition) {
    if (properties.classes)
      this.setClasses(properties.classes);

    if (properties.position && properties.position.length === 3)
      this.setPosition(properties.position, transition);

    if (properties.rotation && properties.rotation.length === 3)
      this.setRotation(properties.rotation, transition);

    if (properties.scale && properties.scale.length === 3)
      this.setScale(properties.scale, transition);

    if (typeof properties.opacity != 'undefined')
      this.setOpacity(properties.opacity, transition);
  }

  /**
   * [setPosition description]
   *
   * @method
   * @memberOf Node
   * @param {[type]} classses [description]
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
   * @param {[type]} classses [description]
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
   * @param {[type]} classses [description]
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
   * @param {[type]} classses [description]
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
   * @param {[type]} x [description]
   * @param {[type]} y [description]
   * @param {[type]} z [description]
   */
  setSizeModes (x, y) {
    var modes = [x, y];

    if (! _.isEqual(modes, this._styleCache.size.modes)) {
      this._styleCache.size.modes = modes;
      this.applySize();
    }
  }

  /**
   * [setAbsolute description]
   * @param {[type]} x [description]
   * @param {[type]} y [description]
   */
  setAbsoluteSize (x, y) {
    var absolute = [x, y];

    if (! _.isEqual(absolute, this._styleCache.size.absolute)) {
      this._styleCache.size.absolute = absolute;

      if (this._styleCache.size.modes.indexOf('absolute') > -1)
        this.applySize();
    }
  }

  /**
   * [setProportionalSize description]
   * @param {[type]} x [description]
   * @param {[type]} y [description]
   */
  setProportionalSize (x, y) {
    var proportional = [x, y];

    if (! _.isEqual(proportional, this._styleCache.size.proportional)) {
      this._styleCache.size.proportional = proportional;

      if (this._styleCache.size.modes.indexOf('relative') > -1)
        this.applySize();
    }
  }

  /**
   * [applySize description]
   * @return {[type]}   [description]
   */
  applySize () {
    var modes = this._styleCache.size.modes;
    var absolute = this._styleCache.size.absolute;
    var proportional = this._styleCache.size.proportional;

    if (modes[0] === 'abslute')
      this.applyStyle('width', `${absolute[0]}px`);
    else if (modes[0] === 'relative')
      this.applyStyle('width', `${proportional[0] * 100}%`);

    if (modes[1] === 'absolute')
      this.applyStyle('height', `${absolute[1]}px`);
    else if (modes[1] === 'relatve')
      this.applyStyle('height', `${proportional[1] * 100}%`);
  }

  /**
   * [setAlign description]
   * @param {[type]} x [description]
   * @param {[type]} y [description]
   * @param {[type]} z [description]
   */
  setAlign (x, y, z) {
    var align = [x, y, z];

    if (! _.isEqual(align, this._styleCache.transform.translate3d)) {
      this._styleCache.transform.translate3d = align;
      this.applyTransform();
    }
  }

  /**
   * [setMatrix3d description]
   * @param {[type]} matrix [description]
   */
  setMatrix3d (matrix){
    // console.log(matrix);
    // console.log(this._styleCache.transform.matrix3d);

    if (! _.isEqual(this._styleCache.transform.matrix3d, matrix)) {

      this._styleCache.transform.matrix3d = matrix;
      this.applyTransform();
    }
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
        ${ Utility.applyCSSLabel(translate3d[0], '%') },
        ${ Utility.applyCSSLabel(translate3d[1], '%') },
        ${ Utility.applyCSSLabel(translate3d[2], '%') }
      )

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

    console.log(transform);

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
   * [setClasses description]
   *
   * @todo check to see if updating classes name causes layout thrashing
   *
   * @method
   * @memberOf Node
   * @param {[type]} classses [description]
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
   * [render description]
   *
   * @method
   * @memberOf Node
   * @param  {[type]} camera [description]
   * @return {[type]}        [description]
   */
  render (scene) {
    this.setMatrix3d(this.matrixWorld.elements);

    // If Node isn't mounted.. mount it to the camera element
    if (this.element.parentNode !== scene.camera.element) {
      scene.camera.element.appendChild(this.element);
    }

    // Render Children
    for (var child of this.children){
      child.render(scene);
    }
  }
}

Infamous.engine.Node = Node;
