"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithUpdateMixin = WithUpdateMixin;
exports.normalizeAttributeDefinition = normalizeAttributeDefinition;
exports.normalizePropertyDefinition = normalizePropertyDefinition;
exports.prop = prop;
exports.props = exports.default = exports.WithUpdate = void 0;

var _lowclass = require("lowclass");

var _utils = require("./utils");

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
} // forked from https://www.npmjs.com/package/skatejs v5.2.4
// MIT License: https://github.com/skatejs/skatejs/blob/412081535656416ac98b72e3f6088393729a86e5/LICENSE


function WithUpdateMixin(Base) {
  const Parent = (0, _lowclass.Constructor)(Base);

  class WithUpdate extends Parent {
    static get props() {
      if (!this._staticProps) this._staticProps = {};
      return this._staticProps;
    }

    static set props(props) {
      this._staticProps = props;
    }

    static get observedAttributes() {
      // make sure to create a new instance of these static props per constructor.
      if (!this._attributeToAttributeMap) this._attributeToAttributeMap = {};
      if (!this._attributeToPropertyMap) this._attributeToPropertyMap = {};
      if (!this._observedAttributes) this._observedAttributes = []; // We have to define props here because observedAttributes are retrieved
      // only once when the custom element is defined. If we did this only in
      // the constructor, then props would not link to attributes.

      defineProps(this);
      return (0, _utils.unique)(this._observedAttributes.concat(Parent.observedAttributes || []));
    }

    constructor(...args) {
      super(...args);
      this.__prevProps = {}; // this._props extends from __existingPrototypeValues in case we
      // overwrote a prototype property that had an existing value during
      // definition of the props. This ensures we get the original
      // prototype value when we read from a prop that we haven't set yet.

      this._props = _objectSpread({}, this.constructor.__existingPrototypeValues || {}, this.makeDefaultProps()); // TODO (trusktr), I was thinking to make the protected _props
      // readonly. Should it be private only (requires refactoring
      // Sizeable and Transformable)? Or is convenient for subclasses to
      // read from the cache? I'm leaning towards protected readonly.
      // Protected(this)._props = new PropsReadonly(this)

      this.__modifiedProps = {};
    }

    get props() {
      return (0, _utils.pick)(this, Object.keys(this.constructor.props));
    }

    set props(props) {
      // const ctorProps = (this.constructor as any).props
      Object.keys(props).forEach(k =>
      /*k in ctorProps && */
      this[k] = props[k]);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const {
        _attributeToAttributeMap,
        _attributeToPropertyMap,
        _propsNormalized
      } = this.constructor;

      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }

      const propertyName = _attributeToPropertyMap[name];

      if (propertyName) {
        const propertyDefinition = _propsNormalized[propertyName];

        if (propertyDefinition) {
          const {
            default: defaultValue,
            deserialize
          } = propertyDefinition;
          const propertyValue = deserialize ? deserialize.call(this, newValue, propertyName) : newValue;
          this._props[propertyName] = propertyValue == null ? defaultValue.call(this) : propertyValue;
          this.__modifiedProps[propertyName] = true;
          this.triggerUpdate();
        }
      }

      const targetAttributeName = _attributeToAttributeMap[name];

      if (targetAttributeName) {
        if (newValue == null) {
          this.removeAttribute(targetAttributeName);
        } else {
          this.setAttribute(targetAttributeName, newValue);
        }
      }
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      const propsList = this.constructor._propNames;

      for (let i = 0, l = propsList.length; i < l; i += 1) this.__modifiedProps[propsList[i]] = true;

      this.triggerUpdate();
    }

    shouldUpdate(_prevProps, _modifiedProps) {
      return true;
    }

    triggerUpdate() {
      if (this.__updating) {
        return;
      }

      this.__updating = true;
      delay(() => {
        const {
          __prevProps,
          __modifiedProps
        } = this;

        if (this.updating) {
          this.updating(__prevProps, __modifiedProps);
        }

        if (this.updated && this.shouldUpdate(__prevProps, __modifiedProps)) {
          this.updated(__prevProps, __modifiedProps);
        }

        this.__prevProps = this.props;
        const {
          _propNames
        } = this.constructor;

        for (let i = 0, l = _propNames.length; i < l; i += 1) this.__modifiedProps[_propNames[i]] = false;

        this.__updating = false;
      });
    }

    triggerUpdateForProp(prop) {
      this.__modifiedProps[prop] = true;
      this.triggerUpdate();
    }

    triggerUpdateForProps(props) {
      for (const prop of props) this.__modifiedProps[prop] = true;

      this.triggerUpdate();
    }

    triggerUpdateForAllProps() {
      const {
        _propNames
      } = this.constructor;
      _propNames && this.triggerUpdateForProps(_propNames);
    } // subclasses should extend this method and assign default props values
    // to the returned object.


    makeDefaultProps() {
      return {};
    }

  }

  return WithUpdate;
}

