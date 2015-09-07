/*
 * Simple pool for 3-array vectors that only contain primitives.
 */

import SinglyLinkedList from './SinglyLinkedList';

// See SinglyLinkedList.js for more info on this pattern
var vec3pool = SinglyLinkedList();
var Vec3 = function(x, y, z) {
  if (this instanceof Vec3) {
    Array.call(this, x, y, z);
  } else {
    var vec3 = vec3pool.shiftElement();
    if (vec3) {
      vec3[0] = x;
      vec3[1] = y;
      vec3[2] = z;
    }
    return vec3 && node.init(options) || [x, y, z];
  }
};

Vec3.prototype = Object.create(Array.prototype);
Vec3.prototype.constructor = Vec3;

Vec3.prototype.recycle = function() {
  vec3pool.push(this);
};

export default Vec3;