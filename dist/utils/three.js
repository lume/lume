import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { Color } from 'three/src/math/Color.js';
export function isRenderItem(obj) {
    return 'geometry' in obj && 'material' in obj;
}
export function disposeMaterial(obj) {
    if (!isRenderItem(obj))
        return;
    // because obj.material can be a material or array of materials
    const materials = [].concat(obj.material);
    for (const material of materials) {
        material.dispose();
    }
}
export function disposeObject(obj, removeFromParent = true, destroyGeometry = true, destroyMaterial = true) {
    if (!obj)
        return;
    if (isRenderItem(obj)) {
        if (obj.geometry && destroyGeometry)
            obj.geometry.dispose();
        if (destroyMaterial)
            disposeMaterial(obj);
    }
    removeFromParent &&
        queueMicrotask(() => {
            // if we remove children in the same tick then we can't continue traversing,
            // so we defer to the next microtask
            obj.parent && obj.parent.remove(obj);
        });
}
export function disposeObjectTree(obj, disposeOptions = {}) {
    obj.traverse(node => {
        disposeObject(node, disposeOptions.removeFromParent, disposeOptions.destroyGeometry, disposeOptions.destroyMaterial);
    });
}
export function quaternionApproximateEquals(a, b, epsilon) {
    return (Math.abs(a.x - b.x) < epsilon &&
        Math.abs(a.y - b.y) < epsilon &&
        Math.abs(a.z - b.z) < epsilon &&
        Math.abs(a.w - b.w) < epsilon);
}
export function applyMaterial(obj, material, dispose = true) {
    if (!isRenderItem(obj))
        return;
    if (dispose && obj.material)
        disposeMaterial(obj);
    obj.material = material;
}
export function setRandomColorPhongMaterial(obj, dispose, traverse) {
    const randomColor = (0xffffff / 3) * Math.random() + 0xffffff / 3;
    setColorPhongMaterial(obj, randomColor, dispose, traverse);
}
export function setColorPhongMaterial(obj, color, dispose, traverse = true) {
    const material = new MeshPhongMaterial();
    material.color = new Color(color);
    if (traverse)
        obj.traverse(node => applyMaterial(node, material, dispose));
    else
        applyMaterial(obj, material, dispose);
}
export function isPerspectiveCamera(camera) {
    return !!camera.isPerspectiveCamera;
}
export function isOrthographicCamera(camera) {
    return !!camera.isOrthographicCamera;
}
export function isDisposable(o) {
    return !!(typeof o === 'object' && o && 'dispose' in o);
}
//# sourceMappingURL=three.js.map