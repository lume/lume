import { Element3D, Element3DAttributes } from '../core/Element3D.js';
import type { FbxModelBehavior, FbxModelBehaviorAttributes } from '../behaviors/mesh-behaviors/models/FbxModelBehavior.js';
export declare type FbxModelAttributes = Element3DAttributes;
export declare class FbxModel extends Element3D {
    static defaultBehaviors: string[];
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors } from '../index.js';
export interface FbxModel extends ElementWithBehaviors<FbxModelBehavior, FbxModelBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-fbx-model': FbxModel;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-fbx-model': JSX.IntrinsicElements['lume-element3d'] & ElementAttributes<FbxModelBehavior, FbxModelBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=FbxModel.d.ts.map