/*
 * Simple pool for 3-array vectors that only contain primitives.
 */

import SinglyLinkedList from './SinglyLinkedList';

// See SinglyLinkedList.js for more info on this pattern
let pool = SinglyLinkedList();
let Vec3 = function(x, y, z) {
  if (this instanceof Vec3) {
    // Array.call(this, x, y, z);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this.length = 3;
  } else {
    let vec3 = pool.shift();
    if (vec3) {
      vec3[0] = x;
      vec3[1] = y;
      vec3[2] = z;
      return vec3;
    }
    return new Vec3(x, y, z);
  }
};

Vec3.prototype = Object.create(Array.prototype);
Vec3.prototype.constructor = Vec3;

Vec3.prototype.recycle = function() {
  pool.push(this);
};

export default Vec3;