const WithUpdate = (0, _lowclass.Mixin)(WithUpdateMixin);
exports.WithUpdate = WithUpdate;
var _default = WithUpdate; // const w: WithUpdate = new WithUpdate()
// w.innerHTML = 123
// w.innerHTML = 'asdf'
// w.asdfasdf = 123
// w.setAttribute
// w.setAttribute('asdfasf', 123123)
// w.updating && w.updating()

exports.default = _default;

function normalizeAttributeDefinition(name, prop) {
  const {
    attribute
  } = prop;
  const obj = typeof attribute === 'object' ? _objectSpread({}, attribute) : {
    source: attribute,
    target: attribute
  };

  if (obj.source === true) {
    obj.source = (0, _utils.dashCase)(name);
  }

  if (obj.target === true) {
    obj.target = (0, _utils.dashCase)(name);
  }

  return obj;
}

function normalizePropertyDefinition(name, prop) {
  const {
    coerce,
    default: def,
    deserialize,
    serialize
  } = prop;
  return {
    attribute: normalizeAttributeDefinition(name, prop),
    coerce: coerce || _utils.identity,
    default: typeof def === 'function' ? def : () => def,
    deserialize: deserialize || _utils.identity,
    serialize: serialize || _utils.identity
  };
}

const defaultTypesMap = new Map();

function defineProps(constructor) {
  if (constructor.hasOwnProperty('_propsNormalized')) return;
  const {
    props
  } = constructor;
  constructor._propNames = [];
  Object.keys(props).forEach(name => {
    let func = props[name] || props.any;
    if (defaultTypesMap.has(func)) func = defaultTypesMap.get(func);
    if (typeof func !== 'function') func = prop(func);
    func({
      constructor
    }, name);

    constructor._propNames.push(name);
  });
}

function delay(fn) {
  Promise.resolve().then(fn);
}

