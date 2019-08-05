"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableMixin = ObservableMixin;
exports.default = exports.Observable = void 0;

var _lowclass = require("lowclass");

// TODO strongly typed events. Combine with stuff in Events.ts
function ObservableMixin(Base) {
  class Observable extends (0, _lowclass.Constructor)(Base) {
    constructor() {
      super(...arguments);
      this.__eventMap = null;
    }

    on(eventName, callback, context) {
      let eventMap = this.__eventMap;
      if (!eventMap) eventMap = this.__eventMap = new Map();
      let callbacks = eventMap.get(eventName);
      if (!callbacks) eventMap.set(eventName, callbacks = []);
      if (typeof callback == 'function') callbacks.push([callback, context]); // save callback associated with context
      else throw new Error('Expected a function in callback argument of Observable#on.');
    }

    off(eventName, callback) {
      const eventMap = this.__eventMap;
      if (!eventMap) return;
      const callbacks = eventMap.get(eventName);
      if (!callbacks) return;
      const index = callbacks.findIndex(tuple => tuple[0] === callback);
      if (index == -1) return;
      callbacks.splice(index, 1);
      if (callbacks.length === 0) eventMap.delete(eventName);
      if (eventMap.size === 0) this.__eventMap = null;
    }

    emit(eventName, data) {
      const eventMap = this.__eventMap;
      if (!eventMap) return;
      const callbacks = eventMap.get(eventName);
      if (!callbacks) return;
      let tuple;
      let callback;
      let context;

      for (let i = 0, len = callbacks.length; i < len; i += 1) {
        tuple = callbacks[i];
        callback = tuple[0];
        context = tuple[1];
        callback.call(context, data);
      }
    } // alias for emit


    trigger(eventName, data) {
      return this.emit(eventName, data);
    } // alias for emit


    triggerEvent(eventName, data) {
      return this.emit(eventName, data);
    }

  }

  return Observable;
}

const Observable = (0, _lowclass.Mixin)(ObservableMixin);
exports.Observable = Observable;
var _default = Observable; // const a: Observable = new Observable()
// a.on()
// a.on('asdf', () => {})
// a.blah
// a.foo = 'asdf'
// const ObservableFoo = ObservableMixin(
//     class Foo {
//         foo = 123
//     }
// )
// type ObservableFoo = InstanceType<typeof ObservableFoo>
// const o: ObservableFoo = new ObservableFoo()
// o.on()
// o.on('asdf', () => {})
// o.blah
// o.foo = 'asdf'

exports.default = _default;