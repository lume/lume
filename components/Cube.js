"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cube = exports.default = void 0;

var _forLength = _interopRequireDefault(require("army-knife/forLength"));

var _Node = _interopRequireDefault(require("../core/Node"));

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

/**
 * A scenegraph tree that lays things out in a cube form.
 *
 * TODO: extend from i-mesh, using a Cube geometry? Or perhaps this is a
 * CubeLayout, not necessarily a Cube mesh.
 *
 * TODO: this is written imperatively. How would it be declaratively?
 *
 * @class Cube
 * @extends Node
 */
class Cube extends _Node.default {
  /**
   * Create a new Cube.
   *
   * @constructor
   * @param {Number} size The integer width of the cube.
   */
  constructor(size, options) {
    // cubes, the same size on all sides
    super(_objectSpread({
      size: [size, size, size]
    }, options));
    this.size = size;
    this.sides = []; //GenericSync.register({
    //mouse: MouseSync,
    //touch: TouchSync
    //});

    (0, _forLength.default)(6, n => this._createCubeSide(n));
  }
  /**
   * Creates the 6 sides of the cube (the leafnodes of the scenegraph).
   *
   * @private
   * @param {Number} index The index (a integer between 0 and 5) that specifies which side to create.
   */


  _createCubeSide(index) {
    const rotator = new _Node.default({
      align: [0.5, 0.5],
      mountPoint: [0.5, 0.5]
    });
    const side = new _Node.default({
      align: [0.5, 0.5],
      mountPoint: [0.5, 0.5],
      size: [this.size, this.size]
    });
    this.sides.push(side);
    rotator.add(side); // TODO: make a new GenericSync-like thing based on Famous?
    //const sync = new GenericSync(['mouse','touch']);
    //side.pipe(sync);
    //sync.pipe(this.options.handler);
    // rotate and place each side.

    if (index < 4) // 4 sides
      rotator.rotation.y = 90 * index; // top/bottom
    else rotator.rotation.x = 90 * (index % 2 ? -1 : 1);
    side.position.z = this.size / 2;
    this.add(rotator);
  }
  /**
   * Set the content for the sides of the cube.
   *
   * @param {Array} content An array containing [Node](#infamous/motor/Node)
   * instances to place in the cube sides. Only the first 6 items are used,
   * the rest are ignored.
   */


  setContent(content) {
    (0, _forLength.default)(6, index => {
      //this.cubeSideNodes[index].set(null); // TODO: how do we erase previous content?
      this.sides[index].add(content[index]);
    });
    return this;
  }

}

exports.Cube = exports.default = Cube;