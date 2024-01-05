import { type ElementAttributes } from '@lume/element';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
export type CubeLayoutAttributes = Element3DAttributes;
/**
 * @extends Element3D
 * @class CubeLayout -
 *
 * Element: `<lume-cube-layout>`
 *
 * A layout in which layout slots are six sides of a cube, facing outwards.
 *
 * Slots:
 *
 * - `front` - The front face of the cube layout.
 * - `back` - The back face of the cube layout.
 * - `left` - The left face of the cube layout.
 * - `right` - The right face of the cube layout.
 * - `top` - The top face of the cube layout.
 * - `bottom` - The bottom face of the cube layout.
 * - Default: The default slot is a catch-all for all other children, so they behave the same as children of a node without a shadow tree.
 */
export declare class CubeLayout extends Element3D {
    #private;
    readonly hasShadow = true;
    connectedCallback(): void;
    /**
     * @method setContent - As an imperative alternative to slotting, an array
     * of 6 children (any more are ignored) can be passed in to make them
     * children of the 6 sides of the cube layout. The order in which they are
     * added is front, right, back, left, top, bottom. Note, it can be easier to
     * assign nodes to slots by name, without worrying about their order.
     * @param {Array<Element3D>} content - An array containing [Node](../core/Node)
     * instances to place in the cube sides. Only the first 6 items are used,
     * the rest are ignored.
     * @returns {this}
     */
    setContent(content: Element3D[]): this;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-cube-layout': ElementAttributes<CubeLayout, CubeLayoutAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-cube-layout': CubeLayout;
    }
}
//# sourceMappingURL=CubeLayout.d.ts.map