"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Node = void 0;

var _lowclass = require("lowclass");

require("geometry-interfaces");

var _ImperativeBase = _interopRequireWildcard(require("./ImperativeBase"));

var _HTMLNode = _interopRequireDefault(require("../html/HTMLNode"));

var _props = require("./props");

require("../html/behaviors/ObjModelBehavior");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

(0, _ImperativeBase.initImperativeBase)();

function NodeMixin(Base) {
  // NOTE for now, we assume Node is mixed with its HTMLInterface.
  const Parent = _ImperativeBase.default.mixin((0, _lowclass.Constructor)(Base));

  class Node extends Parent {
    /**
     * @constructor
     *
     * @param {Object} options Initial properties that the node will
     * have. This can be used when creating a node, alternatively to using the
     * setters/getters for position, rotation, etc.
     *
     * @example
     * var node = new Node({
     *   size: {x:100, y:100, z:100},
     *   rotation: {x:30, y:20, z:25}
     * })
     */
    constructor(...args) {
      super(...args);
      this.isNode = true; // This was when using my `multiple()` implementation, we could call
      // specific constructors using specific arguments. But, we're using
      // class-factory style mixins for now, so we don't have control over the
      // specific arguments we can pass to the constructors, so we're just
      // using a single `options` parameter in all the constructors.
      //this.callSuperConstructor(Transformable, options)
      //this.callSuperConstructor(TreeNode)
      //this.callSuperConstructor(ImperativeBase)
      // `parent` can exist if this instance is in the DOM and being
      // upgraded.

      if (this.parent) {
        // if (this.isConnected) {
        this._calcSize();

        this.needsUpdate();
      }
    }

    updated(oldProps, modifiedProps) {
      super.updated(oldProps, modifiedProps);

      if (modifiedProps.visible) {
        console.log('                           visibility change', this.constructor.name, this._cssLoaded, this.visible);
        setTimeout(() => {
          console.log('                           visibility later', this.constructor.name, this._cssLoaded, this.visible);
        }, 1000);
        this._elementOperations.shouldRender = this._cssLoaded && this.visible;
        this.needsUpdate();
      }
    } // See ImperativeBase#add and ImperativeBase#remove.


    _onParentSizeChange() {
      // We only need to recalculate sizing and matrices if this node has
      // properties that depend on parent sizing (proportional size,
      // align, and mountPoint). mountPoint isn't obvious: if this node
      // is proportionally sized, then the mountPoint will depend on the
      // size of this element which depends on the size of this element's
      // parent. Align also depends on parent sizing.
      if (this._properties.sizeMode.x === 'proportional' || this._properties.sizeMode.y === 'proportional' || this._properties.sizeMode.z === 'proportional' || this._properties.align.x !== 0 || this._properties.align.y !== 0 || this._properties.align.z !== 0) {
        this._calcSize();

        this.needsUpdate();
      }
    }

    _loadCSS() {
      if (this._cssLoaded) return;
      console.log('                ----------------------------- LOAD NODE CSS');

      super._loadCSS();

      this.triggerUpdateForProp('visible');
    }

    _unloadCSS() {
      if (!this._cssLoaded) return;
      console.log('                ----------------------------- UNLOAD NODE CSS');

      super._unloadCSS();

      this.triggerUpdateForProp('visible');
    }

  }

  Node.defaultElementName = 'i-node';
  Node.props = _objectSpread({}, Parent.props || {}, {
    visible: _objectSpread({}, (0, _props.mapPropTo)(_props.props.boolean, self => self.three), {
      default: true
    })
  });
  return Node;
}

const _Node = (0, _lowclass.Mixin)(NodeMixin); // TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.


const Node = _Node.mixin(_HTMLNode.default);

exports.Node = Node;
var _default = Node; // const n: Node = new Node(1, 2, 3)
// n.asdfasdf
// n.calculatedSize = 123
// n.innerHTML = 123
// n.innerHTML = 'asdf'
// n.emit('asfasdf', 1, 2, 3)
// n.removeNode('asfasdf')
// n.updated(1, 2, 3, 4)
// n.blahblah
// n.sizeMode
// n._render(1, 2, 3)
// n.qwerqwer
// n.rotation
// n.three.sdf
// n.threeCSS.sdf
// n.possiblyLoadThree(new ImperativeBase!())
// n.possiblyLoadThree(1)
// n.visible = false
// n.visible = 123123

exports.default = _default;