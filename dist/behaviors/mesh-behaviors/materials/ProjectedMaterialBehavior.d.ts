import 'element-behaviors';
import { ProjectedMaterial } from '@lume/three-projected-material/dist/ProjectedMaterial.js';
import { PhysicalMaterialBehavior, type PhysicalMaterialBehaviorAttributes } from './PhysicalMaterialBehavior.js';
import { TextureProjector } from '../../../textures/TextureProjector.js';
export type ProjectedMaterialBehaviorAttributes = PhysicalMaterialBehaviorAttributes | 'textureProjectors' | 'projectedTextures';
/**
 * @class ProjectedMaterialBehavior
 *
 * Behavior: `projected-material`
 *
 * A physical material with the added ability to have additional textures
 * projected onto it with
 * [`<lume-texture-projector>`](../../../textures/TextureProjector) elements.
 *
 * Project a texture onto a mesh using a `<lume-texture-projector>` and
 * associating it with the `texture-projectors` attribute:
 *
 * ```html
 * <!-- Define a texture projector somewhere. -->
 * <lume-texture-projector src="path/to/image.jpg" class="some-projector"></lume-texture-projector>
 *
 * <!-- Use the projected-material on the mesh, and associate it with the projector: -->
 * <lume-box
 *   has="projected-material"
 *   size="100 100 100"
 *   texture-projectors=".some-projector"
 * ></lume-box>
 * ```
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = projectedTextureExample
 * </script>
 *
 * @extends PhysicalMaterialBehavior
 */
export declare class ProjectedMaterialBehavior extends PhysicalMaterialBehavior {
    #private;
    /**
     * @property {Array<TextureProjector>} associatedProjectors
     *
     * `readonly` `signal`
     *
     * The list of `TextureProjector` elements that are projecting onto the
     * current owner element, normalized from
     * [`.textureProjectors`](#textureprojectors) with selectors queried and
     * null values ignored.
     *
     * This returns the currently associated array of `<lume-texture-projector>`
     * instances, not the original string or array of values passed to
     * [`.textureProjectors`](#textureprojectors).
     */
    get associatedProjectors(): TextureProjector[];
    /**
     * @property {string | Array<TextureProjector | string | null>} textureProjectors
     *
     * `string attribute`
     *
     * Default: `[]`
     *
     * The `texture-projectors` attribute accepts one or more selectors, comma
     * separated, that define which
     * [`<lume-texture-projector>`](../../core/TextureProjector) elements are to
     * project an image onto the owner element. If a selector matches an element
     * that is not a `<lume-texture-projector>`, it is ignored (note that
     * non-upgraded elements will not be detected, make sure to load element
     * definitions up front which is the default if you're simply importing
     * `lume`).
     * If a selector matches
     * more than one element, only the first `<lume-texture-projector>` will be used
     * (in the near future we will allow multiple projectors to project).
     *
     * ```html
     * <lume-box has="projected-material" texture-projectors=".foo, .bar, #baz"></lume-box>
     * ```
     *
     * The `textureProjectors` JS property can be set with a string of comma
     * separated selectors, or a mixed array of strings (selectors) or
     * `<lume-texture-projector>` element instances, making the JS property more
     * flexible for scenarios where selectors are not enough (f.e. maybe you
     * need to get a reference to an element from some other part of the DOM,
     * perhaps from a tree inside a ShadowRoot, or you are programmatically
     * creating elements, etc).
     *
     * ```js
     * el.textureProjectors = ".some-texture-projector"
     * // or
     * const projector = document.querySelector('.some-texture-projector')
     * el.textureProjectors = [projector, "#someOtherTextureProjector"]
     * ```
     *
     * Texture projectors that are not in the composed tree (i.e. not
     * participating in rendering) will be ignored.  The texture projectors that
     * will be associated are those that are connected into the document, and
     * that participate in rendering (i.e.  composed, either in the top level
     * document, in a ShadowRoot, or distributed to a slot in a ShadowRoot).
     * This is the same as with the browser's built-in elements: a `<div>`
     * element that is connected into the DOM but not slotted to its parent's
     * `.shadowRoot` will not participate in the visual output.
     */
    get textureProjectors(): string | Array<TextureProjector | string>;
    set textureProjectors(value: string | Array<TextureProjector | string>);
    /**
     * @deprecated
     * @property {string | Array<TextureProjector | string | null>} projectedTextures
     *
     * `string attribute`
     *
     * *deprecated*: renamed to [`.textureProjectors`](#textureprojectors).
     */
    get projectedTextures(): string | (string | TextureProjector)[];
    set projectedTextures(value: string | (string | TextureProjector)[]);
    _createComponent(): ProjectedMaterial;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=ProjectedMaterialBehavior.d.ts.map