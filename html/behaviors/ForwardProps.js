"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ForwardProps = void 0;

var _jamesBond = require("james-bond");

var _lowclass = require("lowclass");

function ForwardPropsMixin(Base) {
  class ForwardProps extends (0, _lowclass.Constructor)(Base) {
    constructor(...args) {
      super(...args);
      this.__propChangedCallback = this.__propChangedCallback.bind(this);
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();

      this.__forwardInitialProps();

      this.__observeProps();
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();

      this.__unobserveProps();
    }

    get _observedObject() {
      throw new TypeError(`
                The subclass using ForwardProps must define a protected
                _observedObject property defining the object from which props
                are forwarded.
            `);
    }

    __propChangedCallback(propName, value) {
      ;
      this[propName] = value;
    }

    __observeProps() {
      (0, _jamesBond.observe)(this._observedObject, this.__getProps(), this.__propChangedCallback, {// inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
      });
    }

    __unobserveProps() {
      (0, _jamesBond.unobserve)(this._observedObject, this.__getProps(), this.__propChangedCallback);
    }

    __getProps() {
      let result;
      const props = this.constructor.props;
      if (Array.isArray(props)) result = props;else {
        result = [];
        if (typeof props === 'object') for (const prop in props) result.push(prop);
      }
      return result;
    }

    __forwardInitialProps() {
      const observed = this._observedObject;

      for (const prop of this.__getProps()) {
        prop in observed && this.__propChangedCallback(prop, observed[prop]);
      }
    }

  }

  return ForwardProps;
}

const ForwardProps = (0, _lowclass.Mixin)(ForwardPropsMixin);
exports.ForwardProps = ForwardProps;
var _default = ForwardProps;
exports.default = _default;