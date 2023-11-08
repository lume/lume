import { Mesh, type MeshAttributes } from './Mesh.js';
export type RoundedRectangleAttributes = MeshAttributes;
export declare class RoundedRectangle extends Mesh {
    static defaultBehaviors: {
        'rounded-rectangle-geometry': (initialBehaviors: any) => boolean;
        'phong-material': (initialBehaviors: any) => boolean;
    };
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors, RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes } from '../index.js';
export interface RoundedRectangle extends ElementWithBehaviors<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-rounded-rectangle': RoundedRectangle;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-rounded-rectangle': JSX.IntrinsicElements['lume-mesh'] & ElementAttributes<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=RoundedRectangle.d.ts.map