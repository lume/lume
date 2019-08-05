"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeEnumFromClassProperties = makeEnumFromClassProperties;
exports.Events = exports.EventTypes = void 0;

class EventTypes {
  constructor( // Listen to this event on an element to run custom logic after the
  // element's GL objects have been initialized.
  // GL_LOAD fires after BEHAVIOR_GL_LOAD, so GL_LOAD guarantees that both the
  // element and the element's behaviors are done loading GL objects.
  GL_LOAD, // Listen to this event on an element to clean up after the element's GL
  // objects have been cleaned up and released.
  // GL_UNLOAD fires after BEHAVIOR_GL_UNLOAD, so GL_UNLOAD guarantees that
  // both the element and the element's behaviors are done unloading GL
  // objects.
  GL_UNLOAD, // Listen to this event on an element to run custom logic after the
  // element's CSS objects have been initialized.
  CSS_LOAD, // Listen to this event on an element to clean up after the element's CSS
  // objects have been cleaned up and released.
  CSS_UNLOAD, // Listen to this event on an element to run custom logic after the
  // element's GL objects have been initialized. This is for use by element
  // behaviors. Code that is outside of a given element and outside of the
  // given element's behaviors should listen to GL_LOADED instead.
  BEHAVIOR_GL_LOAD, // Listen to this event on an element to clean up after the element's GL
  // objects have been initialized. This is for use by element behaviors. Code
  // that is outside of a given element and outside of the given element's
  // behaviors should listen to GL_LOADED instead.
  BEHAVIOR_GL_UNLOAD, // This event is fired when an obj-model element, or a node element with an
  // obj-model behavior, has loaded it's model.
  MODEL_LOAD) {
    this.GL_LOAD = GL_LOAD;
    this.GL_UNLOAD = GL_UNLOAD;
    this.CSS_LOAD = CSS_LOAD;
    this.CSS_UNLOAD = CSS_UNLOAD;
    this.BEHAVIOR_GL_LOAD = BEHAVIOR_GL_LOAD;
    this.BEHAVIOR_GL_UNLOAD = BEHAVIOR_GL_UNLOAD;
    this.MODEL_LOAD = MODEL_LOAD;
  }

}

exports.EventTypes = EventTypes;
const Events = makeEnumFromClassProperties(EventTypes); // loop on the keys of a dummy class instance in order to create an enum-like
// object.

exports.Events = Events;

function makeEnumFromClassProperties(Class) {
  const Enum = {};

  for (const key in new Class()) {
    Enum[key] = key;
  }

  return Object.freeze(Enum);
}