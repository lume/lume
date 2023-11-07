var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'element-behaviors';
import { createEffect, createMemo, onCleanup, untrack } from 'solid-js';
import { Box3 } from 'three/src/math/Box3.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { reactive, stringAttribute, booleanAttribute } from '../../attribute.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { disposeObjectTree } from '../../../utils/three.js';
import { Events } from '../../../core/Events.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
let FbxModelBehavior = class FbxModelBehavior extends RenderableBehavior {
    src = '';
    centerGeometry = false;
    loader;
    model;
    #version = 0;
    loadGL() {
        this.loader = new FBXLoader();
        this.createEffect(() => {
            const src = createMemo(() => this.src);
            const center = createMemo(() => this.centerGeometry);
            createEffect(() => {
                src();
                center();
                this.#version++;
                untrack(() => this.#loadModel());
                onCleanup(() => this.#cleanupModel());
            });
        });
    }
    unloadGL() {
        this.loader = undefined;
        this.#cleanupModel();
        this.#version++;
    }
    #cleanupModel() {
        if (this.model)
            disposeObjectTree(this.model);
        this.model = undefined;
    }
    #loadModel() {
        const { src } = this;
        const version = this.#version;
        if (!src)
            return;
        this.loader.load(src, model => version === this.#version && this.#setModel(model), progress => version === this.#version && this.element.emit(Events.PROGRESS, progress), error => version === this.#version && this.#onError(error));
    }
    #onError(error) {
        const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}". See the following error.`;
        console.warn(message);
        const err = error instanceof ErrorEvent && error.error ? error.error : error;
        console.error(err);
        this.element.emit(Events.MODEL_ERROR, err);
    }
    #setModel(model) {
        this.model = model;
        if (this.centerGeometry) {
            const box = new Box3();
            box.setFromObject(model);
            const center = new Vector3();
            box.getCenter(center);
            model.position.copy(center.negate());
        }
        this.element.three.add(model);
        this.element.emit(Events.MODEL_LOAD, { format: 'fbx', model });
        this.element.needsUpdate();
    }
};
__decorate([
    stringAttribute('')
], FbxModelBehavior.prototype, "src", void 0);
__decorate([
    booleanAttribute(false)
], FbxModelBehavior.prototype, "centerGeometry", void 0);
FbxModelBehavior = __decorate([
    reactive
], FbxModelBehavior);
export { FbxModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('fbx-model'))
    elementBehaviors.define('fbx-model', FbxModelBehavior);
//# sourceMappingURL=FbxModelBehavior.js.map