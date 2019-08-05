"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRenderItem = isRenderItem;
exports.disposeMaterial = disposeMaterial;
exports.disposeObject = disposeObject;
exports.disposeObjectTree = disposeObjectTree;
exports.quaternionApproximateEquals = quaternionApproximateEquals;
exports.applyMaterial = applyMaterial;
exports.setRandomColorPhongMaterial = setRandomColorPhongMaterial;
exports.setColorPhongMaterial = setColorPhongMaterial;
exports.isPerspectiveCamera = isPerspectiveCamera;
exports.isOrthographicCamera = isOrthographicCamera;

var _three = require("three");

function isRenderItem(obj) {
  return 'geometry' in obj && 'material' in obj;
}

function disposeMaterial(obj) {
  if (!isRenderItem(obj)) return; // because obj.material can be a material or array of materials

  const materials = [].concat(obj.material);

  for (const material of materials) {
    material.dispose();
  }
}

function disposeObject(obj, removeFromParent = true, destroyGeometry = true, destroyMaterial = true) {
  if (!obj) return;

  if (isRenderItem(obj)) {
    if (destroyGeometry) obj.geometry.dispose();
    if (destroyMaterial) disposeMaterial(obj);
  }

  removeFromParent && Promise.resolve().then(() => {
    // if we remove children in the same tick then we can't continue traversing,
    // so we defer to the next microtask
    obj.parent && obj.parent.remove(obj);
  });
}

function disposeObjectTree(obj, disposeOptions = {}) {
  obj.traverse(node => {
    disposeObject(node, disposeOptions.removeFromParent, disposeOptions.destroyGeometry, disposeOptions.destroyMaterial);
  });
}

function quaternionApproximateEquals(a, b, epsilon) {
  return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon && Math.abs(a.z - b.z) < epsilon && Math.abs(a.w - b.w) < epsilon;
}

function applyMaterial(obj, material, dispose = true) {
  if (!isRenderItem(obj)) return;
  if (dispose && obj.material) disposeMaterial(obj);
  obj.material = material;
}

function setRandomColorPhongMaterial(obj, dispose, traverse) {
  const randomColor = 0xffffff / 3 * Math.random() + 0xffffff / 3;
  setColorPhongMaterial(obj, randomColor, dispose, traverse);
}

function setColorPhongMaterial(obj, color, dispose, traverse = true) {
  const material = new _three.MeshPhongMaterial();
  material.color = new _three.Color(color);
  if (traverse) obj.traverse(node => applyMaterial(node, material, dispose));else applyMaterial(obj, material, dispose);
}

function isPerspectiveCamera(camera) {
  return !!camera.isPerspectiveCamera;
}

function isOrthographicCamera(camera) {
  return !!camera.isOrthographicCamera;
}