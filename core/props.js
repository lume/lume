"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changePropContext = exports.mapPropTo = exports.props = void 0;

var _WithUpdate = require("../html/WithUpdate");

var _three = require("three");

var _XYZNumberValues = _interopRequireDefault(require("./XYZNumberValues"));

var _XYZNonNegativeValues = _interopRequireDefault(require("./XYZNonNegativeValues"));

var _XYZStringValues = _interopRequireDefault(require("./XYZStringValues"));

var _XYZSizeModeValues = _interopRequireDefault(require("./XYZSizeModeValues"));

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

// This helper is meant to be used to create prop types for props who's values
// are instances of XYZValues (or subclasses of XYZValues), general on Node and
// Behavior class hierarchies.
function createXYZPropType(_Type, override = {}) {
  return _objectSpread({
    attribute: {
      source: true,
      target: false
    },

    coerce(val, propName) {
      // if we have a property function, pass it along as is
      if (typeof val === 'function') return val; // if we're setting the same instance, use it as is

      if (val === this[propName]) return val; // otherwise we process the input value into the XYZValues object

      return this[propName].from(val);
    },

    default(propName) {
      return this._props[propName];
    },

    deserialize(val, propName) {
      return this[propName].fromString(val);
    },

    serialize(_val, propName) {
      return this[propName].toString();
    }

  }, override);
}

function createGenericPropType(Type, override = {}) {
  return _objectSpread({
    attribute: {
      source: true,
      target: false
    },
    coerce: val => val instanceof Type ? val : new Type(val),
    default: new Type(),
    deserialize: val => new Type(val),
    serialize: val => val.toString()
  }, override);
} // basicProps gives us some generic prop types:
// props.any
// props.array
// props.boolean
// props.number
// props.object
// props.string


const props = _objectSpread({}, _WithUpdate.props, {
  boolean: _objectSpread({}, _WithUpdate.props.boolean, {
    deserialize: val => val != null && val !== 'false'
  }),
  THREE: {
    // TODO replace THREE.Color with a persistent object that can be
    // dynamically updated, like with XYZValues
    Color: createGenericPropType(_three.Color, {
      default: () => new _three.Color(Math.random(), Math.random(), Math.random()),
      serialize: val => (val instanceof _three.Color ? val : new _three.Color(val)).getStyle()
    })
  },
  XYZNumberValues: createXYZPropType(_XYZNumberValues.default),
  XYZNonNegativeValues: createXYZPropType(_XYZNonNegativeValues.default),
  XYZStringValues: createXYZPropType(_XYZStringValues.default),
  XYZSizeModeValues: createXYZPropType(_XYZSizeModeValues.default)
}); // map a SkateJS prop value to another target specified by getTarget
// NOTE `this` refers to the instance on which the prop exists


exports.props = props;

const mapPropTo = (prop, getTarget) => _objectSpread({}, prop, {
  coerce: prop.coerce ? function coerce(val, key) {
    const target = getTarget.call(this, this);
    const coerced = prop.coerce.call(this, val, key);
    if (target) target[key] = coerced;
    return coerced;
  } : undefined,
  deserialize: prop.deserialize ? function deserialize(val, key) {
    const target = getTarget.call(this, this);
    const deserialized = prop.deserialize.call(this, val, key);
    if (target) target[key] = deserialized;
    return deserialized;
  } : undefined
});

exports.mapPropTo = mapPropTo;

const changePropContext = (prop, getContext) => _objectSpread({}, prop, {
  coerce: prop.coerce ? function coerce(val, propName) {
    return prop.coerce.call(getContext.call(this, this), val, propName);
  } : undefined,
  default: prop.default ? function (propName) {
    return prop.default.call(getContext.call(this, this), propName);
  } : undefined,
  deserialize: prop.deserialize ? function deserialize(val, propName) {
    return prop.deserialize.call(getContext.call(this, this), val, propName);
  } : undefined,
  serialize: prop.serialize ? function serialize(val, propName) {
    return prop.serialize.call(getContext.call(this, this), val, propName);
  } : undefined
});

exports.changePropContext = changePropContext;