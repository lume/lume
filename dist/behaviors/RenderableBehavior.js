import { Effectful } from 'classy-solid';
import { Behavior } from './Behavior.js';
import { Events } from '../core/Events.js';
import { Element3D } from '../core/Element3D.js';
/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * Subclasses should provide loadGL and unloadGL methods in order to load or
 * unload WebGL resources when GL is enabled or disabled in a scene.
 *
 * @extends Behavior
 */
// @Xts-expect-error broken type checking in latest TypeScript (https://github.com/microsoft/TypeScript/issues/56330)
export class RenderableBehavior extends Effectful(Behavior) {
    requiredElementType() {
        return [Element3D];
    }
    connectedCallback() {
        super.connectedCallback();
        this.#triggerLoadGL();
        this.element.on(Events.BEHAVIOR_GL_LOAD, this.#triggerLoadGL, this);
        this.element.on(Events.BEHAVIOR_GL_UNLOAD, this.#triggerUnloadGL, this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#triggerUnloadGL();
        this.element.off(Events.BEHAVIOR_GL_LOAD, this.#triggerLoadGL, this);
        this.element.off(Events.BEHAVIOR_GL_UNLOAD, this.#triggerUnloadGL, this);
    }
    get glLoaded() {
        return this._glLoaded;
    }
    _glLoaded = false;
    get cssLoaded() {
        return this._cssLoaded;
    }
    _cssLoaded = false;
    #triggerLoadGL() {
        // .three will be undefined if an element is not upgraded yet.
        if (!this.element.three)
            return;
        if (this._glLoaded)
            return;
        this._glLoaded = true;
        this.loadGL();
        this.element.needsUpdate();
    }
    #triggerUnloadGL() {
        if (!this._glLoaded)
            return;
        this._glLoaded = false;
        this.stopEffects();
        this.unloadGL();
        this.element.needsUpdate();
    }
    // Subclasses override these
    loadGL() { }
    unloadGL() { }
}
//# sourceMappingURL=RenderableBehavior.js.map