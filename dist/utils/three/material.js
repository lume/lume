import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { Color } from 'three/src/math/Color.js';
import { isRenderItem } from './is.js';
import { disposeMaterial } from './dispose.js';
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
//# sourceMappingURL=material.js.map