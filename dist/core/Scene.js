// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.
// See: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem
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
import { createEffect, onCleanup, untrack } from 'solid-js';
import html from 'solid-js/html';
import { signal } from 'classy-solid';
import { booleanAttribute, attribute, numberAttribute, element, stringAttribute, noSignal, } from '@lume/element';
import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Camera as ThreeCamera } from 'three/src/cameras/Camera.js';
// import {AmbientLight} from 'three/src/lights/AmbientLight.js'
import { Color } from 'three/src/math/Color.js';
import { Fog } from 'three/src/scenes/Fog.js';
import { FogExp2 } from 'three/src/scenes/FogExp2.js';
import { WebglRendererThree } from '../renderers/WebglRendererThree.js';
import { Css3dRendererThree } from '../renderers/Css3dRendererThree.js';
import { SharedAPI } from './SharedAPI.js';
import { Motor } from './Motor.js';
import { autoDefineElements } from '../LumeConfig.js';
import { version } from '../index.js'; // TODO replace with version.ts for vanilla ES Module tree shakability
import { defaultScenePerspective } from '../constants.js';
import { threejsVersion } from '../utils/three/threeVersion.js';
const magic = () => ` LUME ✨ v${version} 👉 https://github.com/lume/lume `;
// Queue a microtask because otherwise this fires before the module graph has
// executed the version variable initializer.
queueMicrotask(() => console.info(magic()));
/**
 * @class Scene -
 *
 * Element: `<lume-scene>`
 *
 * This is the backing class for `<lume-scene>` elements. All
 * [`Element3D`](./Element3D.md)s must be inside of a `<lume-scene>` element. A `Scene`
 * establishes a visual area in a web application where a 3D scene will be
 * rendered.
 *
 * A Scene has some properties that apply to the scene as a whole and will have
 * an effect on all LUME elements in the scene. For example, `fog-mode` defines fog
 * rendering that changes the color of all WebGL objects in the scene to make them
 * have the appearance of being obscured by a haze.
 *
 * ## Example
 *
 * The following example shows how to begin making a LUME scene within an HTML
 * file. To learn more about how to get started, see the [install guide](../../guide/install.md).
 *
 * <live-code src="../../examples/scene.html"></live-code>
 *
 * @extends SharedAPI
 */