function prop(definition) {
  const propertyDefinition = definition || {}; // Allows decorators, or imperative definitions.

  const func = function ({
    constructor
  }, name) {
    const normalized = normalizePropertyDefinition(name, propertyDefinition); // Ensure that we can cache properties. We have to do this so the _props object literal doesn't modify parent
    // classes or share the instance anywhere where it's not intended to be shared explicitly in userland code.

    if (!constructor.hasOwnProperty('_propsNormalized')) {
      constructor._propsNormalized = {};
    } // Cache the value so we can reference when syncing the attribute to the property.


    constructor._propsNormalized[name] = normalized;
    const {
      attribute: {
        source,
        target
      }
    } = normalized;

    if (source) {
      constructor._observedAttributes.push(source);

      constructor._attributeToPropertyMap[source] = name;

      if (source !== target) {
        constructor._attributeToAttributeMap[source] = target;
      }
    } // the returned descriptor contains an "owner" property which is the
    // prototype object on which the descriptor was found.


    const existingDescriptor = (0, _lowclass.getInheritedDescriptor)(constructor.prototype, name); // if (name === 'texture') debugger

    let existingDescriptorType;
    let existingGetter;
    let existingSetter; // if the current constructor already inherits the prop accessor, we
    // don't need to re-define it.

    if (existingDescriptor && existingDescriptor.owner.constructor && existingDescriptor.owner.constructor._propsNormalized && existingDescriptor.owner.constructor._propsNormalized[name]) return;

    if (existingDescriptor) {
      if (!existingDescriptor.configurable) {
        console.error(`Unable to create reactivity for prop "${name}" because existing descriptor is non-configurable.`);
        return;
      } // if (name === 'texture') debugger


      existingDescriptorType = 'value' in existingDescriptor ? 'data' : 'accessor';

      if (existingDescriptorType === 'data') {
        // in case there's existing properties on a contructor's prototype
        // before we overwrite the descriptor. we store those values in this
        // cache so we can use them as initial values.
        if (!constructor.__existingPrototypeValues) constructor.__existingPrototypeValues = {};
        constructor.__existingPrototypeValues[name] = existingDescriptor.value;
      } else if (existingDescriptorType === 'accessor') {
        existingGetter = existingDescriptor.get;
        existingSetter = existingDescriptor.set;
      }
    } else {
      // if (name === 'texture') debugger
      // if there's no descriptor, we want to use the logic associaated
      // with data descriptors
      existingDescriptorType = 'data';
    }

    const newDescriptor = {
      enumerable: existingDescriptor ? existingDescriptor.enumerable : undefined,
      configurable: true,
      get: existingDescriptorType === 'accessor' && !existingGetter ? undefined : newGetter,
      set: existingDescriptorType === 'accessor' && !existingSetter ? undefined : newSetter
    };
    Object.defineProperty(constructor.prototype, name, newDescriptor);

    function newGetter() {
      let val;
      if (existingDescriptorType === 'accessor' && existingGetter) val = existingGetter.call(this);else if (existingDescriptorType === 'data') val = this._props[name];

      if (val == null) {
        val = normalized.default.call(this, name);
        if (existingDescriptorType === 'accessor' && existingSetter) existingSetter.call(this, val);else if (existingDescriptorType === 'data') this._props[name] = val;
      }

      return val;
    }

    function newSetter(val) {
      const {
        attribute: {
          target
        },
        serialize,
        coerce
      } = normalized;

      if (target) {
        const serializedVal = serialize.call(this, val, name);

        if (serializedVal == null) {
          this.removeAttribute(target);
        } else {
          this.setAttribute(target, serializedVal);
        }
      }

      val = coerce.call(this, val, name);
      if (existingDescriptorType === 'accessor' && existingSetter) existingSetter.call(this, val);else if (existingDescriptorType === 'data') this._props[name] = val;
      this.__modifiedProps[name] = true;
      this.triggerUpdate();
    }
  }; // Allows easy extension of pre-defined props, f.e. { ...props.number, default: 42 }.


  Object.keys(propertyDefinition).forEach(key => func[key] = propertyDefinition[key]);
  return func;
}

const {
  parse,
  stringify
} = JSON;
const attribute = Object.freeze({
  source: true
});

const zeroOrNumber = val => (0, _utils.empty)(val) ? 0 : Number(val);

const any = prop({
  attribute
});
const array = prop({
  attribute,
  coerce: val => Array.isArray(val) ? val : (0, _utils.empty)(val) ? null : [val],
  default: Object.freeze([]),
  deserialize: parse,
  serialize: val => val == null ? null : stringify(val)
});
const boolean = prop({
  attribute,
  coerce: Boolean,
  default: false,
  deserialize: val => !(0, _utils.empty)(val),
  serialize: val => val ? '' : null
});
const number = prop({
  attribute,
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: val => (0, _utils.empty)(val) ? null : String(Number(val))
});
const object = prop({
  attribute,
  default: Object.freeze({}),
  deserialize: parse,
  serialize: val => val == null ? null : stringify(val)
});
const string = prop({
  attribute,
  default: '',
  coerce: val => (0, _utils.empty)(val) ? '' : String(val),
  // coerce: (v, n) => {if (n === 'texture') debugger; return String(v)},
  serialize: val => (0, _utils.empty)(val) ? null : String(val)
});
defaultTypesMap.set(Array, array);
defaultTypesMap.set(Boolean, boolean);
defaultTypesMap.set(Number, number);
defaultTypesMap.set(Object, object);
defaultTypesMap.set(String, string);
const props = {
  any,
  array,
  boolean,
  number,
  object,
  string
};
exports.props = props;