"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Sizeable = void 0;

var _lowclass = require("lowclass");

var _Observable = _interopRequireDefault(require("./Observable"));

var _TreeNode = _interopRequireDefault(require("./TreeNode"));

var _XYZSizeModeValues = _interopRequireDefault(require("./XYZSizeModeValues"));

var _XYZNonNegativeValues = _interopRequireDefault(require("./XYZNonNegativeValues"));

var _Motor = _interopRequireDefault(require("./Motor"));

var _props = require("./props");

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
}

// working variables (used synchronously only, to avoid making new variables in
// repeatedly-called methods)
let propFunctionTask;
const previousSize = {};

function SizeableMixin(Base) {
  const Parent = _Observable.default.mixin(_TreeNode.default.mixin((0, _lowclass.Constructor)(Base))); // Sizeable extends TreeNode because Sizeable knows about its `parent` when
  // calculating proportional sizes. Also Transformable knows about it's parent
  // in order to calculate it's world matrix based on it's parent's.


  class Sizeable extends Parent {
    // TODO handle ctor arg types
    constructor(...args) {
      super(...args);
      this.__propertyFunctions = null;
      this.__settingValueFromPropFunction = false;
      const options = args[0] || {};
      this.__calculatedSize = {
        x: 0,
        y: 0,
        z: 0
      };
      this._properties = this._props; // alias to WithUpdate._props

      this._setPropertyObservers();

      this.properties = options;
    } // TODO types for props


    updated(_oldProps, modifiedProps) {
      if (!this.isConnected) return; // this covers single-valued properties like opacity, but has the
      // sideeffect of trigger propertychange more than needed for
      // XYZValues (here, and in the above valuechanged handlers).
      //
      // TODO FIXME we want to batch Observable updates so that this doesn't
      // happen. Maybe we'll do it by batching events that have the same
      // name. We should make it possible to choose to have sync or async
      // events, and whether they should batch or not.

      for (const [prop, modified] of Object.entries(modifiedProps)) if (modified) this.trigger('propertychange', prop);
    }
    /**
     * Set the size mode for each axis. Possible size modes are "literal"
     * and "proportional". The default values are "literal" for all axes.
     */


    set sizeMode(newValue) {
      if (typeof newValue === 'function') throw new TypeError('property functions are not allowed for sizeMode');

      this._setPropertyXYZ('sizeMode', newValue);
    }

    get sizeMode() {
      return this._props.sizeMode;
    } // TODO: A "differential" size would be cool. Good for padding,
    // borders, etc. Inspired from Famous' differential sizing.
    //
    // TODO: A "target" size where sizing can be relative to another node.
    // This would be tricky though, because there could be circular size
    // dependencies. Maybe we'd throw an error in that case, because there'd be no original size to base off of.

    /**
     * Set the size of each axis. The size for each axis depends on the
     * sizeMode for each axis. For example, if node.sizeMode is set to
     * `sizeMode = ['literal', 'proportional', 'literal']`, then setting
     * `size = [20, 0.5, 30]` means that X size is a literal value of 20,
     * Y size is 0.5 of it's parent Y size, and Z size is a literal value
     * of 30. It is easy this way to mix literal and proportional sizes for
     * the different axes.
     *
     * Literal sizes can be any value (the literal size that you want) and
     * proportional sizes are a number between 0 and 1 representing a
     * proportion of the parent node size. 0 means 0% of the parent size,
     * and 1.0 means 100% of the parent size.
     *
     * All size values must be positive numbers.
     *
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis size to apply.
     * @param {number} [newValue.y] The y-axis size to apply.
     * @param {number} [newValue.z] The z-axis size to apply.
     */


    set size(newValue) {
      this._setPropertyXYZ('size', newValue);
    }

    get size() {
      return this._props.size;
    }
    /**
     * Get the actual size of the Node. This can be useful when size is
     * proportional, as the actual size of the Node depends on the size of
     * it's parent.
     *
     * @readonly
     *
     * @return {Array.number} An Oject with x, y, and z properties, each
     * property representing the computed size of the x, y, and z axes
     * respectively.
     */


    get calculatedSize() {
      // TODO
      // if (this.__sizeDirty) Protected(this._calcSize)
      return _objectSpread({}, this.__calculatedSize);
    }
    /**
     * Set all properties of a Sizeable in one method.
     *
     * @param {Object} properties Properties object - see example
     *
     * @example
     * node.properties = {
     *   sizeMode: {x:'literal', y:'proportional', z:'literal'},
     *   size: {x:300, y:0.2, z:200},
     * }
     */


    set properties(properties) {
      this.props = properties;
    }

    get properties() {
      return this.props;
    }

    makeDefaultProps() {
      return Object.assign(super.makeDefaultProps(), {
        sizeMode: new _XYZSizeModeValues.default('literal', 'literal', 'literal'),
        size: new _XYZNonNegativeValues.default(100, 100, 100)
      });
    } // TODO change all event values to objects. See here for reasoning:
    // https://github.com/airbnb/javascript#events


    _setPropertyObservers() {
      this._properties.sizeMode.on('valuechanged', () => this.trigger('propertychange', 'sizeMode'));

      this._properties.size.on('valuechanged', () => this.trigger('propertychange', 'size'));
    }

    get _renderParent() {
      if (this.hasHtmlApi) {
        return this._composedParent;
      } else {
        return this.parent;
      }
    }

    get _renderChildren() {
      if (this.hasHtmlApi) {
        return this._composedChildren;
      } else {
        return this.subnodes;
      }
    }

    _getParentSize() {
      const parent = this._renderParent;
      return parent ? parent.__calculatedSize : {
        x: 0,
        y: 0,
        z: 0
      };
    }

    _calcSize() {
      const calculatedSize = this.__calculatedSize;
      Object.assign(previousSize, calculatedSize);
      const {
        sizeMode,
        size
      } = this._properties;

      const parentSize = this._getParentSize();

      if (sizeMode.x == 'literal') {
        calculatedSize.x = size.x;
      } else {
        // proportional
        calculatedSize.x = parentSize.x * size.x;
      }

      if (sizeMode.y == 'literal') {
        calculatedSize.y = size.y;
      } else {
        // proportional
        calculatedSize.y = parentSize.y * size.y;
      }

      if (sizeMode.z == 'literal') {
        calculatedSize.z = size.z;
      } else {
        // proportional
        calculatedSize.z = parentSize.z * size.z;
      }

      if (previousSize.x !== calculatedSize.x || previousSize.y !== calculatedSize.y || previousSize.z !== calculatedSize.z) {
        this.trigger('sizechange', _objectSpread({}, calculatedSize));
      }
    }

    _setPropertyXYZ(name, newValue) {
      if (isXYZPropertyFunction(newValue)) {
        this.__handleXYZPropertyFunction(newValue, name);
      } else {
        if (!this.__settingValueFromPropFunction) this.__removePropertyFunction(name);else this.__settingValueFromPropFunction = false;
        this._props[name] = newValue;
      }
    }

    _setPropertySingle(name, newValue) {
      if (isSinglePropertyFunction(newValue)) {
        this.__handleSinglePropertyFunction(newValue, name);
      } else {
        if (!this.__settingValueFromPropFunction) this.__removePropertyFunction(name);else this.__settingValueFromPropFunction = false;
        this._props[name] = newValue;
      }
    }

    __handleXYZPropertyFunction(fn, name) {
      if (!this.__propertyFunctions) this.__propertyFunctions = new Map();

      if (propFunctionTask = this.__propertyFunctions.get(name)) {
        _Motor.default.removeRenderTask(propFunctionTask);

        propFunctionTask = null;
      }

      this.__propertyFunctions.set(name, _Motor.default.addRenderTask(time => {
        const result = fn(this._properties[name].x, this._properties[name].y, this._properties[name].z, time);

        if (result === false) {
          this.__propertyFunctions.delete(name);

          return false;
        } // mark this true, so that the following set of this[name]
        // doesn't override the prop function (normally a
        // user can set this[name] to a value that isn't a function
        // to disable the prop function).


        this.__settingValueFromPropFunction = true;
        this[name] = result;
      }));
    }

    __handleSinglePropertyFunction(fn, name) {
      if (!this.__propertyFunctions) this.__propertyFunctions = new Map();

      if (propFunctionTask = this.__propertyFunctions.get(name)) {
        _Motor.default.removeRenderTask(propFunctionTask);

        propFunctionTask = null;
      }

      this.__propertyFunctions.set(name, _Motor.default.addRenderTask(time => {
        const result = fn(this._properties[name], time);

        if (result === false) {
          this.__propertyFunctions.delete(name);

          return false;
        }

        this.__settingValueFromPropFunction = true;
        this[name] = result;
      }));
    } // remove property function (render task) if any.


    __removePropertyFunction(name) {
      if (this.__propertyFunctions && (propFunctionTask = this.__propertyFunctions.get(name))) {
        _Motor.default.removeRenderTask(propFunctionTask);

        this.__propertyFunctions.delete(name);

        if (!this.__propertyFunctions.size) this.__propertyFunctions = null;
        propFunctionTask = null;
      }
    }

  }

  Sizeable.props = _objectSpread({}, Parent.props || {}, {
    size: _props.props.XYZNonNegativeValues,
    sizeMode: _props.props.XYZSizeModeValues
  });
  return Sizeable;
} // the following type guards are used above just to satisfy the type system,
// though the actual runtime check does not guarantee that the functions are of
// the expected shape.


function isXYZPropertyFunction(f) {
  return typeof f === 'function';
}

function isSinglePropertyFunction(f) {
  return typeof f === 'function';
}

const Sizeable = (0, _lowclass.Mixin)(SizeableMixin);
exports.Sizeable = Sizeable;
var _default = Sizeable; // const s: Sizeable = new Sizeable()
// s.sizeMode
// s.asdfasdf
// s.calculatedSize = 123
// s.innerHTML = 123
// s.innerHTML = 'asdf'
// s.emit('asfasdf', 1, 2, 3)
// s.removeNode('asfasdf')
// s.updated(1, 2, 3, 4)
// s.blahblah

exports.default = _default;