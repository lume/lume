import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { TdsModelBehavior, TdsModelBehaviorAttributes } from '../behaviors/mesh-behaviors/models/TdsModelBehavior.js';
export type TdsModelAttributes = Element3DAttributes;
export declare class TdsModel extends Element3D {
    static defaultBehaviors: string[];
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors } from '../index.js';
export interface TdsModel extends ElementWithBehaviors<TdsModelBehavior, TdsModelBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-3ds-model': TdsModel;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-3ds-model': JSX.IntrinsicElements['lume-element3d'] & ElementAttributes<TdsModelBehavior, TdsModelBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=TdsModel.d.ts.map