// TODO @element jsdoc tag
let Scene = (() => {
    let _classDecorators = [element('lume-scene', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SharedAPI;
    let _instanceExtraInitializers = [];
    let _enableCss_decorators;
    let _enableCss_initializers = [];
    let _webgl_decorators;
    let _webgl_initializers = [];
    let _swapLayers_decorators;
    let _swapLayers_initializers = [];
    let _shadowMode_decorators;
    let _shadowMode_initializers = [];
    let _get_shadowmapType_decorators;
    let _vr_decorators;
    let _vr_initializers = [];
    let _backgroundColor_decorators;
    let _backgroundColor_initializers = [];
    let _backgroundOpacity_decorators;
    let _backgroundOpacity_initializers = [];
    let _background_decorators;
    let _background_initializers = [];
    let _backgroundIntensity_decorators;
    let _backgroundIntensity_initializers = [];
    let _backgroundBlur_decorators;
    let _backgroundBlur_initializers = [];
    let _equirectangularBackground_decorators;
    let _equirectangularBackground_initializers = [];
    let _environment_decorators;
    let _environment_initializers = [];
    let _fogMode_decorators;
    let _fogMode_initializers = [];
    let _fogNear_decorators;
    let _fogNear_initializers = [];
    let _fogFar_decorators;
    let _fogFar_initializers = [];
    let _fogColor_decorators;
    let _fogColor_initializers = [];
    let _fogDensity_decorators;
    let _fogDensity_initializers = [];
    let _cameraNear_decorators;
    let _cameraNear_initializers = [];
    let _cameraFar_decorators;
    let _cameraFar_initializers = [];
    let _perspective_decorators;
    let _perspective_initializers = [];
    let ___defaultThreeCamera_decorators;
    let ___defaultThreeCamera_initializers = [];
    let ___camera_decorators;
    let ___camera_initializers = [];
    let ___localClipping_decorators;
    let ___localClipping_initializers = [];
    let ___elementParentSize_decorators;
    let ___elementParentSize_initializers = [];
    var Scene = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _enableCss_decorators = [booleanAttribute];
            _webgl_decorators = [booleanAttribute];
            _swapLayers_decorators = [booleanAttribute];
            _shadowMode_decorators = [attribute];
            _get_shadowmapType_decorators = [attribute, noSignal];
            _vr_decorators = [booleanAttribute];
            _backgroundColor_decorators = [attribute];
            _backgroundOpacity_decorators = [numberAttribute];
            _background_decorators = [attribute];
            _backgroundIntensity_decorators = [numberAttribute];
            _backgroundBlur_decorators = [numberAttribute];
            _equirectangularBackground_decorators = [booleanAttribute];
            _environment_decorators = [attribute];
            _fogMode_decorators = [stringAttribute];
            _fogNear_decorators = [numberAttribute];
            _fogFar_decorators = [numberAttribute];
            _fogColor_decorators = [stringAttribute];
            _fogDensity_decorators = [numberAttribute];
            _cameraNear_decorators = [numberAttribute];
            _cameraFar_decorators = [numberAttribute];
            _perspective_decorators = [numberAttribute];
            ___defaultThreeCamera_decorators = [signal];
            ___camera_decorators = [signal];
            ___localClipping_decorators = [signal];
            ___elementParentSize_decorators = [signal];
            __esDecorate(this, null, _get_shadowmapType_decorators, { kind: "getter", name: "shadowmapType", static: false, private: false, access: { has: obj => "shadowmapType" in obj, get: obj => obj.shadowmapType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _enableCss_decorators, { kind: "field", name: "enableCss", static: false, private: false, access: { has: obj => "enableCss" in obj, get: obj => obj.enableCss, set: (obj, value) => { obj.enableCss = value; } }, metadata: _metadata }, _enableCss_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _webgl_decorators, { kind: "field", name: "webgl", static: false, private: false, access: { has: obj => "webgl" in obj, get: obj => obj.webgl, set: (obj, value) => { obj.webgl = value; } }, metadata: _metadata }, _webgl_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _swapLayers_decorators, { kind: "field", name: "swapLayers", static: false, private: false, access: { has: obj => "swapLayers" in obj, get: obj => obj.swapLayers, set: (obj, value) => { obj.swapLayers = value; } }, metadata: _metadata }, _swapLayers_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _shadowMode_decorators, { kind: "field", name: "shadowMode", static: false, private: false, access: { has: obj => "shadowMode" in obj, get: obj => obj.shadowMode, set: (obj, value) => { obj.shadowMode = value; } }, metadata: _metadata }, _shadowMode_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _vr_decorators, { kind: "field", name: "vr", static: false, private: false, access: { has: obj => "vr" in obj, get: obj => obj.vr, set: (obj, value) => { obj.vr = value; } }, metadata: _metadata }, _vr_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _backgroundColor_decorators, { kind: "field", name: "backgroundColor", static: false, private: false, access: { has: obj => "backgroundColor" in obj, get: obj => obj.backgroundColor, set: (obj, value) => { obj.backgroundColor = value; } }, metadata: _metadata }, _backgroundColor_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _backgroundOpacity_decorators, { kind: "field", name: "backgroundOpacity", static: false, private: false, access: { has: obj => "backgroundOpacity" in obj, get: obj => obj.backgroundOpacity, set: (obj, value) => { obj.backgroundOpacity = value; } }, metadata: _metadata }, _backgroundOpacity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _background_decorators, { kind: "field", name: "background", static: false, private: false, access: { has: obj => "background" in obj, get: obj => obj.background, set: (obj, value) => { obj.background = value; } }, metadata: _metadata }, _background_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _backgroundIntensity_decorators, { kind: "field", name: "backgroundIntensity", static: false, private: false, access: { has: obj => "backgroundIntensity" in obj, get: obj => obj.backgroundIntensity, set: (obj, value) => { obj.backgroundIntensity = value; } }, metadata: _metadata }, _backgroundIntensity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _backgroundBlur_decorators, { kind: "field", name: "backgroundBlur", static: false, private: false, access: { has: obj => "backgroundBlur" in obj, get: obj => obj.backgroundBlur, set: (obj, value) => { obj.backgroundBlur = value; } }, metadata: _metadata }, _backgroundBlur_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _equirectangularBackground_decorators, { kind: "field", name: "equirectangularBackground", static: false, private: false, access: { has: obj => "equirectangularBackground" in obj, get: obj => obj.equirectangularBackground, set: (obj, value) => { obj.equirectangularBackground = value; } }, metadata: _metadata }, _equirectangularBackground_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _environment_decorators, { kind: "field", name: "environment", static: false, private: false, access: { has: obj => "environment" in obj, get: obj => obj.environment, set: (obj, value) => { obj.environment = value; } }, metadata: _metadata }, _environment_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fogMode_decorators, { kind: "field", name: "fogMode", static: false, private: false, access: { has: obj => "fogMode" in obj, get: obj => obj.fogMode, set: (obj, value) => { obj.fogMode = value; } }, metadata: _metadata }, _fogMode_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fogNear_decorators, { kind: "field", name: "fogNear", static: false, private: false, access: { has: obj => "fogNear" in obj, get: obj => obj.fogNear, set: (obj, value) => { obj.fogNear = value; } }, metadata: _metadata }, _fogNear_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fogFar_decorators, { kind: "field", name: "fogFar", static: false, private: false, access: { has: obj => "fogFar" in obj, get: obj => obj.fogFar, set: (obj, value) => { obj.fogFar = value; } }, metadata: _metadata }, _fogFar_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fogColor_decorators, { kind: "field", name: "fogColor", static: false, private: false, access: { has: obj => "fogColor" in obj, get: obj => obj.fogColor, set: (obj, value) => { obj.fogColor = value; } }, metadata: _metadata }, _fogColor_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fogDensity_decorators, { kind: "field", name: "fogDensity", static: false, private: false, access: { has: obj => "fogDensity" in obj, get: obj => obj.fogDensity, set: (obj, value) => { obj.fogDensity = value; } }, metadata: _metadata }, _fogDensity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _cameraNear_decorators, { kind: "field", name: "cameraNear", static: false, private: false, access: { has: obj => "cameraNear" in obj, get: obj => obj.cameraNear, set: (obj, value) => { obj.cameraNear = value; } }, metadata: _metadata }, _cameraNear_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _cameraFar_decorators, { kind: "field", name: "cameraFar", static: false, private: false, access: { has: obj => "cameraFar" in obj, get: obj => obj.cameraFar, set: (obj, value) => { obj.cameraFar = value; } }, metadata: _metadata }, _cameraFar_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _perspective_decorators, { kind: "field", name: "perspective", static: false, private: false, access: { has: obj => "perspective" in obj, get: obj => obj.perspective, set: (obj, value) => { obj.perspective = value; } }, metadata: _metadata }, _perspective_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, ___defaultThreeCamera_decorators, { kind: "field", name: "__defaultThreeCamera", static: false, private: false, access: { has: obj => "__defaultThreeCamera" in obj, get: obj => obj.__defaultThreeCamera, set: (obj, value) => { obj.__defaultThreeCamera = value; } }, metadata: _metadata }, ___defaultThreeCamera_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, ___camera_decorators, { kind: "field", name: "__camera", static: false, private: false, access: { has: obj => "__camera" in obj, get: obj => obj.__camera, set: (obj, value) => { obj.__camera = value; } }, metadata: _metadata }, ___camera_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, ___localClipping_decorators, { kind: "field", name: "__localClipping", static: false, private: false, access: { has: obj => "__localClipping" in obj, get: obj => obj.__localClipping, set: (obj, value) => { obj.__localClipping = value; } }, metadata: _metadata }, ___localClipping_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, ___elementParentSize_decorators, { kind: "field", name: "__elementParentSize", static: false, private: false, access: { has: obj => "__elementParentSize" in obj, get: obj => obj.__elementParentSize, set: (obj, value) => { obj.__elementParentSize = value; } }, metadata: _metadata }, ___elementParentSize_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Scene = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * @property {true} isScene -
         *
         * *readonly*
         *
         * Always `true` for things that are or inherit from `Scene`.
         */
        // TODO @readonly jsdoc tag
        isScene = (__runInitializers(this, _instanceExtraInitializers), true);
        // Skip ShadowRoot observation for Scene instances, and consider composed
        // children to always be the Scene's direct children, not any in its
        // ShadowRoot. Only a Scene's actual children or distributed children are
        // considered to be in the LUME scene graph because Scene's ShadowRoot
        // serves a specific purpose in the rendering implementation and is not the
        // user's.
        skipShadowObservation = this.isScene;
        /**
         * @property {boolean} enableCss -
         *
         * *attribute*
         *
         * Default: `true`
         *
         * When `true`, CSS transforms are applied
         * to all LUME elements. This allows regular HTML content placed inside LUME
         * elements to be positioned in the scene's 3D space. Set this to `false` if
         * you will render only WebGL content and do not need to listen to
         * pointer events on the elements; the elements will have the CSS property
         * `display:none`. When rendering only WebGL content, leaving this enabled is useful for
         * debugging, as the elements are placed in the same locations in 3D
         * space as the WebGL graphics, and thus devtools will highlight the
         * positions of WebGL objects on the screen when hovering on them in the element inspector.
         */
        // TODO @attribute jsdoc tag
        // TODO @default jsdoc tag
        enableCss = __runInitializers(this, _enableCss_initializers, true
        /**
         * @property {boolean} webgl -
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, enables WebGL rendering.
         */
        );
        /**
         * @property {boolean} webgl -
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, enables WebGL rendering.
         */
        webgl = __runInitializers(this, _webgl_initializers, false
        /**
         * @property {boolean} swapLayers -
         *
         * *attribute*
         *
         * Default: `false`
         *
         * This is only useful when both CSS and
         * WebGL render modes are enabled. When `true`, the CSS layer will render on
         * top of the WebGL layer instead of below.
         */
        );
        /**
         * @property {boolean} swapLayers -
         *
         * *attribute*
         *
         * Default: `false`
         *
         * This is only useful when both CSS and
         * WebGL render modes are enabled. When `true`, the CSS layer will render on
         * top of the WebGL layer instead of below.
         */
        swapLayers = __runInitializers(this, _swapLayers_initializers, false
        /**
         * @property {'basic' | 'pcf' | 'pcfsoft' | 'vsm'} shadowMode -
         *
         * *attribute*
         *
         * Default: `'basic'`
         *
         * Specifies the type of shadows to use. The value can be `'basic'`,
         * `'pcf'`, `'pcfsoft'`, or `'vsm'`. See the "Shadow Types" section in
         * Three.js [Renderer
         * Constants](https://threejs.org/docs/#api/en/constants/Renderer) for
         * descriptions.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {'basic' | 'pcf' | 'pcfsoft' | 'vsm'} shadowMode -
         *
         * *attribute*
         *
         * Default: `'basic'`
         *
         * Specifies the type of shadows to use. The value can be `'basic'`,
         * `'pcf'`, `'pcfsoft'`, or `'vsm'`. See the "Shadow Types" section in
         * Three.js [Renderer
         * Constants](https://threejs.org/docs/#api/en/constants/Renderer) for
         * descriptions.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        shadowMode = __runInitializers(this, _shadowMode_initializers, 'basic'
        /**
         * @deprecated
         * @property {'basic' | 'pcf' | 'pcfsoft' | 'vsm'} shadowmapType - Deprecated, use [`shadowMode`](#shadowmaptype) instead.
         *
         * *attribute*
         */
        );
        /**
         * @deprecated
         * @property {'basic' | 'pcf' | 'pcfsoft' | 'vsm'} shadowmapType - Deprecated, use [`shadowMode`](#shadowmaptype) instead.
         *
         * *attribute*
         */
        get shadowmapType() {
            return this.shadowMode;
        }
        set shadowmapType(v) {
            this.shadowMode = v;
        }
        /**
         * @property {boolean} vr -
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, enables VR capabilities. The user
         * can click a button to enter VR mode.
         *
         * Applies only if [`webgl`](#webgl) is `true`. CSS content can not be natively
         * rendered with the browser's WebXR. There exist some tricks to import CSS
         * rendering in the form of an SVG image to use as a texture in WebGL and
         * hence WebXR, but it has some limitations including low performance if
         * animating CSS features; we may add this feature later.
         */
        vr = __runInitializers(this, _vr_initializers, false
        /**
         * @property {Color | string | number | null} backgroundColor -
         *
         * *attribute*
         *
         * Default: `'white'`
         *
         * The color of the
         * scene's background when WebGL rendering is enabled. If the
         * [`background`](#background) property is also set, then `backgroundColor` is
         * ignored. Make sure to set `backgroundOpacity` to a higher value than the
         * default of `0` or the color won't be visible and instead only the color of
         * whatever is behind the `<lume-scene>` will be visible.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {Color | string | number | null} backgroundColor -
         *
         * *attribute*
         *
         * Default: `'white'`
         *
         * The color of the
         * scene's background when WebGL rendering is enabled. If the
         * [`background`](#background) property is also set, then `backgroundColor` is
         * ignored. Make sure to set `backgroundOpacity` to a higher value than the
         * default of `0` or the color won't be visible and instead only the color of
         * whatever is behind the `<lume-scene>` will be visible.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        backgroundColor = __runInitializers(this, _backgroundColor_initializers, new Color('white')
        /**
         * @property {number} backgroundOpacity -
         *
         * *attribute*
         *
         * Default: `0`
         *
         * A number between `0` and `1` that
         * defines the opacity (opposite of transparency) of the `backgroundColor`
         * when WebGL is enabled. If the value is less than 1, it means that any DOM
         * contend behind the `<lume-scene>` element will be visible. A value of `0`
         * means the background is fully transparent. This is ignored if the
         * [`background`](#background) property is set.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {number} backgroundOpacity -
         *
         * *attribute*
         *
         * Default: `0`
         *
         * A number between `0` and `1` that
         * defines the opacity (opposite of transparency) of the `backgroundColor`
         * when WebGL is enabled. If the value is less than 1, it means that any DOM
         * contend behind the `<lume-scene>` element will be visible. A value of `0`
         * means the background is fully transparent. This is ignored if the
         * [`background`](#background) property is set.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        backgroundOpacity = __runInitializers(this, _backgroundOpacity_initializers, 0
        /**
         * @property {string | null} background -
         *
         * *attribute*
         *
         * Default: `null`
         *
         * Set an image as the scene's
         * background. If the image is an [equirectangular environment
         * map](https://coeleveld.com/spherical-equirectangular-environment-textures-and-hdri), then set the value of
         * [`equirectangularBackground`](#equirectangularbackground) to `true`, otherwise the image
         * will be treated as a 2D background image. The value should be a path
         * to a jpeg, jpg, or png. Other types not supported yet. This value
         * takes priority over the [`backgroundColor`](#backgroundcolor) and
         * [`backgroundOpacity`](#backgroundopacity) properties; those properties will be
         * ignored. Any transparent parts of the image will be rendered
         * as color white.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {string | null} background -
         *
         * *attribute*
         *
         * Default: `null`
         *
         * Set an image as the scene's
         * background. If the image is an [equirectangular environment
         * map](https://coeleveld.com/spherical-equirectangular-environment-textures-and-hdri), then set the value of
         * [`equirectangularBackground`](#equirectangularbackground) to `true`, otherwise the image
         * will be treated as a 2D background image. The value should be a path
         * to a jpeg, jpg, or png. Other types not supported yet. This value
         * takes priority over the [`backgroundColor`](#backgroundcolor) and
         * [`backgroundOpacity`](#backgroundopacity) properties; those properties will be
         * ignored. Any transparent parts of the image will be rendered
         * as color white.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        background = __runInitializers(this, _background_initializers, null
        /**
         * @property {number} backgroundIntensity -
         *
         * *attribute*
         *
         * Default: `0`
         *
         * A number between `0` and `1` that defines the intensity of the
         * `background` when WebGL is enabled. If the value is 1, the background
         * will be brightest, and if the value is 0 the background will be black.
         *
         * This applies only if [`webgl`](#webgl) is `true` and the
         * [`background`](#background) property is set.
         */
        );
        /**
         * @property {number} backgroundIntensity -
         *
         * *attribute*
         *
         * Default: `0`
         *
         * A number between `0` and `1` that defines the intensity of the
         * `background` when WebGL is enabled. If the value is 1, the background
         * will be brightest, and if the value is 0 the background will be black.
         *
         * This applies only if [`webgl`](#webgl) is `true` and the
         * [`background`](#background) property is set.
         */
        backgroundIntensity = __runInitializers(this, _backgroundIntensity_initializers, 1
        /**
         * @property {number} backgroundBlur -
         *
         * **`experimental`** *attribute*
         *
         * Default: `0`
         *
         * If [`background`](#background) is set, the background will be blurred by
         * the given amount.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {number} backgroundBlur -
         *
         * **`experimental`** *attribute*
         *
         * Default: `0`
         *
         * If [`background`](#background) is set, the background will be blurred by
         * the given amount.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        backgroundBlur = __runInitializers(this, _backgroundBlur_initializers, 0
        /**
         * @property {boolean} equirectangularBackground -
         *
         * *attribute*
         *
         * Default: `false`
         *
         * If the [`background`](#background) is equirectangular, set this to `true`
         * so use it like a skybox, otherwise the image will be used as a regular 2D
         * background image.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {boolean} equirectangularBackground -
         *
         * *attribute*
         *
         * Default: `false`
         *
         * If the [`background`](#background) is equirectangular, set this to `true`
         * so use it like a skybox, otherwise the image will be used as a regular 2D
         * background image.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        equirectangularBackground = __runInitializers(this, _equirectangularBackground_initializers, false
        /**
         * @property {string | null} environment -
         *
         * *attribute*
         *
         * Default: `null`
         *
         * The environment can be a path to a
         * jpeg, jpg, or png (other format not yet supported). It is assumed to
         * be an equirectangular image used for env maps for things like
         * reflections on metallic objects in the scene.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {string | null} environment -
         *
         * *attribute*
         *
         * Default: `null`
         *
         * The environment can be a path to a
         * jpeg, jpg, or png (other format not yet supported). It is assumed to
         * be an equirectangular image used for env maps for things like
         * reflections on metallic objects in the scene.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        environment = __runInitializers(this, _environment_initializers, null
        /**
         * @property {'none' | 'linear' | 'expo2'} fogMode -
         *
         * *attribute*
         *
         * Default: `'none'`
         *
         * The fog mode to render
         * the scene with.
         *
         * A value of `'none'` means no fog.
         *
         * A value of `'linear'`
         * makes a fog that gets reduces visibility of objects with distance from the camera.
         * The `fogNear` and `fogFar` properties specify the distance from the camera when
         * linear fog starts being applied to objects and when objects are fully invisible,
         * respectively. Any objects before the near point will be fully visible, and any
         * objects beyond the far point will be fully invisible.
         *
         * A value of `'expo2'` creates an exponential squared fog. Unlike linear fog, the near
         * and far cannot be configured. Instead, expo2 fog is more realistic, and only it's
         * overall "physical" density can be configured with the `fogDensity` property.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {'none' | 'linear' | 'expo2'} fogMode -
         *
         * *attribute*
         *
         * Default: `'none'`
         *
         * The fog mode to render
         * the scene with.
         *
         * A value of `'none'` means no fog.
         *
         * A value of `'linear'`
         * makes a fog that gets reduces visibility of objects with distance from the camera.
         * The `fogNear` and `fogFar` properties specify the distance from the camera when
         * linear fog starts being applied to objects and when objects are fully invisible,
         * respectively. Any objects before the near point will be fully visible, and any
         * objects beyond the far point will be fully invisible.
         *
         * A value of `'expo2'` creates an exponential squared fog. Unlike linear fog, the near
         * and far cannot be configured. Instead, expo2 fog is more realistic, and only it's
         * overall "physical" density can be configured with the `fogDensity` property.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        fogMode = __runInitializers(this, _fogMode_initializers, 'none'
        /**
         * @property {number} fogNear -
         *
         * *attribute*
         *
         * Default: `0`
         *
         * When `fogMode` is `'linear'`, this controls
         * the distance from the camera where fog starts to appear and objects start
         * to be less visible.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {number} fogNear -
         *
         * *attribute*
         *
         * Default: `0`
         *
         * When `fogMode` is `'linear'`, this controls
         * the distance from the camera where fog starts to appear and objects start
         * to be less visible.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        fogNear = __runInitializers(this, _fogNear_initializers, 0
        /**
         * @property {number} fogFar -
         *
         * *attribute*
         *
         * Default: `1000`
         *
         * When `fogMode` is `'linear'`, this controls
         * the distance from the camera where fog reaches maximum density and
         * objects are no longer visible.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {number} fogFar -
         *
         * *attribute*
         *
         * Default: `1000`
         *
         * When `fogMode` is `'linear'`, this controls
         * the distance from the camera where fog reaches maximum density and
         * objects are no longer visible.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        fogFar = __runInitializers(this, _fogFar_initializers, 1000
        /**
         * @property {string} fogColor -
         *
         * *attribute*
         *
         * Default: `'gray'`
         *
         * If `fogMode` is not `'none'`, this
         * configures the fog color. The value should be any valid CSS color string.
         *
         * You will want to change the value to match that of, or be similar to,
         * your scene's `backgroundColor`.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {string} fogColor -
         *
         * *attribute*
         *
         * Default: `'gray'`
         *
         * If `fogMode` is not `'none'`, this
         * configures the fog color. The value should be any valid CSS color string.
         *
         * You will want to change the value to match that of, or be similar to,
         * your scene's `backgroundColor`.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        fogColor = __runInitializers(this, _fogColor_initializers, 'gray'
        /**
         * @property {number} fogDensity -
         *
         * *attribute*
         *
         * Default: `0.0025`
         *
         * If `fogMode` is set to `'expo2'`, this
         * configures the fog density.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        );
        /**
         * @property {number} fogDensity -
         *
         * *attribute*
         *
         * Default: `0.0025`
         *
         * If `fogMode` is set to `'expo2'`, this
         * configures the fog density.
         *
         * Applies only if [`webgl`](#webgl) is `true`.
         */
        fogDensity = __runInitializers(this, _fogDensity_initializers, 0.0025
        /**
         * @property {number} cameraNear -
         *
         * *attribute*
         *
         * Default: `0.1`
         *
         * When not using a custom camera, this
         * configures the distance from the default camera of a plane perpendicular
         * to the camera's line of sight after which objects objects are visible. Anything between
         * the plane and the camera will not be visible. This should be smaller than `cameraFar`. Also see `cameraFar`.
         *
         * Applies in both CSS and WebGL rendering. Note that the near and far
         * values apply only to WebGL rendering and are otherwise infinitely small and
         * infinitely big (respectively) when it comes to CSS rendering.
         */
        );
        /**
         * @property {number} cameraNear -
         *
         * *attribute*
         *
         * Default: `0.1`
         *
         * When not using a custom camera, this
         * configures the distance from the default camera of a plane perpendicular
         * to the camera's line of sight after which objects objects are visible. Anything between
         * the plane and the camera will not be visible. This should be smaller than `cameraFar`. Also see `cameraFar`.
         *
         * Applies in both CSS and WebGL rendering. Note that the near and far
         * values apply only to WebGL rendering and are otherwise infinitely small and
         * infinitely big (respectively) when it comes to CSS rendering.
         */
        cameraNear = __runInitializers(this, _cameraNear_initializers, 0.1
        /**
         * @property {number} cameraFar -
         *
         * *attribute*
         *
         * Default: `10000`
         *
         * When not using a custom camera, this
         * configures the distance from the default camera of a plane perpendicular
         * to the camera's line of sight before which objects are visible. Anything further than
         * the plane will not be visible. This should be bigger than `cameraNear`. Also see `cameraNear`.
         *
         * Applies in both CSS and WebGL rendering. Note that the near and far
         * values apply only to WebGL rendering and are otherwise infinitely small and
         * infinitely big (respectively) when it comes to CSS rendering.
         */
        );
        /**
         * @property {number} cameraFar -
         *
         * *attribute*
         *
         * Default: `10000`
         *
         * When not using a custom camera, this
         * configures the distance from the default camera of a plane perpendicular
         * to the camera's line of sight before which objects are visible. Anything further than
         * the plane will not be visible. This should be bigger than `cameraNear`. Also see `cameraNear`.
         *
         * Applies in both CSS and WebGL rendering. Note that the near and far
         * values apply only to WebGL rendering and are otherwise infinitely small and
         * infinitely big (respectively) when it comes to CSS rendering.
         */
        cameraFar = __runInitializers(this, _cameraFar_initializers, 10000
        /**
         * @property {number} perspective -
         *
         * *attribute*
         *
         * Default: `400`
         *
         * This property behaves identical to CSS perspective
         * (https://developer.mozilla.org/en-US/docs/Web/CSS/perspective) when using
         * a scene's default camera, adjusting its fov and Z position. If using a
         * custom camera (for example a `<lume-perspective-camera>`) then this value
         * affects only the camera's fov, unless we specify a non-zero fov value for
         * the custom camera.
         *
         * The value sets the default camera's Z position to the given value (relative to the world
         * origin, 0,0,0). Note that the default camera points in the -z direction, therefore a value
         * of 800 means the camera is at position 0,0,800 looking directly at the world origin
         * at 0,0,0. Furthermore, based on the chosen value, the camera's aspect ratio and fov
         * will be adjusted such that if there were a plane positioned at 0,0,0, perpendicular
         * to the camera's line of sight, and having the same dimensions as the scene's viewport
         * in screen pixels, then the plane would fit perfectly in the view, and one unit on that
         * plane would coincide with one CSS pixel on the screen; essentially that plane would be lined
         * up perfectly with the screen surface.
         *
         * Applies with both CSS and WebGL rendering.
         */
        // TODO perhaps we want the perspective to also affect a custom camera's internal
        // position relative to the element's local origin. We can do this by making the THREE
        // camera a child of the element's .three object instead of it being the
        // .three object directly.
        );
        /**
         * @property {number} perspective -
         *
         * *attribute*
         *
         * Default: `400`
         *
         * This property behaves identical to CSS perspective
         * (https://developer.mozilla.org/en-US/docs/Web/CSS/perspective) when using
         * a scene's default camera, adjusting its fov and Z position. If using a
         * custom camera (for example a `<lume-perspective-camera>`) then this value
         * affects only the camera's fov, unless we specify a non-zero fov value for
         * the custom camera.
         *
         * The value sets the default camera's Z position to the given value (relative to the world
         * origin, 0,0,0). Note that the default camera points in the -z direction, therefore a value
         * of 800 means the camera is at position 0,0,800 looking directly at the world origin
         * at 0,0,0. Furthermore, based on the chosen value, the camera's aspect ratio and fov
         * will be adjusted such that if there were a plane positioned at 0,0,0, perpendicular
         * to the camera's line of sight, and having the same dimensions as the scene's viewport
         * in screen pixels, then the plane would fit perfectly in the view, and one unit on that
         * plane would coincide with one CSS pixel on the screen; essentially that plane would be lined
         * up perfectly with the screen surface.
         *
         * Applies with both CSS and WebGL rendering.
         */
        // TODO perhaps we want the perspective to also affect a custom camera's internal
        // position relative to the element's local origin. We can do this by making the THREE
        // camera a child of the element's .three object instead of it being the
        // .three object directly.
        perspective = __runInitializers(this, _perspective_initializers, defaultScenePerspective
        // Holds the default internal camera when a Camera elements is not in use.
        );
        // Holds the default internal camera when a Camera elements is not in use.
        __defaultThreeCamera = __runInitializers(this, ___defaultThreeCamera_initializers, null
        /**
         * @property {THREE.Camera} threeCamera -
         *
         * *readonly*
         *
         * The current active `THREE.Camera` being used to render visuals.
         *
         * If no Lume camera element such as `<lume-perspective-camera>` is active,
         * this returns the default `THREE.Camera` that the scene uses internally.
         *
         * If a camera element is set active with an `active` attribute (f.e.
         * `<lume-perspective-camera active>`, then this property will return the
         * `THREE.Camera` from the active camera element.
         *
         * The scene's [`.perspective`](#perspective) property is used for
         * configuring the default camera view's fov and Z position to behave
         * identical to CSS `perspective` by default. This behavior can be bypassed
         * by using a `<lume-perspective-camera>` element manually, and configuring
         * its [`.aspect`](../cameras/PerspectiveCamera#aspect) and
         * [`fov`](../cameras/PerspectiveCamera#fov) properties or attributes to
         * non-zero values.
         *
         * Applies with both CSS and WebGL rendering.
         */
        );
        /**
         * @property {THREE.Camera} threeCamera -
         *
         * *readonly*
         *
         * The current active `THREE.Camera` being used to render visuals.
         *
         * If no Lume camera element such as `<lume-perspective-camera>` is active,
         * this returns the default `THREE.Camera` that the scene uses internally.
         *
         * If a camera element is set active with an `active` attribute (f.e.
         * `<lume-perspective-camera active>`, then this property will return the
         * `THREE.Camera` from the active camera element.
         *
         * The scene's [`.perspective`](#perspective) property is used for
         * configuring the default camera view's fov and Z position to behave
         * identical to CSS `perspective` by default. This behavior can be bypassed
         * by using a `<lume-perspective-camera>` element manually, and configuring
         * its [`.aspect`](../cameras/PerspectiveCamera#aspect) and
         * [`fov`](../cameras/PerspectiveCamera#fov) properties or attributes to
         * non-zero values.
         *
         * Applies with both CSS and WebGL rendering.
         */
        get threeCamera() {
            return this.__threeCamera;
        }
        // This holds the active camera. There can be many
        // cameras in the scene tree, but the last one with active="true"
        // will be the one referenced here.
        // If there are no cameras in the tree, a virtual default camera is
        // referenced here, who's perspective is that of the scene's
        // perspective attribute.
        __threeCamera;
        /**
         * @property {Camera} camera
         *
         * *readonly*, *signal*
         *
         * Returns the currently active camera that is within the scene, or `null`
         * if there is none and the scene is using its internal default camera. The
         * `.threeCamera` property will always return a Three.js camera, whether
         * from the active camera element, or the scene's internal camera.
         *
         * When the scene is using its default camera, the X and Y size of the scene
         * fits perfectly within the camera view, at a distance from the camera
         * matching the value of the `.perspective` property. In practice, this
         * means that anything positioned within a scene with a default camera is
         * positioned based on CSS pixels, and those items will be sized with CSS
         * pixels. The default camera makes a scene useful for writing apps based on
         * the document space, just like with regular DOM+CSS where everything is
         * positioned starting at the top/left.
         */
        get camera() {
            return this.__camera;
        }
        #glRenderer = null;
        /**
         * @property {THREE.WebGLRenderer} glRenderer
         *
         * *readonly*
         *
         * Returns the scene's underlying
         * [THREE.WebGLRenderer](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer)
         * for custom uses, or `null` when GL rendering is not enabled.
         */
        get glRenderer() {
            return this.#glRenderer?.sceneStates.get(this)?.renderer;
        }
        #cssRenderer = null;
        /**
         * @property {CSS3DRendererNested} cssRenderer
         *
         * *readonly*
         *
         * Returns the scene's underlying `CSS3DRendererNested` (a forked version of
         * [THREE.CSS3DRenderer](https://threejs.org/docs/index.html#examples/en/renderers/CSS3DRenderer)
         * that allows us to have a nested DOM structure instead of a flat DOM
         * structure) for custom uses, or `null` when CSS rendering is not enabled.
         */
        get cssRenderer() {
            return this.#cssRenderer?.sceneStates.get(this)?.renderer;
        }
        __camera = __runInitializers(this, ___camera_initializers, null
        // This is toggled by ClipPlanesBehavior, not intended for direct use.
        );
        // This is toggled by ClipPlanesBehavior, not intended for direct use.
        __localClipping = __runInitializers(this, ___localClipping_initializers, false);
        get scene() {
            return this;
        }
        constructor() {
            super();
            // Used by the `scene` getter in SharedAPI
            // TODO set this in connectedCallback, unset in disconnectedCallback, so
            // it has the same semantics as with Element3D (this.scene is not null when
            // scene is connected and has webgl or css rendering turned on)
            // this._scene = this
            // TODO override size and sizeMode using fields after converting them
            // from getters/setters in the base class.
            /**
             * @property {XYZSizeModeValues} sizeMode -
             *
             * *override*, *attribute*
             *
             * Default: ['proportional', 'proportional', 'literal']
             *
             * This overrides the
             * [`Sizeable.sizeMode`](/api/core/Sizeable.md#sizeMode) property to make the default values for the X and
             * Y axes both "proportional".
             */
            this.sizeMode.set('proportional', 'proportional', 'literal');
            /**
             * @property {XYZNonNegativeValues} size -
             *
             * *override*, *attribute*
             *
             * Default: [1, 1, 0]
             *
             * This overrides the [`Sizeable.size`](/api/core/Sizeable.md#size)
             * property to make the default values for the X and Y axes both `1`.
             */
            this.size.set(1, 1, 0);
            // The scene should always render CSS properties (it needs to always
            // be rendered or resized, for example, because it contains the
            // WebGL canvas which also needs to be resized). Namely, we still
            // want to apply size values to the scene so that it can size
            // relative to it's parent container, or literally if size mode is
            // "literal".
            this._elementOperations.shouldRender = true;
            this._createDefaultCamera();
            this._calcSize();
            this.needsUpdate();
        }
        // WebGLRendererThree appends its content into here.
        _glLayer = null;
        // CSS3DRendererThree appends its content into here.
        _cssLayer = null;
        // Miscellaneous layer. The "Enter VR/AR" button is placed here by Scene, for example.
        _miscLayer = null;
        drawScene() {
            this.#glRenderer?.drawScene(this);
            this.#cssRenderer?.drawScene(this);
        }
        connectedCallback() {
            super.connectedCallback();
            //////////////////////// GL
            // We don't let Three update any matrices, we supply our own world
            // matrices.
            // @ts-expect-error legacy
            if (threejsVersion < 144)
                this.three.autoUpdate = false; // three <0.144
            this.three.matrixWorldAutoUpdate = false; // three >=0.144
            // TODO: default ambient light when no AmbientLight elements are
            // present in the Scene.
            //const ambientLight = new AmbientLight( 0x353535 )
            //this.three.add( ambientLight )
            this.createEffect(this.glRendererEffect);
            this.createEffect(this.fogEffect);
            this.createEffect(this.cameraNearFarEffect);
            this.createEffect(this.cameraEffect);
            //////////////////////// CSS
            this.createEffect(this.cssRendererEffect);
            ////////////////////////
            this.createEffect(this.parentSizeEffect);
            // Queue a microtask because with autoDefineElements true then
            // connectedCallback fires before the module graph has executed the
            // version variable initializer.
            queueMicrotask(() => this.shadowRoot.prepend(new Comment(magic())));
        }
        glRendererEffect = () => {
            if (!this.webgl)
                return;
            this.#glRenderer = WebglRendererThree.singleton();
            this.#glRenderer.initialize(this);
            onCleanup(() => {
                this.#glRenderer.uninitialize(this);
                this.#glRenderer = null;
            });
            createEffect(() => {
                this.#glRenderer.localClippingEnabled = this.__localClipping;
                this.needsUpdate();
            });
            createEffect(() => {
                this.#glRenderer.setClearColor(this, this.backgroundColor, this.backgroundOpacity);
                this.needsUpdate();
            });
            createEffect(() => {
                this.#glRenderer.setClearAlpha(this, this.backgroundOpacity);
                this.needsUpdate();
            });
            createEffect(() => {
                this.#glRenderer.setShadowMapType(this, this.shadowMode);
                this.needsUpdate();
            });
            createEffect(() => {
                this.#glRenderer.enableVR(this, this.vr);
                if (this.vr) {
                    Motor.setFrameRequester(fn => {
                        this.#glRenderer.requestFrame(this, fn);
                        // Mock rAF return value for Motor.setFrameRequester.
                        return 0;
                    });
                    const button = this.#glRenderer.createDefaultVRButton(this);
                    button.classList.add('vrButton');
                    this._miscLayer.appendChild(button);
                }
                else if (this.xr) {
                    // TODO
                }
                else {
                    // TODO else exit the WebXR headset, return back to normal requestAnimationFrame.
                }
                this.needsUpdate();
            });
            createEffect(() => {
                if (!this.webgl || !this.background)
                    return;
                this.#glRenderer.enableBackground(this, this.equirectangularBackground, this.backgroundBlur, texture => {
                    this.three.background = texture || null;
                    // We do not use Three's built-in blur feature because it is
                    // too simple and results in a less attractive pixelated
                    // look.
                    // this.three.backgroundBlurriness = this.backgroundBlur
                    this.needsUpdate();
                    // TODO emit background load event.
                });
                onCleanup(() => {
                    this.#glRenderer.disableBackground(this);
                    this.needsUpdate();
                });
            });
            createEffect(() => {
                this.three.backgroundIntensity = this.backgroundIntensity;
                this.needsUpdate();
            });
            createEffect(() => {
                if (!this.webgl || !this.environment)
                    return;
                if (this.environment.match(/\.(jpg|jpeg|png)$/)) {
                    this.#glRenderer.enableEnvironment(this, texture => {
                        this.three.environment = texture;
                        this.needsUpdate();
                        // TODO emit env load event.
                    });
                    onCleanup(() => {
                        this.#glRenderer.disableEnvironment(this);
                        this.needsUpdate();
                    });
                }
                else {
                    console.warn(`<${this.tagName.toLowerCase()}> environment attribute ignored, the given image type is not currently supported.`);
                }
            });
            createEffect(() => {
                const { x, y } = this.calculatedSize;
                this.#glRenderer.updateResolution(this, x, y);
            });
        };
        fogEffect = () => {
            if (this.fogMode === 'none') {
                this.three.fog = null;
            }
            else if (this.fogMode === 'linear') {
                const fog = (this.three.fog = new Fog('deeppink'));
                fog.near = this.fogNear;
                fog.far = this.fogFar;
                fog.color.set(this.fogColor);
            }
            else if (this.fogMode === 'expo2') {
                const fog = (this.three.fog = new FogExp2(new Color('deeppink').getHex()));
                fog.color.set(this.fogColor);
                fog.density = this.fogDensity;
            }
            this.needsUpdate();
        };
        cameraNearFarEffect = () => {
            const { cameraNear, cameraFar } = this;
            if (!(this.__defaultThreeCamera instanceof ThreePerspectiveCamera))
                return;
            this.__defaultThreeCamera.near = cameraNear;
            this.__defaultThreeCamera.far = cameraFar;
            this.needsUpdate();
        };
        cameraEffect = () => {
            this._updateCameraAspect();
            this._updateCameraPerspective();
            this._updateCameraProjection();
            this.needsUpdate();
        };
        parentSizeEffect = () => {
            // If no rendering is enbled
            if (!this.webgl && !this.enableCss)
                return;
            const { x, y } = this.sizeMode;
            // We only watch size if we have a proportional size.
            // Note, we don't care about the Z dimension, because Scenes are 2D flat surfaces.
            if (!(x === 'proportional' || x === 'p' || y === 'proportional' || y === 'p'))
                return;
            this.#startParentSizeObservation();
            onCleanup(() => {
                this.#stopParentSizeObservation();
            });
            // TODO NESTED SCENES At the moment, we assume Scenes are top-level,
            // connected to regular element parents. In the future, we will
            // allow Scenes to be children of other lume nodes, in order to have
            // nested scene rendering (f.e. a WebGL Scene rendered on a plane or
            // as a texture inside a parent Scene, to make portals and objects
            // with dynamic looks, etc).
        };
        cssRendererEffect = () => {
            if (!this.enableCss)
                return;
            this.#cssRenderer = Css3dRendererThree.singleton();
            this.#cssRenderer.initialize(this);
            onCleanup(() => {
                this.#cssRenderer.uninitialize(this);
                this.#cssRenderer = null;
            });
            createEffect(() => {
                const { x, y } = this.calculatedSize;
                this.#cssRenderer.updateResolution(this, x, y);
            });
        };
        static observedAttributes = [...(Reflect.get(_classSuper, "observedAttributes", _classThis) || []), 'slot'];
        attributeChangedCallback(name, oldVal, newVal) {
            super.attributeChangedCallback(name, oldVal, newVal);
            if (name === 'slot') {
                queueMicrotask(() => {
                    throw new Error(`Assigning a <lume-scene> to a slot (slot="${newVal}") is not currently supported and may not work as expected. Instead, wrap the <lume-scene> in another element like a <div>, then assign the wrapper to the slot.`);
                });
            }
        }
        makeThreeObject3d() {
            return new ThreeScene();
        }
        makeThreeCSSObject() {
            return new ThreeScene();
        }
        /**
         * @method traverseSceneGraph - This traverses the composed tree of LUME 3D
         * elements (the scene graph) not including the scene element, starting from
         * the scene's children, in pre-order. It skips non-LUME elements. The given
         * callback will be called for each element in the traversal.
         *
         * This is similar to
         * [`Element3D#traverseSceneGraph`](./Element3D.md#traversescenegraph) but traversal
         * does not include the Scene that this is called on, because a Scene is not
         * something that is rendered, but a container of things that are rendered.
         *
         * Example:
         *
         * ```js
         * scene.traverseSceneGraph(el => {
         *   console.log(scene === el) // never true
         *   console.log(el instanceof LUME.Element3D) // true
         * })
         * ```
         *
         * @param {(el: Element3D) => void} visitor - A function called for each
         * LUME element in the scene graph (the composed tree).
         * @param {boolean} waitForUpgrade - Defaults to `false`. If `true`,
         * the traversal will wait for custom elements to be defined (with
         * customElements.whenDefined) before traversing to them.
         * @returns {void | Promise<void>} - If `waitForUpgrade` is `false`,
         * the traversal will complete synchronously, and the return value will be
         * `undefined`. If `waitForUpgrade` is `true`, then traversal completes
         * asynchronously once all custom elements are defined, and a Promise is
         * returned so that it is possible to wait for the traversal to complete.
         */
        traverseSceneGraph(visitor, waitForUpgrade = false) {
            if (!waitForUpgrade) {
                for (const child of this.composedLumeChildren)
                    child.traverseSceneGraph(visitor, waitForUpgrade);
                return;
            }
            // if waitForUpgrade is true, we make a promise chain so that
            // traversal order is still the same as when waitForUpgrade is false.
            let promise = Promise.resolve();
            for (const child of this.composedLumeChildren) {
                const isUpgraded = child.matches(':defined');
                if (isUpgraded) {
                    promise = promise.then(() => child.traverseSceneGraph(visitor, waitForUpgrade));
                }
                else {
                    promise = promise
                        .then(() => customElements.whenDefined(child.tagName.toLowerCase()))
                        .then(() => child.traverseSceneGraph(visitor, waitForUpgrade));
                }
            }
            return promise;
        }
        _createDefaultCamera() {
            // Use untrack so this method is non-reactive.
            untrack(() => {
                const size = this.calculatedSize;
                // THREE-COORDS-TO-DOM-COORDS
                // We apply Three perspective the same way as CSS3D perspective here.
                // TODO CAMERA-DEFAULTS, get defaults from somewhere common.
                // TODO the "far" arg will be auto-calculated to encompass the furthest objects (like CSS3D).
                // TODO update with calculatedSize in autorun
                this.__defaultThreeCamera = this.__threeCamera = new ThreePerspectiveCamera(this.__perspectiveFov, size.x / size.y || 1, 0.1, 10000);
                this.__threeCamera.name = `${this.tagName}${this.id ? '#' + this.id : ''} DEFAULT CAMERA (webgl, ${this.__threeCamera.type})`;
                this.perspective = this.perspective;
            });
        }
        // This math is what sets the FOV of the default camera so that a
        // viewport-sized plane will fit exactly within the view when it is
        // positioned at the world origin 0,0,0, as described in the
        // `perspective` property's description.
        // For more details: https://discourse.threejs.org/t/269/28
        get __perspectiveFov() {
            return (180 * (2 * Math.atan(this.calculatedSize.y / 2 / this.perspective))) / Math.PI;
        }
        _updateCameraPerspective() {
            const perspective = this.perspective;
            if (!(this.__defaultThreeCamera instanceof ThreePerspectiveCamera))
                return;
            this.__defaultThreeCamera.fov = this.__perspectiveFov;
            this.__defaultThreeCamera.position.z = perspective;
        }
        _updateCameraAspect() {
            if (!(this.__defaultThreeCamera instanceof ThreePerspectiveCamera))
                return;
            this.__defaultThreeCamera.aspect = this.calculatedSize.x / this.calculatedSize.y || 1;
        }
        _updateCameraProjection() {
            if (!(this.__defaultThreeCamera instanceof ThreePerspectiveCamera))
                return;
            this.__defaultThreeCamera.updateProjectionMatrix();
        }
        // holds active cameras found in the DOM tree (if this is empty, it
        // means no camera elements are in the DOM, but this.#threeCamera
        // will still have a reference to the default camera that scenes
        // are rendered with when no camera elements exist).
        __activeCameras;
        _addCamera(camera) {
            if (!this.__activeCameras)
                this.__activeCameras = new Set();
            this.__activeCameras.add(camera);
            this.__setCamera(camera);
        }
        _removeCamera(camera) {
            if (!this.__activeCameras)
                return;
            this.__activeCameras.delete(camera);
            if (this.__activeCameras.size) {
                // get the last camera in the Set
                this.__activeCameras.forEach(c => (camera = c));
                this.__setCamera(camera);
            }
            else {
                this.__activeCameras = undefined;
                this.__setCamera();
            }
        }
        /**
         * @property {{x: number, y: number, z: number}} parentSize
         *
         * `override` `signal` `readonly`
         *
         * Overrides [`Sizeable.parentSize`](./Sizeable#parentSize) in order to return the size of a Scene's
         * non-LUME parent element where the scene is connected.
         * NOTE: `z` size of a non-LUME element is always `0`, since regular DOM
         * elements don't have the concept of Z size and are always flat.
         */
        get parentSize() {
            return this.composedLumeParent?.calculatedSize ?? this.__elementParentSize;
        }
        __setCamera(camera) {
            if (!camera) {
                this._createDefaultCamera();
                this.__camera = null;
            }
            else {
                // TODO?: implement an changecamera event/method and emit/call
                // that here, then move this logic to the renderer
                // handler/method?
                this.__defaultThreeCamera = null;
                this.__threeCamera = camera.three;
                this.__camera = camera;
                this._updateCameraAspect();
                this._updateCameraProjection();
                this.needsUpdate();
            }
        }
        // TODO move the following parent size change stuff to a separate re-usable class.
        // size of the element where the Scene is mounted
        __elementParentSize = __runInitializers(this, ___elementParentSize_initializers, { x: 0, y: 0, z: 0 });
        #resizeObserver = null;
        // observe size changes on the scene's parent (it may not be a LUME element,
        // so we observe with ResizeObserver).
        #startParentSizeObservation() {
            // TODO The only way to make composedParent reactive even for non-LUME
            // composed parents without polling is with a combination of monkey
            // patching attachShadow and using MutationObserver in all trees to
            // observe slot elements for slotchange.
            // https://github.com/WICG/webcomponents/issues/941
            // TODO NESTED SCENES In the future, we will want to distinguish between Element3D and
            // regular elements, and we will only need size observation with regular
            // elements.
            const parent = /*not reactive*/ this.composedParent;
            // This shouldn't be possible.
            // @prod-prune
            if (!parent)
                throw new Error('A Scene can only be child of HTMLElement or ShadowRoot (f.e. not an SVGElement).');
            // TODO use a single ResizeObserver for all scenes.
            this.#resizeObserver = new ResizeObserver(changes => {
                for (const change of changes) {
                    // Use the newer API if available.
                    // NOTE We care about the contentBoxSize (not the
                    // borderBoxSize) because the content box is the area in
                    // which we're rendering visuals.
                    if (change.contentBoxSize) {
                        // If change.contentBoxSize is an array with more than one
                        // item, it means the observed element is split across
                        // multiple CSS columns. But not all browsers support the Array
                        // form yet (f.e. Firefox) so fallback in that case:
                        const contentBoxSize = change.contentBoxSize[0] || change.contentBoxSize;
                        // TODO If the Scene is used as display:inline{-block},
                        // ensure that it is the size of the column in which it is
                        // located. For now, we only grab the first item in the
                        // array, assuming that the Scene in not used inside a
                        // layout with columns.
                        const { inlineSize, blockSize } = contentBoxSize;
                        const isHorizontal = getComputedStyle(parent).writingMode.includes('horizontal');
                        // If the text writing mode is horizontal, then inlinSize is
                        // the width, otherwise in vertical writing mode it is the height.
                        // For more details: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize#Syntax
                        if (isHorizontal)
                            this.#checkElementParentSize(inlineSize, blockSize);
                        else
                            this.#checkElementParentSize(blockSize, inlineSize);
                    }
                    // Otherwise use the older API (possibly polyfilled)
                    else {
                        const { width, height } = change.contentRect;
                        this.#checkElementParentSize(width, height);
                    }
                }
            });
            this.#resizeObserver.observe(parent);
        }
        #stopParentSizeObservation() {
            this.#resizeObserver?.disconnect();
            this.#resizeObserver = null;
        }
        // NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
        // we haven't taken that into consideration here.
        #checkElementParentSize(x, y) {
            const parentSize = this.__elementParentSize;
            // if we have a size change
            if (parentSize.x != x || parentSize.y != y) {
                parentSize.x = x;
                parentSize.y = y;
                this.__elementParentSize = parentSize;
            }
        }
        template = () => html `
		<div class="container">
			<div
				ref=${(el) => (this._cssLayer = el)}
				class="CSS3DLayer"
				style=${() => (this.swapLayers ? 'z-index: 1' : '')}
			>
				${
        /* WebGLRendererThree places the CSS3DRendererNested domElement
        here, which contains a <slot> element that child elements of
        a Scene are distributed into (rendered relative to).
        */ ''}
			</div>

			<div ref=${(el) => (this._glLayer = el)} class="WebGLLayer">
				${ /* WebGLRendererThree places the Three.js <canvas> element here. */''}
			</div>

			<div ref=${(el) => (this._miscLayer = el)} class="MiscellaneousLayer">
				${ /* This layer is used by WebXR to insert UI like the Enter VR/AR button. */''}
				<slot name="misc"></slot>
			</div>
		</div>
	`;
        static css = /*css*/ `
		${Reflect.get(_classSuper, "css", _classThis)}

		:host {
			/*
			 * A Scene is strict: it does not leak content, its rendering is not
			 * affected by external layout, and its size is not affected by its
			 * content. It is an absolutely contained drawing area.
			 */
			contain: size layout paint; /*fallback, TODO remove once Safari is caught up*/
			contain: strict; /*override*/
			overflow: hidden;

			/* Prevent default browser behaviors like drag-and-drop to avoid pointercancel interfering with interaction features. */
			touch-action: none;
		}

		/* The purpose of this is to contain the position:absolute layers so they don't break out of the Scene layout. */
		.container {
			position: relative
		}

		.container,
		.CSS3DLayer,
		.MiscellaneousLayer,
		.WebGLLayer,
		.WebGLLayer > canvas  {
			margin: 0; padding: 0;
			width: 100%; height: 100%;
			display: block;
		}

		.CSS3DLayer,
		.MiscellaneousLayer,
		.WebGLLayer {
			/* make sure all layers are stacked on top of each other */
			position: absolute; top: 0; left: 0;
		}

		.CSS3DLayer {
			transform-style: preserve-3d;
		}

		.container {
			pointer-events: none;
		}

		.MiscellaneousLayer > * {
			/* Allow children of the Misc layer to have pointer events.	Needed for the WebXR button, for example */
			pointer-events: auto;
		}

		/*
		 * This trick is needed in Firefox to remove pointer events from the
		 * transparent cameraElement from interfering with pointer events on the
		 * scene objects. We do not wish to interact with this element anyway, as
		 * it serves only for positioning the view.
		 */
		.cameraElement > * {
			pointer-events: auto;
		}

		.vrButton {
			color: black;
			border-color: black;
		}
	`;
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return Scene = _classThis;
})();
export { Scene };
// Put initial value on the prototype to make it available during construction
// in a super() call.
// @ts-ignore
Scene.prototype.isScene = true;
//# sourceMappingURL=Scene.js.map