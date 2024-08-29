import { Color } from 'three/src/math/Color.js';
import type { Object3D } from 'three/src/core/Object3D.js';
import type { Material } from 'three/src/materials/Material.js';
export type TColor = Color | string | number;
export declare function applyMaterial(obj: Object3D, material: Material, dispose?: boolean): void;
export declare function setRandomColorPhongMaterial(obj: Object3D, dispose?: boolean, traverse?: boolean): void;
export declare function setColorPhongMaterial(obj: Object3D, color: TColor, dispose?: boolean, traverse?: boolean): void;
//# sourceMappingURL=material.d.ts.map