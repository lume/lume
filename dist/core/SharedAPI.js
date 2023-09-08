var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SharedAPI_1;
import { untrack } from 'solid-js';
import { reactive, element, attribute } from '@lume/element';
import { Object3D } from 'three/src/core/Object3D.js';
import { Transformable } from './Transformable.js';
import { ElementOperations } from './ElementOperations.js';
import { Motor } from './Motor.js';
import { CSS3DObjectNested } from '../renderers/CSS3DRendererNested.js';
import { disposeObject } from '../utils/three.js';
import { Events } from './Events.js';
import { Settable } from '../utils/Settable.js';
import { toRadians } from './utils/index.js';
import { ChildTracker } from './ChildTracker.js';
import { DefaultBehaviors } from '../behaviors/DefaultBehaviors.js';
import { isDomEnvironment, isElement3D, isScene } from './utils/isThisOrThat.js';
import { Effectful } from './Effectful.js';
const threeJsPostAdjustment = [0, 0, 0];
const alignAdjustment = [0, 0, 0];
const mountPointAdjustment = [0, 0, 0];
const appliedPosition = [0, 0, 0];
const elOps = new WeakMap();
const ourThreeObjects = new WeakSet();
const isManagedByUs = (obj) => ourThreeObjects.has(obj);
class GLEffects extends Effectful(Object) {
}
class CSSEffects extends Effectful(Object) {
}
const opacity = new WeakMap();
let SharedAPI = SharedAPI_1 = class SharedAPI extends DefaultBehaviors(ChildTracker(Settable(Transformable))) {
    static define(name) {
        this.defineElement(name);
    }
    isScene = false;
    isElement3D = false;
    set opacity(newValue) {
        if (!opacity.has(this))
            opacity.set(this, 1);
        this._setPropertySingle('opacity', v => opacity.set(this, v), newValue);
    }
    get opacity() {
        if (!opacity.has(this))
            opacity.set(this, 1);
        return opacity.get(this);
    }
    get glLoaded() {
        return this._glLoaded;
    }
    get cssLoaded() {
        return this._cssLoaded;
    }
    _scene = null;
    get scene() {
        return this._scene;
    }
    __three;
    get three() {
        if (!this.__three)
            this.__three = this.__makeThreeObject3d();
        return this.__three;
    }
    __makeThreeObject3d() {
        const o = this.makeThreeObject3d();
        o.name = `${this.tagName}${this.id ? '#' + this.id : ''} (webgl, ${o.type})`;
        ourThreeObjects.add(o);
        return o;
    }
    __disposeThree() {
        if (!this.__three)
            return;
        disposeObject(this.__three);
        ourThreeObjects.delete(this.__three);
        this.__three = undefined;
    }
    recreateThree() {
        const children = this.__three?.children;
        this.__disposeThree();
        this.__connectThree();
        if (children && children.length)
            this.three.add(...children);
    }
    __threeCSS;
    get threeCSS() {
        if (!this.__threeCSS)
            this.__threeCSS = this.__makeThreeCSSObject();
        return this.__threeCSS;
    }
    __makeThreeCSSObject() {
        const o = this.makeThreeCSSObject();
        o.name = `${this.tagName}${this.id ? '#' + this.id : ''} (css3d, ${o.type})`;
        ourThreeObjects.add(o);
        return o;
    }
    __disposeThreeCSS() {
        if (!this.__threeCSS)
            return;
        disposeObject(this.__threeCSS);
        ourThreeObjects.delete(this.__threeCSS);
        this.__threeCSS = undefined;
    }
    recreateThreeCSS() {
        const children = this.__threeCSS?.children;
        this.__disposeThreeCSS();
        this.__connectThreeCSS();
        if (children && children.length)
            this.threeCSS.add(...children);
    }
    connectedCallback() {
        super.connectedCallback();
        this.createEffect(() => {
            this.scene;
            this.sizeMode;
            this.size;
            untrack(() => {
                this._calcSize();
                this.needsUpdate();
            });
        });
        this.createEffect(() => {
            if (!this.scene)
                return;
            this.parentSize;
            untrack(() => {
                const { x, y, z } = this.sizeMode;
                if (x === 'proportional' ||
                    x === 'p' ||
                    y === 'proportional' ||
                    y === 'p' ||
                    z === 'proportional' ||
                    z === 'p') {
                    this._calcSize();
                }
            });
            this.needsUpdate();
        });
        this.createEffect(() => {
            this.position;
            this.rotation;
            this.scale;
            this.origin;
            this.alignPoint;
            this.mountPoint;
            this.opacity;
            this.needsUpdate();
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.__unloadThree(this);
        this._scene = null;
    }
    childComposedCallback(child, _compositionType) {
        if (!(child instanceof SharedAPI_1))
            return;
        this.needsUpdate();
        const scene = this._scene ?? (isScene(this) && this);
        if (scene)
            this.__giveSceneToChildrenAndLoadThree(child, scene);
    }
    childUncomposedCallback(child, _compositionType) {
        if (!(child instanceof SharedAPI_1))
            return;
        this.needsUpdate();
        if (this._scene) {
            child.traverseSceneGraph(el => {
                this.__unloadThree(el);
                el._scene = null;
            });
        }
    }
    __giveSceneToChildrenAndLoadThree(el, scene) {
        el.traverseSceneGraph(child => {
            if (el !== this)
                child._scene = scene;
            this.__loadThree(child);
        });
    }
    traverseSceneGraph(_visitor, _waitForUpgrade = false) {
        throw 'Element3D and Scene implement this';
    }
    __loadThree(el) {
        if (!isElement3D(el))
            return;
        el._triggerLoadGL();
        el._triggerLoadCSS();
    }
    __unloadThree(el) {
        if (!isElement3D(el))
            return;
        el._triggerUnloadGL();
        el._triggerUnloadCSS();
    }
    get parentLumeElement() {
        const parent = super.parentLumeElement;
        if (parent && !(parent instanceof SharedAPI_1))
            throw new TypeError('Parent must be type SharedAPI.');
        return parent;
    }
    needsUpdate() {
        if (!this.scene)
            return;
        this.__willBeRendered = true;
        Motor.needsUpdate(this);
    }
    _glLoaded = false;
    _cssLoaded = false;
    __willBeRendered = false;
    get _elementOperations() {
        if (!elOps.has(this))
            elOps.set(this, new ElementOperations(this));
        return elOps.get(this);
    }
    get composedLumeChildren() {
        const result = [];
        for (const child of super.composedLumeChildren)
            if (isElement3D(child))
                result.push(child);
        return result;
    }
    makeThreeObject3d() {
        return new Object3D();
    }
    makeThreeCSSObject() {
        if (!(this instanceof HTMLElement))
            throw 'API available only in DOM environment.';
        return new CSS3DObjectNested(this);
    }
    __connectThree() {
        this.composedSceneGraphParent?.three.add(this.three);
        for (const child of this.composedLumeChildren) {
            this.three.add(child.three);
        }
        this.needsUpdate();
    }
    __connectThreeCSS() {
        this.composedSceneGraphParent?.threeCSS.add(this.threeCSS);
        for (const child of this.composedLumeChildren) {
            this.threeCSS.add(child.threeCSS);
        }
        this.needsUpdate();
    }
    get composedLumeParent() {
        const result = super.composedLumeParent;
        if (!(result instanceof SharedAPI_1))
            return null;
        return result;
    }
    get composedSceneGraphParent() {
        const composedLumeParent = this.composedLumeParent;
        if (this.parentLumeElement?.isScene)
            return this.parentLumeElement;
        return composedLumeParent;
    }
    #glEffects = new GLEffects();
    createGLEffect(fn) {
        this.#glEffects.createEffect(fn);
    }
    #stopGLEffects() {
        this.#glEffects.stopEffects();
    }
    _loadGL() {
        if (!(this.scene && this.scene.webgl))
            return false;
        if (this._glLoaded)
            return false;
        const three = this.three;
        three.matrixAutoUpdate = false;
        this.__connectThree();
        this.needsUpdate();
        this._glLoaded = true;
        return true;
    }
    _unloadGL() {
        if (!this._glLoaded)
            return false;
        this.#stopGLEffects();
        this.__disposeThree();
        this.needsUpdate();
        this._glLoaded = false;
        return true;
    }
    #cssEffects = new CSSEffects();
    createCSSEffect(fn) {
        this.#cssEffects.createEffect(fn);
    }
    #stopCSSEffects() {
        this.#cssEffects.stopEffects();
    }
    _loadCSS() {
        if (!(this.scene && this.scene.enableCss))
            return false;
        if (this._cssLoaded)
            return false;
        const threeCSS = this.threeCSS;
        threeCSS.matrixAutoUpdate = false;
        this.__connectThreeCSS();
        this.needsUpdate();
        this._cssLoaded = true;
        return true;
    }
    _unloadCSS() {
        if (!this._cssLoaded)
            return false;
        this.#stopCSSEffects();
        this.__disposeThreeCSS();
        this.needsUpdate();
        this._cssLoaded = false;
        return true;
    }
    _triggerLoadGL() {
        if (!this._loadGL())
            return;
        this.emit(Events.BEHAVIOR_GL_LOAD, this);
        queueMicrotask(async () => {
            await null;
            await null;
            this.emit(Events.GL_LOAD, this);
        });
    }
    _triggerUnloadGL() {
        if (!this._unloadGL())
            return;
        this.emit(Events.BEHAVIOR_GL_UNLOAD, this);
        queueMicrotask(() => this.emit(Events.GL_UNLOAD, this));
    }
    _triggerLoadCSS() {
        if (!this._loadCSS())
            return;
        this.emit(Events.CSS_LOAD, this);
    }
    _triggerUnloadCSS() {
        if (!this._unloadCSS())
            return;
        this.emit(Events.CSS_UNLOAD, this);
    }
    _calculateMatrix() {
        const align = this.alignPoint;
        const mountPoint = this.mountPoint;
        const position = this.position;
        const origin = this.origin;
        const size = this.calculatedSize;
        threeJsPostAdjustment[0] = size.x / 2;
        threeJsPostAdjustment[1] = size.y / 2;
        threeJsPostAdjustment[2] = size.z / 2;
        const parentSize = this.parentSize;
        threeJsPostAdjustment[0] += -parentSize.x / 2;
        threeJsPostAdjustment[1] += -parentSize.y / 2;
        threeJsPostAdjustment[2] += -parentSize.z / 2;
        alignAdjustment[0] = parentSize.x * align.x;
        alignAdjustment[1] = parentSize.y * align.y;
        alignAdjustment[2] = parentSize.z * align.z;
        mountPointAdjustment[0] = size.x * mountPoint.x;
        mountPointAdjustment[1] = size.y * mountPoint.y;
        mountPointAdjustment[2] = size.z * mountPoint.z;
        appliedPosition[0] = position.x + alignAdjustment[0] - mountPointAdjustment[0];
        appliedPosition[1] = position.y + alignAdjustment[1] - mountPointAdjustment[1];
        appliedPosition[2] = position.z + alignAdjustment[2] - mountPointAdjustment[2];
        this.three.position.set(appliedPosition[0] + threeJsPostAdjustment[0], -(appliedPosition[1] + threeJsPostAdjustment[1]), appliedPosition[2] + threeJsPostAdjustment[2]);
        const childOfScene = this.composedSceneGraphParent?.isScene;
        if (childOfScene) {
            this.threeCSS.position.set(appliedPosition[0] + threeJsPostAdjustment[0], -(appliedPosition[1] + threeJsPostAdjustment[1]), appliedPosition[2] + threeJsPostAdjustment[2]);
        }
        else {
            this.threeCSS.position.set(appliedPosition[0], -appliedPosition[1], appliedPosition[2] + threeJsPostAdjustment[2]);
        }
        if (origin.x !== 0.5 || origin.y !== 0.5 || origin.z !== 0.5) {
            this.three.pivot.set(origin.x * size.x - size.x / 2, -(origin.y * size.y - size.y / 2), origin.z * size.z - size.z / 2);
            this.threeCSS.pivot.set(origin.x * size.x - size.x / 2, -(origin.y * size.y - size.y / 2), origin.z * size.z - size.z / 2);
        }
        else {
            this.three.pivot.set(0, 0, 0);
            this.threeCSS.pivot.set(0, 0, 0);
        }
        this.three.updateMatrix();
        this.threeCSS.updateMatrix();
    }
    _updateRotation() {
        const { x, y, z } = this.rotation;
        this.three.rotation.set(-toRadians(x), toRadians(y), -toRadians(z));
        const childOfScene = this.composedSceneGraphParent?.isScene;
        this.threeCSS.rotation.set((childOfScene ? -1 : 1) * toRadians(x), toRadians(y), (childOfScene ? -1 : 1) * toRadians(z));
    }
    _updateScale() {
        const { x, y, z } = this.scale;
        this.three.scale.set(x, y, z);
        this.threeCSS.scale.set(x, y, z);
    }
    version = 0;
    updateWorldMatrices(traverse = true) {
        this.three.updateWorldMatrix(false, false);
        for (const child of this.three.children)
            if (!isManagedByUs(child))
                child.updateMatrixWorld(true);
        this.threeCSS.updateWorldMatrix(false, false);
        for (const child of this.threeCSS.children)
            if (!isManagedByUs(child))
                child.updateMatrixWorld(true);
        if (traverse)
            this.traverseSceneGraph(n => n !== this && n.updateWorldMatrices(false), false);
        this.version++;
    }
    update(_timestamp, _deltaTime) {
        this._updateRotation();
        this._updateScale();
        this._calculateMatrix();
        this._elementOperations.applyProperties();
    }
    __getNearestAncestorThatShouldBeUpdated() {
        let composedSceneGraphParent = this.composedSceneGraphParent;
        while (composedSceneGraphParent) {
            if (composedSceneGraphParent.__willBeRendered)
                return composedSceneGraphParent;
            composedSceneGraphParent = composedSceneGraphParent.composedSceneGraphParent;
        }
        return null;
    }
    on(eventName, callback, context) {
        super.on(eventName, callback, context);
    }
    emit(eventName, data) {
        super.emit(eventName, data);
    }
    childConnectedCallback(child) {
        if (isElement3D(child)) {
            if (!this.isScene && this.__shadowRoot) {
                child.__isPossiblyDistributedToShadowRoot = true;
            }
            else {
                this.__triggerChildComposedCallback(child, 'actual');
            }
        }
        else if (child instanceof HTMLSlotElement) {
            child.addEventListener('slotchange', this.__onChildSlotChange);
            queueMicrotask(() => this.__handleDistributedChildren(child));
        }
    }
    childDisconnectedCallback(child) {
        if (isElement3D(child)) {
            if (!this.isScene && this.__shadowRoot) {
                child.__isPossiblyDistributedToShadowRoot = false;
            }
            else {
                this.__triggerChildUncomposedCallback(child, 'actual');
            }
        }
        else if (child instanceof HTMLSlotElement) {
            child.removeEventListener('slotchange', this.__onChildSlotChange, { capture: true });
            this.__handleDistributedChildren(child);
            this.__previousSlotAssignedNodes.delete(child);
        }
    }
    setAttribute(attr, value) {
        super.setAttribute(attr, value);
    }
    get _composedChildren() {
        if (!this.isScene && this.__shadowRoot) {
            return [
                ...this._distributedShadowRootChildren.filter(n => n instanceof SharedAPI_1),
                ...this._shadowRootChildren.filter(n => n instanceof SharedAPI_1),
            ];
        }
        else {
            return [
                ...[...(this.__distributedChildren || [])].filter(n => n instanceof SharedAPI_1),
                ...Array.from(this.children).filter((n) => n instanceof SharedAPI_1),
            ];
        }
    }
    static css = `
		:host {
			/*
			 * All items of the scene graph are hidden until they are mounted in
			 * a scene (this changes to display:block). This gets toggled
			 * between "none" and "block" by SharedAPI depending on if CSS
			 * rendering is enabled.
			 */
			display: none;

			/*
			Layout of a node's CSS rectangle is never affected by anything
			outside of it. We don't contain paint because CSS content can
			overflow if desired, or size because eventually we'll add natural
			sizing to let the node be sized by its content.
			*/
			contain: layout;

			/* TODO see how content-visibility affects CSS performance with nodes that are off-screen. */
			/* content-visibility: auto; implies contain:strict */

			box-sizing: border-box;
			position: absolute;
			top: 0;
			left: 0;

			/*
			 * Defaults to [0.5,0.5,0.5] (the Z axis doesn't apply for DOM
			 * elements, but does for 3D objects in WebGL that have any size
			 * along Z.)
			 */
			transform-origin: 50% 50% 0; /* default */

			transform-style: preserve-3d;

			/*
			 * Force anti-aliasing of 3D element edges using an invisible shadow.
			 * https://stackoverflow.com/questions/6492027
			 * Perhaps allow this to be configured with an antialiased attribute?
			 */
			/*box-shadow: 0 0 1px rgba(255, 255, 255, 0); currently is very very slow, https://crbug.com/1405629*/
		}
	`;
};
__decorate([
    attribute,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], SharedAPI.prototype, "opacity", null);
__decorate([
    reactive,
    __metadata("design:type", Object)
], SharedAPI.prototype, "_scene", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], SharedAPI.prototype, "_glLoaded", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], SharedAPI.prototype, "_cssLoaded", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], SharedAPI.prototype, "version", void 0);
SharedAPI = SharedAPI_1 = __decorate([
    element
], SharedAPI);
export { SharedAPI };
if (isDomEnvironment()) {
    globalThis.addEventListener('error', event => {
        const error = event.error;
        if (!error)
            return;
        if (/Illegal constructor/i.test(error.message)) {
            console.error(`
				One of the reasons the following error can happen is if a Custom
				Element is called with 'new' before being defined. Did you set
				window.$lume.autoDefineElements to false and then forget to call
				'LUME.defineElements()' or to call '.defineElement()' on
				individual Lume classes?  For other reasons, see:
				https://www.google.com/search?q=chrome%20illegal%20constructor
			`);
        }
    });
}
//# sourceMappingURL=SharedAPI.js.map