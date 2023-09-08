import { Element3D, Element3DAttributes } from '../core/Element3D.js';
import type { ColladaModelBehavior, ColladaModelBehaviorAttributes } from '../behaviors/mesh-behaviors/models/ColladaModelBehavior.js';
export declare type ColladaModelAttributes = Element3DAttributes;
export declare class ColladaModel extends Element3D {
    static defaultBehaviors: string[];
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors } from '../index.js';
export interface ColladaModel extends ElementWithBehaviors<ColladaModelBehavior, ColladaModelBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-collada-model': ColladaModel;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-collada-model': JSX.IntrinsicElements['lume-element3d'] & ElementAttributes<ColladaModelBehavior, ColladaModelBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=ColladaModel.d.ts.map