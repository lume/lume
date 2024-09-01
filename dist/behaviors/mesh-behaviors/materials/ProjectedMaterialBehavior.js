var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import 'element-behaviors';
import { stringAttribute } from '@lume/element';
import { onCleanup, createEffect, createMemo } from 'solid-js';
import { signal } from 'classy-solid';
import { ProjectedMaterial } from '@lume/three-projected-material/dist/ProjectedMaterial.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Texture } from 'three/src/textures/Texture.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
import { TextureProjector } from '../../../textures/TextureProjector.js';
import { upwardRoots } from '../../../utils/upwardRoots.js';
import { querySelectorUpward } from '../../../utils/querySelectorUpward.js';
import { createArrayMemo } from '../../../utils/createArrayMemo.js';
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
 * @extends PhysicalMaterialBehavior
 */
let ProjectedMaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = PhysicalMaterialBehavior;
    let _instanceExtraInitializers = [];
    let ___associatedProjectors_decorators;
    let ___associatedProjectors_initializers = [];
    let _get_textureProjectors_decorators;
    let _get_projectedTextures_decorators;
    var ProjectedMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            ___associatedProjectors_decorators = [signal];
            _get_textureProjectors_decorators = [stringAttribute, receiver];
            _get_projectedTextures_decorators = [stringAttribute, receiver];
            __esDecorate(this, null, _get_textureProjectors_decorators, { kind: "getter", name: "textureProjectors", static: false, private: false, access: { has: obj => "textureProjectors" in obj, get: obj => obj.textureProjectors }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_projectedTextures_decorators, { kind: "getter", name: "projectedTextures", static: false, private: false, access: { has: obj => "projectedTextures" in obj, get: obj => obj.projectedTextures }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, ___associatedProjectors_decorators, { kind: "field", name: "__associatedProjectors", static: false, private: false, access: { has: obj => "__associatedProjectors" in obj, get: obj => obj.__associatedProjectors, set: (obj, value) => { obj.__associatedProjectors = value; } }, metadata: _metadata }, ___associatedProjectors_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ProjectedMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** The computed value after the user sets this.textureProjectors. F.e. any strings are queried from DOM, and this array contains only DOM element references. */
        __associatedProjectors = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, ___associatedProjectors_initializers, []
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
        ));
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
        get associatedProjectors() {
            return this.__associatedProjectors;
        }
        /** The raw value the user set on this.textureProjectors */
        #textureProjectorsRaw = [];
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
        get textureProjectors() {
            return this.#textureProjectorsRaw;
        }
        set textureProjectors(value) {
            this.#textureProjectorsRaw = value;
        }
        /**
         * @deprecated
         * @property {string | Array<TextureProjector | string | null>} projectedTextures
         *
         * `string attribute`
         *
         * *deprecated*: renamed to [`.textureProjectors`](#textureprojectors).
         */
        get projectedTextures() {
            return this.textureProjectors;
        }
        set projectedTextures(value) {
            this.textureProjectors = value;
        }
        _createComponent() {
            // TODO multiple projected textures.
            // Only one projected texture for now. Handling a material array is
            // needed for multiple projections, unless we update ProjectedMaterial
            // to supported multiple textures/cameras so that we can have a single
            // material. Probably the mat.project and mat.updateFromCamera methods
            // should accept a camera from the outside rather than using one that is
            // contained in the material.
            return new ProjectedMaterial();
        }
        #observer = null;
        connectedCallback() {
            super.connectedCallback();
            let queuedRequery = false;
            this.#observer = new MutationObserver(() => {
                if (queuedRequery)
                    return;
                queuedRequery = true;
                // Use a timeout for batching so this doesn't run a ton of times during DOM parsing.
                setTimeout(() => {
                    queuedRequery = false;
                    // TODO this could be more efficient if we check the added nodes directly, but for now we re-run the query logic.
                    // This triggers the setter logic.
                    this.textureProjectors = this.#textureProjectorsRaw;
                }, 0);
            });
            // TODO This queries in upward roots only. I think we want to also branch downward into sibling roots.
            for (const root of upwardRoots(this.element))
                this.#observer.observe(root, { childList: true, subtree: true });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                const three = this.element.three;
                if (three.material !== mat)
                    return;
                createEffect(() => {
                    this.textureProjectors;
                    let array = [];
                    if (typeof this.#textureProjectorsRaw === 'string') {
                        array = [this.#textureProjectorsRaw.trim()];
                    }
                    else if (Array.isArray(this.#textureProjectorsRaw)) {
                        array = this.#textureProjectorsRaw;
                    }
                    else {
                        throw new TypeError('Invalid value for textureProjectors');
                    }
                    const projectors = [];
                    for (const value of array) {
                        if (typeof value !== 'string') {
                            // Consider only elements that participate in rendering (i.e. that are in the composed tree)
                            if (value.scene && value instanceof TextureProjector)
                                projectors.push(value);
                            continue;
                        }
                        else if (!value) {
                            // skip empty strings, they cause an error with querySelectorAll
                            continue;
                        }
                        // TODO Should we not search up the composed tree, and stay only
                        // in the current ShadowRoot?
                        for (const el of querySelectorUpward(this.element, value)) {
                            if (!el)
                                continue;
                            // Consider only elements that participate in rendering (i.e. that are in the composed tree)
                            if (el.scene && el instanceof TextureProjector)
                                projectors.push(el);
                            // TODO If an element was not yet upgraded, it will not
                            // be found here. We could wait for upgrade.
                        }
                    }
                    this.__associatedProjectors = projectors; // trigger
                });
                const associatedProjectors = createArrayMemo(() => this.__associatedProjectors);
                // For now we use only the first projector. No support for multiple projectors yet.
                const projector = createMemo(() => associatedProjectors()[0]);
                const projectorSrc = createMemo(() => projector()?.src ?? '');
                this._handleTexture(projectorSrc, (mat, tex) => (mat.texture = tex || new Texture()), mat => !!mat.texture, () => { }, true);
                createEffect(() => {
                    const tex = projector();
                    if (!tex)
                        return;
                    createEffect(() => {
                        mat.fitment = tex.fitment;
                        mat.frontFacesOnly = tex.frontFacesOnly;
                        this.element.needsUpdate();
                    });
                });
                createEffect(() => {
                    const tex = projector();
                    if (!tex)
                        return;
                    // if the camera changes
                    const cam = tex._camera;
                    if (!cam)
                        return;
                    if (three.material !== mat)
                        return;
                    mat.camera = cam;
                    mat.updateFromCamera();
                    mat.project(three, false);
                    this.element.needsUpdate();
                    // Do we need this?
                    onCleanup(() => {
                        const mat = this.meshComponent;
                        // If the whole behavior was cleaned up, mat will be undefined
                        // here due to #disposeMeshComponent in the base class onCleanup
                        if (!mat)
                            return;
                        if (three.material !== mat)
                            return;
                        mat.camera = new OrthographicCamera(0.00000001, 0.00000001, 0.00000001, 0.00000001);
                        mat.updateFromCamera();
                        mat.project(three, false);
                        this.element.needsUpdate();
                    });
                });
                createEffect(() => {
                    const tex = projector();
                    if (!tex)
                        return;
                    createEffect(() => {
                        tex.calculatedSize; // dependency
                        mat.updateFromCamera(); // needed because the size of the texture projector affects the camera projection
                        this.element.needsUpdate();
                    });
                });
                createEffect(() => {
                    if (three.material !== mat)
                        return;
                    // triggered when this.element has its world matrix updated.
                    this.element.version;
                    mat.project(three, false);
                });
                createEffect(() => {
                    const tex = projector();
                    if (!tex)
                        return;
                    createEffect(() => {
                        if (three.material !== mat)
                            return;
                        // triggered when tex has its world matrix updated, which
                        // transforms the camera we use for texture projection.
                        tex.version;
                        mat.project(three, false);
                        this.element.needsUpdate(); // The texture element updated, so make sure this.element does too.
                    });
                });
            });
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.#observer?.disconnect();
            this.#observer = null;
        }
    };
    return ProjectedMaterialBehavior = _classThis;
})();
export { ProjectedMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('projected-material'))
    elementBehaviors.define('projected-material', ProjectedMaterialBehavior);
//# sourceMappingURL=ProjectedMaterialBehavior.js.map