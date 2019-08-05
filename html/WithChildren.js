"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WithChildren = void 0;

var _lowclass = require("lowclass");

var _Utility = require("../core/Utility");

// polyfill for Node.isConnected based on Ryosuke Niwa's
// https://github.com/w3c/webcomponents/issues/789#issuecomment-459858405
if (!Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected')) {
  let rootNode = null;
  if (Node.prototype.getRootNode) rootNode = node => node.getRootNode({
    composed: true
  });else {
    rootNode = node => {
      for (let ancestor = node, ancestorParent; ancestor; ancestor = ancestorParent) {
        ancestorParent = ancestor.parentNode || ancestor.host;
        if (!ancestorParent) return ancestor;
      }

      return node;
    };
  }
  Object.defineProperty(Node.prototype, 'isConnected', {
    get() {
      return rootNode(this).nodeType === Node.DOCUMENT_NODE;
    },

    enumerable: true,
    configurable: true
  });
}

function WithChildrenMixin(Base) {
  class WithChildren extends (0, _lowclass.Constructor)(Base) {
    constructor(...args) {
      super(...args);
      this.__handleChildrenWhenConnected = false;
      this.__observer = null;

      this.__createObserver();

      if (!this.isConnected) {
        this.__handleChildrenWhenConnected = true;
        return;
      }

      this.__handleConnectedChildren();
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();

      if (this.__handleChildrenWhenConnected) {
        this.__handleConnectedChildren();
      }

      this.__createObserver();
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();

      this.__destroyObserver();

      this.__handleChildrenWhenConnected = true;
    }

    __createObserver() {
      if (this.__observer) return; // observeChildren returns a MutationObserver observing childList

      this.__observer = (0, _Utility.observeChildren)(this, child => {
        if (!this.isConnected) return;
        this.childConnectedCallback && this.childConnectedCallback(child);
      }, child => {
        if (!this.isConnected) return;
        this.childDisconnectedCallback && this.childDisconnectedCallback(child);
      }, true);
    }

    __destroyObserver() {
      if (!this.__observer) return;

      this.__observer.disconnect();

      this.__observer = null;
    }

    __handleConnectedChildren() {
      if (!this.isConnected) return;

      for (let element = this.firstElementChild; element; element = element.nextElementSibling) {
        this.__handleConnectedChild(element);
      }
    }

    __handleConnectedChild(element) {
      Promise.resolve().then(() => {
        if (isNotPossiblyCustom(element) || element.matches(':defined')) {
          this.childConnectedCallback && this.childConnectedCallback(element);
        } else {
          setTimeout(() => {
            this.childConnectedCallback && this.childConnectedCallback(element);
          });
        }
      });
    }

  }

  return WithChildren;
}

function isNotPossiblyCustom(element) {
  return !element.localName.includes('-');
}

const WithChildren = (0, _lowclass.Mixin)(WithChildrenMixin);
exports.WithChildren = WithChildren;
var _default = WithChildren;
exports.default = _default;