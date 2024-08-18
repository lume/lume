// TODO material arrays are not handled. Any LUME elements have one material. If
// a user makes a subclass or provides a custom three object with a material
// array, we set properties onto each material, assuming they're all the same
// type. Perhaps we need an HTML syntax for multiple materials on an element.
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
import { createMemo, onCleanup } from 'solid-js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { Color } from 'three/src/math/Color.js';
import { DoubleSide, FrontSide, BackSide, SRGBColorSpace } from 'three/src/constants.js';
import { Material } from 'three/src/materials/Material.js';
import { booleanAttribute, stringAttribute, numberAttribute } from '@lume/element';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { GeometryOrMaterialBehavior } from '../GeometryOrMaterialBehavior.js';
/**
 * @class MaterialBehavior -
 *
 * Base class for material behaviors.
 *
 * @extends GeometryOrMaterialBehavior
 */
let MaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = GeometryOrMaterialBehavior;
    let _instanceExtraInitializers = [];
    let _alphaTest_decorators;
    let _alphaTest_initializers = [];
    let _colorWrite_decorators;
    let _colorWrite_initializers = [];
    let _depthTest_decorators;
    let _depthTest_initializers = [];
    let _depthWrite_decorators;
    let _depthWrite_initializers = [];
    let _dithering_decorators;
    let _dithering_initializers = [];
    let _fog_decorators;
    let _fog_initializers = [];
    let _wireframe_decorators;
    let _wireframe_initializers = [];
    let _sidedness_decorators;
    let _sidedness_initializers = [];
    let _materialOpacity_decorators;
    let _materialOpacity_initializers = [];
    let _get_color_decorators;
    var MaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _alphaTest_decorators = [numberAttribute, receiver];
            _colorWrite_decorators = [booleanAttribute, receiver];
            _depthTest_decorators = [booleanAttribute, receiver];
            _depthWrite_decorators = [booleanAttribute, receiver];
            _dithering_decorators = [booleanAttribute, receiver];
            _fog_decorators = [booleanAttribute, receiver];
            _wireframe_decorators = [booleanAttribute, receiver];
            _sidedness_decorators = [stringAttribute, receiver];
            _materialOpacity_decorators = [numberAttribute, receiver];
            _get_color_decorators = [stringAttribute, receiver];
            __esDecorate(this, null, _get_color_decorators, { kind: "getter", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _alphaTest_decorators, { kind: "field", name: "alphaTest", static: false, private: false, access: { has: obj => "alphaTest" in obj, get: obj => obj.alphaTest, set: (obj, value) => { obj.alphaTest = value; } }, metadata: _metadata }, _alphaTest_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _colorWrite_decorators, { kind: "field", name: "colorWrite", static: false, private: false, access: { has: obj => "colorWrite" in obj, get: obj => obj.colorWrite, set: (obj, value) => { obj.colorWrite = value; } }, metadata: _metadata }, _colorWrite_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _depthTest_decorators, { kind: "field", name: "depthTest", static: false, private: false, access: { has: obj => "depthTest" in obj, get: obj => obj.depthTest, set: (obj, value) => { obj.depthTest = value; } }, metadata: _metadata }, _depthTest_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _depthWrite_decorators, { kind: "field", name: "depthWrite", static: false, private: false, access: { has: obj => "depthWrite" in obj, get: obj => obj.depthWrite, set: (obj, value) => { obj.depthWrite = value; } }, metadata: _metadata }, _depthWrite_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _dithering_decorators, { kind: "field", name: "dithering", static: false, private: false, access: { has: obj => "dithering" in obj, get: obj => obj.dithering, set: (obj, value) => { obj.dithering = value; } }, metadata: _metadata }, _dithering_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fog_decorators, { kind: "field", name: "fog", static: false, private: false, access: { has: obj => "fog" in obj, get: obj => obj.fog, set: (obj, value) => { obj.fog = value; } }, metadata: _metadata }, _fog_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _wireframe_decorators, { kind: "field", name: "wireframe", static: false, private: false, access: { has: obj => "wireframe" in obj, get: obj => obj.wireframe, set: (obj, value) => { obj.wireframe = value; } }, metadata: _metadata }, _wireframe_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _sidedness_decorators, { kind: "field", name: "sidedness", static: false, private: false, access: { has: obj => "sidedness" in obj, get: obj => obj.sidedness, set: (obj, value) => { obj.sidedness = value; } }, metadata: _metadata }, _sidedness_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _materialOpacity_decorators, { kind: "field", name: "materialOpacity", static: false, private: false, access: { has: obj => "materialOpacity" in obj, get: obj => obj.materialOpacity, set: (obj, value) => { obj.materialOpacity = value; } }, metadata: _metadata }, _materialOpacity_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        type = (__runInitializers(this, _instanceExtraInitializers), 'material');
        /**
         * @property {number} alphaTest -
         *
         * `attribute`
         *
         * Default: `0`
         *
         * Sets the alpha value to be used when running an alpha test. The material
         * will not be rendered if the opacity is lower than this value.
         */
        alphaTest = __runInitializers(this, _alphaTest_initializers, 0
        // located in ClipPlanesBehavior instead
        // @booleanAttribute @receiver clipIntersection = false
        // @booleanAttribute @receiver clipShadows = true
        /**
         * @property {boolean} colorWrite -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether to render the material's color. This can be used in conjunction
         * with a mesh's renderOrder property to create invisible objects that
         * occlude other objects.
         */
        );
        // located in ClipPlanesBehavior instead
        // @booleanAttribute @receiver clipIntersection = false
        // @booleanAttribute @receiver clipShadows = true
        /**
         * @property {boolean} colorWrite -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether to render the material's color. This can be used in conjunction
         * with a mesh's renderOrder property to create invisible objects that
         * occlude other objects.
         */
        colorWrite = __runInitializers(this, _colorWrite_initializers, true
        // defines
        // depthFunc
        /**
         * @property {boolean} depthTest -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether to have depth test enabled when rendering this material.
         */
        );
        // defines
        // depthFunc
        /**
         * @property {boolean} depthTest -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether to have depth test enabled when rendering this material.
         */
        depthTest = __runInitializers(this, _depthTest_initializers, true
        /**
         * @property {boolean} depthWrite -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether rendering this material has any effect on the depth buffer.
         *
         * When drawing 2D overlays it can be useful to disable the depth writing in
         * order to layer several things together without creating z-index
         * artifacts.
         */
        );
        /**
         * @property {boolean} depthWrite -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether rendering this material has any effect on the depth buffer.
         *
         * When drawing 2D overlays it can be useful to disable the depth writing in
         * order to layer several things together without creating z-index
         * artifacts.
         */
        depthWrite = __runInitializers(this, _depthWrite_initializers, true
        /**
         * @property {boolean} dithering -
         *
         * `attribute`
         *
         * Default: `false`
         *
         * Whether to apply dithering to the color to remove the appearance of
         * banding.
         */
        );
        /**
         * @property {boolean} dithering -
         *
         * `attribute`
         *
         * Default: `false`
         *
         * Whether to apply dithering to the color to remove the appearance of
         * banding.
         */
        dithering = __runInitializers(this, _dithering_initializers, false
        /**
         * @property {boolean} fog -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether the material is affected by a [scene's fog](../../../core/Scene#fogMode).
         */
        );
        /**
         * @property {boolean} fog -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * Whether the material is affected by a [scene's fog](../../../core/Scene#fogMode).
         */
        fog = __runInitializers(this, _fog_initializers, true
        // TODO wireframe works with -geometry behaviors, but not with obj-model
        // because obj-model doesn't inherit from geometry. We should share common
        // props like wireframe...
        /**
         * @property {boolean} wireframe -
         *
         * `attribute`
         *
         * Default: `false`
         *
         * Whether to render geometry as wireframe, i.e. outlines of polygons. The
         * default of `false` renders geometries as smooth shaded.
         */
        );
        // TODO wireframe works with -geometry behaviors, but not with obj-model
        // because obj-model doesn't inherit from geometry. We should share common
        // props like wireframe...
        /**
         * @property {boolean} wireframe -
         *
         * `attribute`
         *
         * Default: `false`
         *
         * Whether to render geometry as wireframe, i.e. outlines of polygons. The
         * default of `false` renders geometries as smooth shaded.
         */
        wireframe = __runInitializers(this, _wireframe_initializers, false
        /**
         * @property {'front' | 'back' | 'double'} sidedness -
         *
         * `attribute`
         *
         * Default: `"front"`
         *
         * Whether to render one side or the other, or both sides, of any polygons
         * in the geometry. If the side that isn't rendered is facing towards the
         * camera, the polygon will be invisible. Use "both" if you want the
         * polygons to always be visible no matter which side faces the camera.
         */
        );
        /**
         * @property {'front' | 'back' | 'double'} sidedness -
         *
         * `attribute`
         *
         * Default: `"front"`
         *
         * Whether to render one side or the other, or both sides, of any polygons
         * in the geometry. If the side that isn't rendered is facing towards the
         * camera, the polygon will be invisible. Use "both" if you want the
         * polygons to always be visible no matter which side faces the camera.
         */
        sidedness = __runInitializers(this, _sidedness_initializers, 'front'
        /**
         * @property {number} materialOpacity -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * Opacity of the material only.
         *
         * The value should be a number from 0 to 1, inclusive. 0 is fully transparent, and 1
         * is fully opaque.
         *
         * This is in addition to an element's
         * [`opacity`](../../../core/SharedAPI#opacity), both are multiplied
         * together. As an example, if this material's element's `opacity` is `0.5`,
         * and this material's `materialOpacity` is `0.5`, then the overall opacity
         * of the material will be 0.25 when rendered.
         *
         * This modifies the material's opacity without affecting CSS rendering,
         * whereas modifying an element's `opacity` affects CSS rendering including
         * the element's children.
         */
        );
        /**
         * @property {number} materialOpacity -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * Opacity of the material only.
         *
         * The value should be a number from 0 to 1, inclusive. 0 is fully transparent, and 1
         * is fully opaque.
         *
         * This is in addition to an element's
         * [`opacity`](../../../core/SharedAPI#opacity), both are multiplied
         * together. As an example, if this material's element's `opacity` is `0.5`,
         * and this material's `materialOpacity` is `0.5`, then the overall opacity
         * of the material will be 0.25 when rendered.
         *
         * This modifies the material's opacity without affecting CSS rendering,
         * whereas modifying an element's `opacity` affects CSS rendering including
         * the element's children.
         */
        materialOpacity = __runInitializers(this, _materialOpacity_initializers, 1);
        __color = 'white';
        /**
         * @property {string | number | Color} color -
         *
         * Default: `THREE.Color("white")`
         *
         * Color of the material.
         *
         * The property can be set with a CSS color value string (f.e. `"#ff6600"`
         * or `rgb(20, 40, 50)`), a
         * [`THREE.Color`](https://threejs.org/docs/index.html?q=material#api/en/math/Color),
         * or a number representing the color in hex (f.e. `0xff6600`).
         *
         * The property always returns the color normalized to a
         * [`THREE.Color`](https://threejs.org/docs/index.html?q=material#api/en/math/Color)
         * object.
         */
        get color() {
            return this.__color;
        }
        set color(val) {
            if (typeof val === 'object')
                this.__color = val.getStyle();
            else
                this.__color = val;
        }
        // TODO use @memo (once implemented in classy-solid) on `get transparent` instead of making this extra prop with createMemo.
        __transparent = createMemo(() => (this.element.opacity < 1 || this.materialOpacity < 1 ? true : false));
        /**
         * @property {} transparent -
         *
         * `reactive`
         *
         * Returns `true` when either the element's
         * [`opacity`](../../../core/SharedAPI#opacity) or this material's
         * [`materialOpacity`](#materialOpacity) are less than 1.
         */
        get transparent() {
            return this.__transparent();
        }
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                mat.alphaTest = this.alphaTest;
                mat.colorWrite = this.colorWrite;
                mat.depthTest = this.depthTest;
                mat.depthWrite = this.depthWrite;
                mat.dithering = this.dithering;
                this.element.needsUpdate();
            });
            // TODO Better taxonomy organization, no any types, to avoid the below
            // conditional checks.
            // Only some materials have wireframe.
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!(mat && isWireframeMaterial(mat)))
                    return;
                mat.wireframe = this.wireframe;
                this.element.needsUpdate();
            });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!(mat && 'side' in mat))
                    return;
                let side;
                switch (this.sidedness) {
                    case 'front':
                        side = FrontSide;
                        break;
                    case 'back':
                        side = BackSide;
                        break;
                    case 'double':
                        side = DoubleSide;
                        break;
                }
                mat.side = side;
                this.element.needsUpdate();
            });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!(mat && isColoredMaterial(mat)))
                    return;
                mat.color.set(this.color);
                this.element.needsUpdate();
            });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                mat.opacity = this.element.opacity * this.materialOpacity;
                mat.transparent = this.transparent;
                this.element.needsUpdate();
            });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                this.transparent; // dependency (if changed based on opacity)
                mat.needsUpdate = true;
            });
        }
        _createComponent() {
            return new Material();
        }
        _handleTexture(textureUrl, setTexture, hasTexture, onLoad, isColor = false) {
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                const url = textureUrl(); // this is a dependency of the effect
                if (!url)
                    return;
                // TODO The default material color (if not specified) when
                // there's a texture should be white
                let cleaned = false;
                // TODO onProgress and onError
                const texture = new TextureLoader().load(url, () => {
                    if (cleaned)
                        return;
                    // We only need to re-compile the shader when we first
                    // enable the texture (from null).
                    if (!hasTexture(mat))
                        mat.needsUpdate = true;
                    setTexture(mat, texture);
                    this.element.needsUpdate();
                    onLoad?.();
                    this.element.dispatchEvent(new TextureLoadEvent(url));
                });
                if (isColor)
                    texture.colorSpace = SRGBColorSpace;
                mat.needsUpdate = true; // Three.js needs to update the material in the GPU
                this.element.needsUpdate(); // LUME needs to re-render
                onCleanup(() => {
                    cleaned = true;
                    texture.dispose();
                    setTexture(mat, null);
                    mat.needsUpdate = true; // Three.js needs to update the material in the GPU
                    this.element.needsUpdate(); // LUME needs to re-render
                });
            });
        }
    };
    return MaterialBehavior = _classThis;
})();
export { MaterialBehavior };
function isColoredMaterial(mat) {
    return 'color' in mat;
}
function isWireframeMaterial(mat) {
    return 'wireframe' in mat;
}
/** NOTE: Experimental */
// Once we migrate geometry and material behaviors into elements, they will emit
// 'load' events as needed, and we'll delete this.
class TextureLoadEvent extends Event {
    static type = 'textureload';
    /** The URL of the loaded texture. */
    src = '';
    constructor(src) {
        super(TextureLoadEvent.type, { bubbles: false, cancelable: false });
        this.src = src;
    }
}
//# sourceMappingURL=MaterialBehavior.js.map