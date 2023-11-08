var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { untrack } from 'solid-js';
import html from 'solid-js/html';
import { booleanAttribute, attribute, numberAttribute, element, stringAttribute, reactive } from '@lume/element';
import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Color } from 'three/src/math/Color.js';
import { Fog } from 'three/src/scenes/Fog.js';
import { FogExp2 } from 'three/src/scenes/FogExp2.js';
import { WebglRendererThree } from '../renderers/WebglRendererThree.js';
import { Css3dRendererThree } from '../renderers/Css3dRendererThree.js';
import { SharedAPI } from './SharedAPI.js';
import { isDisposable } from '../utils/three.js';
import { Motor } from './Motor.js';
import { autoDefineElements } from '../LumeConfig.js';
import { version } from '../index.js';
const magic = () => ` LUME ✨ v${version} 👉 https://github.com/lume/lume `;
queueMicrotask(() => console.info(magic()));
let Scene = class Scene extends SharedAPI {
    isScene = true;
    skipShadowObservation = this.isScene;
    enableCss = true;
    webgl = false;
    swapLayers = false;
    shadowmapType = 'basic';
    vr = false;
    backgroundColor = new Color('white');
    backgroundOpacity = 0;
    background = null;
    equirectangularBackground = false;
    environment = null;
    fogMode = 'none';
    fogNear = 0;
    fogFar = 1000;
    fogColor = 'gray';
    fogDensity = 0.0025;
    physicallyCorrectLights = false;
    cameraNear = 0.1;
    cameraFar = 10000;
    set perspective(value) {
        this.#perspective = value;
        this._updateCameraPerspective();
        this._updateCameraProjection();
        this.needsUpdate();
    }
    get perspective() {
        return this.#perspective;
    }
    #perspective = 400;
    get threeCamera() {
        return this.__threeCamera;
    }
    __threeCamera;
    get camera() {
        return this.__camera;
    }
    get glRenderer() {
        return this.#glRenderer?.sceneStates.get(this)?.renderer;
    }
    get cssRenderer() {
        return this.#cssRenderer?.sceneStates.get(this)?.renderer;
    }
    __camera = null;
    __localClipping = false;
    constructor() {
        super();
        this._scene = this;
        this.sizeMode.set('proportional', 'proportional', 'literal');
        this.size.set(1, 1, 0);
        this._elementOperations.shouldRender = true;
        this._createDefaultCamera();
        this._calcSize();
        this.needsUpdate();
    }
    _glLayer = null;
    _cssLayer = null;
    _miscLayer = null;
    drawScene() {
        this.#glRenderer && this.#glRenderer.drawScene(this);
        this.#cssRenderer && this.#cssRenderer.drawScene(this);
    }
    connectedCallback() {
        super.connectedCallback();
        queueMicrotask(() => this.shadowRoot.prepend(new Comment(magic())));
        this.createEffect(() => {
            if (this.webgl)
                this._triggerLoadGL();
            else
                this._triggerUnloadGL();
            this.needsUpdate();
        });
        this.createEffect(() => {
            if (!this.webgl || !this.background) {
                if (isDisposable(this.three.background))
                    this.three.background.dispose();
                this.#glRenderer?.disableBackground(this);
                this.needsUpdate();
                return;
            }
            if (this.background.match(/\.(jpg|jpeg|png)$/)) {
                if (isDisposable(this.three.background))
                    this.three.background.dispose();
                this.#glRenderer.disableBackground(this);
                this.#glRenderer.enableBackground(this, this.equirectangularBackground, texture => {
                    this.three.background = texture || null;
                    this.needsUpdate();
                });
            }
            else {
                console.warn(`<${this.tagName.toLowerCase()}> background attribute ignored, the given image type is not currently supported.`);
            }
        });
        this.createEffect(() => {
            if (!this.webgl || !this.environment) {
                if (isDisposable(this.three.environment))
                    this.three.environment.dispose();
                this.#glRenderer?.disableEnvironment(this);
                this.needsUpdate();
                return;
            }
            if (this.environment.match(/\.(jpg|jpeg|png)$/)) {
                if (isDisposable(this.three.environment))
                    this.three.environment.dispose();
                this.#glRenderer.disableEnvironment(this);
                this.#glRenderer.enableEnvironment(this, texture => {
                    this.three.environment = texture;
                    this.needsUpdate();
                });
            }
            else {
                console.warn(`<${this.tagName.toLowerCase()}> environment attribute ignored, the given image type is not currently supported.`);
            }
        });
        this.createEffect(() => {
            if (this.enableCss)
                this._triggerLoadCSS();
            else
                this._triggerUnloadCSS();
            this.needsUpdate();
        });
        this.createEffect(() => {
            this.sizeMode;
            this.#startOrStopParentSizeObservation();
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#stopParentSizeObservation();
    }
    static observedAttributes = ['slot'];
    attributeChangedCallback(name, oldV, newV) {
        super.attributeChangedCallback(name, oldV, newV);
        if (name === 'slot') {
            queueMicrotask(() => {
                throw new Error('Assigning a <lume-scene> to a slot is not currently supported and may not work as expected. Instead, wrap the <lume-scene> in another element like a <div>, then assign the wrapper to the slot.');
            });
        }
    }
    makeThreeObject3d() {
        return new ThreeScene();
    }
    makeThreeCSSObject() {
        return new ThreeScene();
    }
    traverseSceneGraph(visitor, waitForUpgrade = false) {
        if (!waitForUpgrade) {
            for (const child of this.composedLumeChildren)
                child.traverseSceneGraph(visitor, waitForUpgrade);
            return;
        }
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
        untrack(() => {
            const size = this.calculatedSize;
            this.__threeCamera = new ThreePerspectiveCamera(45, size.x / size.y || 1, 0.1, 10000);
            this.__threeCamera.name = `${this.tagName}${this.id ? '#' + this.id : ''} DEFAULT CAMERA (webgl, ${this.__threeCamera.type})`;
            this.perspective = this.perspective;
        });
    }
    _updateCameraPerspective() {
        const perspective = this.#perspective;
        this.__threeCamera.fov = (180 * (2 * Math.atan(this.calculatedSize.y / 2 / perspective))) / Math.PI;
        this.__threeCamera.position.z = perspective;
    }
    _updateCameraAspect() {
        this.__threeCamera.aspect = this.calculatedSize.x / this.calculatedSize.y || 1;
    }
    _updateCameraProjection() {
        this.__threeCamera.updateProjectionMatrix();
    }
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
            this.__activeCameras.forEach(c => (camera = c));
            this.__setCamera(camera);
        }
        else {
            this.__activeCameras = undefined;
            this.__setCamera();
        }
    }
    get parentSize() {
        return this.composedLumeParent?.calculatedSize ?? this.__elementParentSize;
    }
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.three.autoUpdate = false;
        this.three.matrixWorldAutoUpdate = false;
        this.#glRenderer = this.#getGLRenderer('three');
        this.createGLEffect(() => {
            if (this.fogMode === 'none') {
                this.three.fog = null;
            }
            else if (this.fogMode === 'linear') {
                this.three.fog = new Fog('deeppink');
            }
            else if (this.fogMode === 'expo2') {
                this.three.fog = new FogExp2(new Color('deeppink').getHex());
            }
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            if (this.fogMode === 'none') {
            }
            else if (this.fogMode === 'linear') {
                const fog = this.three.fog;
                fog.near = this.fogNear;
                fog.far = this.fogFar;
                fog.color.set(this.fogColor);
            }
            else if (this.fogMode === 'expo2') {
                const fog = this.three.fog;
                fog.color.set(this.fogColor);
                fog.density = this.fogDensity;
            }
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.#glRenderer.localClippingEnabled = this.__localClipping;
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.#glRenderer.setClearColor(this, this.backgroundColor, this.backgroundOpacity);
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.#glRenderer.setClearAlpha(this, this.backgroundOpacity);
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.#glRenderer.setShadowMapType(this, this.shadowmapType);
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.#glRenderer.setPhysicallyCorrectLights(this, this.physicallyCorrectLights);
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.#glRenderer.enableVR(this, this.vr);
            if (this.vr) {
                console.log('set vr frame requester!');
                Motor.setFrameRequester(fn => {
                    this.#glRenderer.requestFrame(this, fn);
                    return 0;
                });
                const button = this.#glRenderer.createDefaultVRButton(this);
                button.classList.add('vrButton');
                this._miscLayer.appendChild(button);
            }
            else if (this.xr) {
            }
            else {
            }
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.__threeCamera.near = this.cameraNear;
            this.__threeCamera.far = this.cameraFar;
            this.needsUpdate();
        });
        this.traverseSceneGraph((el) => el._triggerLoadGL(), true);
        return true;
    }
    _unloadGL() {
        if (!super._unloadGL())
            return false;
        if (this.#glRenderer) {
            this.#glRenderer.uninitialize(this);
            this.#glRenderer = null;
        }
        this.traverseSceneGraph((el) => el._triggerUnloadGL());
        {
            this.three.environment?.dispose();
            if (isDisposable(this.three.background))
                this.three.background.dispose();
        }
        return true;
    }
    _loadCSS() {
        if (!super._loadCSS())
            return false;
        this.#cssRenderer = this.#getCSSRenderer('three');
        this.traverseSceneGraph((el) => el._loadCSS(), true);
        return true;
    }
    _unloadCSS() {
        if (!super._unloadCSS())
            return false;
        if (this.#cssRenderer) {
            this.#cssRenderer.uninitialize(this);
            this.#cssRenderer = null;
        }
        this.traverseSceneGraph((el) => el._unloadCSS());
        return true;
    }
    #glRenderer = null;
    #cssRenderer = null;
    #getGLRenderer(type) {
        if (this.#glRenderer)
            return this.#glRenderer;
        let renderer;
        if (type === 'three')
            renderer = WebglRendererThree.singleton();
        else
            throw new Error('invalid WebGL renderer');
        renderer.initialize(this);
        return renderer;
    }
    #getCSSRenderer(type) {
        if (this.#cssRenderer)
            return this.#cssRenderer;
        let renderer;
        if (type === 'three')
            renderer = Css3dRendererThree.singleton();
        else
            throw new Error('invalid CSS renderer. The only type supported is currently "three" (i.e. Three.js).');
        renderer.initialize(this);
        return renderer;
    }
    __setCamera(camera) {
        if (!camera) {
            this._createDefaultCamera();
            this.__camera = null;
        }
        else {
            this.__threeCamera = camera.three;
            this.__camera = camera;
            this._updateCameraAspect();
            this._updateCameraProjection();
            this.needsUpdate();
        }
    }
    __elementParentSize = { x: 0, y: 0, z: 0 };
    #startOrStopParentSizeObservation() {
        const { x, y } = this.sizeMode;
        if ((this.enableCss || this.webgl) &&
            (x === 'proportional' || x === 'p' || y === 'proportional' || y === 'p')) {
            this.#startParentSizeObservation();
        }
        else {
            this.#stopParentSizeObservation();
        }
    }
    #resizeObserver = null;
    #startParentSizeObservation() {
        const parent = this.composedParent;
        if (!parent)
            throw new Error('A Scene can only be child of HTMLElement or ShadowRoot (f.e. not an SVGElement).');
        this.#resizeObserver = new ResizeObserver(changes => {
            for (const change of changes) {
                if (change.contentBoxSize) {
                    const contentBoxSize = change.contentBoxSize[0] || change.contentBoxSize;
                    const { inlineSize, blockSize } = contentBoxSize;
                    const isHorizontal = getComputedStyle(parent).writingMode.includes('horizontal');
                    if (isHorizontal)
                        this.#checkElementParentSize(inlineSize, blockSize);
                    else
                        this.#checkElementParentSize(blockSize, inlineSize);
                }
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
    #checkElementParentSize(x, y) {
        const parentSize = this.__elementParentSize;
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
				${''}
			</div>

			<div ref=${(el) => (this._glLayer = el)} class="WebGLLayer">
				${''}
			</div>

			<div ref=${(el) => (this._miscLayer = el)} class="MiscellaneousLayer">
				${''}
				<slot name="misc"></slot>
			</div>
		</div>
	`;
    static css = `
		${super.css}

		:host {
			/*
			 * A Scene is strict: it does not leak content, its rendering is not
			 * affected by external layout, and its size is not affected by its
			 * content. It is an absolutely contained drawing area.
			 */
			contain: size layout paint; /*fallback, TODO remove once Safari is caught up*/
			contain: strict; /*override*/
			overflow: hidden;
			position: static; /*override*/
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
};
__decorate([
    booleanAttribute(true)
], Scene.prototype, "enableCss", void 0);
__decorate([
    booleanAttribute(false)
], Scene.prototype, "webgl", void 0);
__decorate([
    booleanAttribute(false)
], Scene.prototype, "swapLayers", void 0);
__decorate([
    attribute
], Scene.prototype, "shadowmapType", void 0);
__decorate([
    booleanAttribute(false)
], Scene.prototype, "vr", void 0);
__decorate([
    attribute
], Scene.prototype, "backgroundColor", void 0);
__decorate([
    numberAttribute(0)
], Scene.prototype, "backgroundOpacity", void 0);
__decorate([
    attribute
], Scene.prototype, "background", void 0);
__decorate([
    booleanAttribute(false)
], Scene.prototype, "equirectangularBackground", void 0);
__decorate([
    attribute
], Scene.prototype, "environment", void 0);
__decorate([
    stringAttribute('none')
], Scene.prototype, "fogMode", void 0);
__decorate([
    numberAttribute(0)
], Scene.prototype, "fogNear", void 0);
__decorate([
    numberAttribute(1000)
], Scene.prototype, "fogFar", void 0);
__decorate([
    stringAttribute('gray')
], Scene.prototype, "fogColor", void 0);
__decorate([
    numberAttribute(0.0025)
], Scene.prototype, "fogDensity", void 0);
__decorate([
    booleanAttribute(false)
], Scene.prototype, "physicallyCorrectLights", void 0);
__decorate([
    numberAttribute(0.1)
], Scene.prototype, "cameraNear", void 0);
__decorate([
    numberAttribute(10000)
], Scene.prototype, "cameraFar", void 0);
__decorate([
    numberAttribute(400)
], Scene.prototype, "perspective", null);
__decorate([
    reactive
], Scene.prototype, "__camera", void 0);
__decorate([
    reactive
], Scene.prototype, "__localClipping", void 0);
__decorate([
    reactive
], Scene.prototype, "__elementParentSize", void 0);
Scene = __decorate([
    element('lume-scene', autoDefineElements)
], Scene);
export { Scene };
Scene.prototype.isScene = true;
//# sourceMappingURL=Scene.js.map