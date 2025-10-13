var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { stringAttribute, element } from '@lume/element';
import { onCleanup, createEffect } from 'solid-js';
import { signal } from 'classy-solid';
import { ProjectedMaterial } from '@lume/three-projected-material/dist/ProjectedMaterial.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Texture } from 'three/src/textures/Texture.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
import { TextureProjector } from '../../textures/TextureProjector.js';
import { upwardRoots } from '../../utils/upwardRoots.js';
import { querySelectorUpward } from '../../utils/querySelectorUpward.js';
import { autoDefineElements } from '../../LumeConfig.js';
/**
 * @class ProjectedMaterialBehavior
 *
 * Element: `projected-material`
 *
 * A physical material with the added ability to have additional textures
 * projected onto it with
 * [`<lume-texture-projector>`](../../../textures/TextureProjector) elements.
 *
 * Project a texture onto a mesh using a `<lume-texture-projector>` and
 * this projected material on the mesh, with the texture being projected with a
 * camera-like mechanism. This is useful for displaying things on surfaces like
 * projected TV content or projector content.
 *
 * The `textureProjectors` attribute is used to point to one or more texture
 * projectors. The value is a selector string using the same query syntax as
 * [`document.querySelectorAll()`](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll#Syntax).
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = projectedMaterialExample
 * </script>
 *
 * @extends PhysicalMaterialBehavior
 * @element projected-material
 */
let ProjectedMaterialBehavior = (() => {
    let _classDecorators = [element('projected-material', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = PhysicalMaterialBehavior;
    let _instanceExtraInitializers = [];
    let _textureProjectorsFromSelector_decorators;
    let _textureProjectorsFromSelector_initializers = [];
    let _textureProjectorsFromSelector_extraInitializers = [];
    let _get_textureProjectors_decorators;
    let _set_textureProjectors_decorators;
    let _get_projectedTextures_decorators;
    let _set_projectedTextures_decorators;
    var ProjectedMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _textureProjectorsFromSelector_decorators = [signal];
            _get_textureProjectors_decorators = [stringAttribute];
            _set_textureProjectors_decorators = [stringAttribute];
            _get_projectedTextures_decorators = [stringAttribute];
            _set_projectedTextures_decorators = [stringAttribute];
            __esDecorate(this, null, _get_textureProjectors_decorators, { kind: "getter", name: "textureProjectors", static: false, private: false, access: { has: obj => "textureProjectors" in obj, get: obj => obj.textureProjectors }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_textureProjectors_decorators, { kind: "setter", name: "textureProjectors", static: false, private: false, access: { has: obj => "textureProjectors" in obj, set: (obj, value) => { obj.textureProjectors = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_projectedTextures_decorators, { kind: "getter", name: "projectedTextures", static: false, private: false, access: { has: obj => "projectedTextures" in obj, get: obj => obj.projectedTextures }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_projectedTextures_decorators, { kind: "setter", name: "projectedTextures", static: false, private: false, access: { has: obj => "projectedTextures" in obj, set: (obj, value) => { obj.projectedTextures = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _textureProjectorsFromSelector_decorators, { kind: "field", name: "textureProjectorsFromSelector", static: false, private: false, access: { has: obj => "textureProjectorsFromSelector" in obj, get: obj => obj.textureProjectorsFromSelector, set: (obj, value) => { obj.textureProjectorsFromSelector = value; } }, metadata: _metadata }, _textureProjectorsFromSelector_initializers, _textureProjectorsFromSelector_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ProjectedMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #textureProjectorsRaw = (__runInitializers(this, _instanceExtraInitializers), '');
        /** The currently-found texture projector element(s). */
        textureProjectorsFromSelector = __runInitializers(this, _textureProjectorsFromSelector_initializers, []
        /**
         * @property {string | TextureProjector[]} textureProjectors - A CSS selector
         * that points to one or more `<lume-texture-projector>` elements to use for
         * texture projection on this material. If a CSS selector matches an element
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
        );
        /**
         * @property {string | TextureProjector[]} textureProjectors - A CSS selector
         * that points to one or more `<lume-texture-projector>` elements to use for
         * texture projection on this material. If a CSS selector matches an element
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
        #observer = (__runInitializers(this, _textureProjectorsFromSelector_extraInitializers), null);
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
            for (const root of upwardRoots(this.parentElement))
                this.#observer.observe(root, { childList: true, subtree: true });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                const three = this.parentElement.three;
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
                    // Make sure selectors are not empty before we process them.
                    array = array.filter(selector => selector && selector.toString().trim());
                    let newProjectors = [];
                    for (let i = 0; i < array.length; i += 1) {
                        const item = array[i];
                        if (typeof item === 'string') {
                            const projectors = this.parentElement.scene.querySelectorAll(item);
                            for (const projector of projectors) {
                                if (!(projector instanceof TextureProjector))
                                    continue;
                                newProjectors.push(projector);
                            }
                        }
                        else if (item instanceof TextureProjector) {
                            newProjectors.push(item);
                        }
                    }
                    this.textureProjectorsFromSelector = newProjectors;
                });
            });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                const projectors = this.textureProjectorsFromSelector;
                onCleanup(() => mat.dispose());
                // For now, only the first projector.
                const projector = projectors[0];
                if (!projector)
                    return;
                mat.project(projector.three, projector.camera.three.matrixWorldInverse, projector.camera.three.projectionMatrix);
                this.parentElement.needsUpdate();
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
//# sourceMappingURL=ProjectedMaterialBehavior.js.map