import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { ObjModelBehavior, ObjModelBehaviorAttributes } from '../behaviors/mesh-behaviors/models/ObjModelBehavior.js';
export type ObjModelAttributes = Element3DAttributes;
export declare class ObjModel extends Element3D {
    static defaultBehaviors: string[];
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors } from '../index.js';
export interface ObjModel extends ElementWithBehaviors<ObjModelBehavior, ObjModelBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-obj-model': ObjModel;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-obj-model': JSX.IntrinsicElements['lume-element3d'] & ElementAttributes<ObjModelBehavior, ObjModelBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=ObjModel.d.ts.map