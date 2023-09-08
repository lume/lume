import { Element3D, Element3DAttributes } from '../core/Element3D.js';
import type { GltfModelBehavior, GltfModelBehaviorAttributes } from '../behaviors/mesh-behaviors/models/GltfModelBehavior.js';
export declare type GltfModelAttributes = Element3DAttributes;
export declare class GltfModel extends Element3D {
    static defaultBehaviors: string[];
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors } from '../index.js';
export interface GltfModel extends ElementWithBehaviors<GltfModelBehavior, GltfModelBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-gltf-model': GltfModel;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-gltf-model': JSX.IntrinsicElements['lume-element3d'] & ElementAttributes<GltfModelBehavior, GltfModelBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=GltfModel.d.ts.map