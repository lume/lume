"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobal = getGlobal;

/**
 * @return {typeof Window} - the global object. We assume it is a `Window`
 * because this lib is designed for the web. In theory it can run in Node.js in
 * the future, but it may need the same globals, so typing it as Window is OK as
 * long as we're using the same globals in Node.js. We might also augment the
 * Node.js global at that point.
 */
function getGlobal() {
  let globalObject;
  if (typeof globalThis !== 'undefined') globalObject = globalThis;else if (typeof window !== 'undefined') globalObject = window;else if (typeof global !== 'undefined') globalObject = global;else throw new Error('No global detected!');
  return globalObject;
}