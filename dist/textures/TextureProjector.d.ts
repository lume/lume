import { type ElementAttributes } from '@lume/element';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { Fitment } from '@lume/three-projected-material/dist/ProjectedMaterial.js';
import type { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
export type TextureProjectorAttributes = Element3DAttributes | 'src' | 'fitment';
/**
 * @class TextureProjector
 *
 * Element: `<lume-texture-projector>`
 *
 * An non-rendered plane that can be placed anywhere in 3D space to project a
 * texture onto mesh elements that have `projected-material` behaviors.
 *
 * For now only one `<lume-texture-projector>` can be associated to a mesh, and
 * only with an orthographic projection (perpendicular to the plane, i.e. along
 * the direction the plane is facing). Later on we'll support perspective
 * projection and multiple projections.
 *
 * To project a texture onto a mesh element, add a
 * [`projected-material`](../behaviors/mesh-behaviors/ProjectedMaterialBehavior)
 * behavior to the element using the `has=""` attribute, then assign an array of
 * `<lume-texture-projector>` elements, or a string of comma-separated CSS
 * selectors, to the element's `projectedTextures` property. The equivalent
 * dash-case attribute accepts only the string of selectors. Only the first
 * texture is used, for now.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = projectedTextureExample
 * </script>
 *
 * @extends Element3D
 */
export declare class TextureProjector extends Element3D {
    /**
     * @property {string} src
     *
     * `attribute`
     *
     * Default: `''`
     *
     * The path to an image to be used as a projected
     * texture.
     */
    src: string;
    /**
     * @property {'cover' | 'contain'} fitment
     *
     * `attribute`
     *
     * Default: `'cover'`
     *
     * Fitment of the image within the size area on X and Y. Similar to the CSS
     * object-fit property, but supporting only "cover" and "contain" fitments.
     */
    fitment: Fitment;
    frontFacesOnly: boolean;
    threeCamera: PerspectiveCamera | OrthographicCamera | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-texture-projector': ElementAttributes<TextureProjector, TextureProjectorAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-texture-projector': TextureProjector;
    }
}
//# sourceMappingURL=TextureProjector.d.ts.map