import TWEEN from 'tween'

/**
 * Curve Class
 * @class Curve
 * @return {Curve} A new instance of Curve
 */
export default
class Curve {

  /**
   * @constructor
   */
  constructor (key) {

    this._curveFunction = null;

    // Select Curve
    switch(key) {

      // Linear
      case 'Linear':
        this._curveFunction = TWEEN.Easing.Linear.None;
        break;


      // Exponential
      case 'ExponentialIn':
        this._curveFunction = TWEEN.Easing.Exponential.In;
        break;

      case 'ExponentialOut':
        this._curveFunction = TWEEN.Easing.Exponential.InOut;
        break;

      case 'ExponentialInOut':
        this._curveFunction = TWEEN.Easing.Exponential.InOut;
        break;


      // Quadratic
      case 'QuadraticIn':
        this._curveFunction = TWEEN.Easing.Quadratic.In;
        break;

      case 'QuadraticOut':
        this._curveFunction = TWEEN.Easing.Quadratic.InOut;
        break;

      case 'QuadraticInOut':
        this._curveFunction = TWEEN.Easing.Quadratic.InOut;
        break;


      // Cubic
      case 'CubicIn':
        this._curveFunction = TWEEN.Easing.Cubic.In;
        break;

      case 'CubicOut':
        this._curveFunction = TWEEN.Easing.Cubic.InOut;
        break;

      case 'CubicInOut':
        this._curveFunction = TWEEN.Easing.Cubic.InOut;
        break;


      // Quartic
      case 'QuarticIn':
        this._curveFunction = TWEEN.Easing.Quartic.In;
        break;

      case 'QuarticOut':
        this._curveFunction = TWEEN.Easing.Quartic.InOut;
        break;

      case 'QuarticInOut':
        this._curveFunction = TWEEN.Easing.Quartic.InOut;
        break;


      // Quintic
      case 'QuinticIn':
        this._curveFunction = TWEEN.Easing.Quintic.In;
        break;

      case 'QuarticOut':
        this._curveFunction = TWEEN.Easing.Quintic.InOut;
        break;

      case 'QuinticInOut':
        this._curveFunction = TWEEN.Easing.Quintic.InOut;
        break;


      // Sinusoidal
      case 'SinusoidalIn':
        this._curveFunction = TWEEN.Easing.Sinusoidal.In;
        break;

      case 'SinusoidalOut':
        this._curveFunction = TWEEN.Easing.Sinusoidal.InOut;
        break;

      case 'SinusoidalInOut':
        this._curveFunction = TWEEN.Easing.Sinusoidal.InOut;
        break;


      // Circular
      case 'CircularIn':
        this._curveFunction = TWEEN.Easing.Circular.In;
        break;

      case 'CircularOut':
        this._curveFunction = TWEEN.Easing.Circular.InOut;
        break;

      case 'CircularInOut':
        this._curveFunction = TWEEN.Easing.Circular.InOut;
        break;


      // Elastic
      case 'ElasticIn':
        this._curveFunction = TWEEN.Easing.Elastic.In;
        break;

      case 'ElasticOut':
        this._curveFunction = TWEEN.Easing.Elastic.InOut;
        break;

      case 'ElasticInOut':
        this._curveFunction = TWEEN.Easing.Elastic.InOut;
        break;


      // Back
      case 'BackIn':
        this._curveFunction = TWEEN.Easing.Back.In;
        break;

      case 'BackOut':
        this._curveFunction = TWEEN.Easing.Back.InOut;
        break;

      case 'BackInOut':
        this._curveFunction = TWEEN.Easing.Back.InOut;
        break;


      // Bounce
      case 'BounceIn':
        this._curveFunction = TWEEN.Easing.Bounce.In;
        break;

      case 'BounceOut':
        this._curveFunction = TWEEN.Easing.Bounce.InOut;
        break;

      case 'BounceInOut':
        this._curveFunction = TWEEN.Easing.Bounce.InOut;
        break;


      default:
        this._curveFunction = TWEEN.Easing.Exponential.InOut;
    }
  }

  /**
   * [get description]
   *
   * @method
   * @memberOf Curve
   * @return {[type]} [description]
   */
  get () {
    return this._curveFunction;
  }

}
