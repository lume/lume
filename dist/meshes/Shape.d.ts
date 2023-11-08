import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
export type ShapeAttributes = MeshAttributes;
export declare class Shape extends Mesh {
    static defaultBehaviors: {
        'shape-geometry': (initialBehaviors: any) => boolean;
        'phong-material': (initialBehaviors: any) => boolean;
    };
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors, ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes } from '../index.js';
export interface Shape extends ElementWithBehaviors<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-shape': Shape;
    }
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-shape': JSX.IntrinsicElements['lume-mesh'] & ElementAttributes<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=Shape.d.ts.map