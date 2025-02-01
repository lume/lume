import { isRenderItem } from './is.js';
export function isDisposable(o) {
    return !!(typeof o === 'object' && o && 'dispose' in o);
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
//# sourceMappingURL=dispose.js.map