var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'element-behaviors';
import { createEffect, createMemo, onCleanup, untrack } from 'solid-js';
import { reactive, attribute, booleanAttribute, stringAttribute } from '../../attribute.js';
import { Scene } from 'three/src/scenes/Scene.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3 } from 'three/src/math/Box3.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { disposeObjectTree } from '../../../utils/three.js';
import { Events } from '../../../core/Events.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
const defaultDracoDecoder = 'https://www.gstatic.com/draco/v1/decoders/';
let dracoLoaders = new Map();
let GltfModelBehavior = class GltfModelBehavior extends RenderableBehavior {
    src = '';
    dracoDecoder = defaultDracoDecoder;
    centerGeometry = false;
    gltfLoader;
    model = null;
    #version = 0;
    loadGL() {
        this.gltfLoader = new GLTFLoader();
        this.createEffect(() => {
            const decoderPath = createMemo(() => this.dracoDecoder);
            createEffect(() => {
                if (!decoderPath())
                    return;
                const dracoLoader = getDracoLoader(decoderPath());
                this.gltfLoader.dracoLoader = dracoLoader;
                onCleanup(() => {
                    disposeDracoLoader(decoderPath());
                    this.gltfLoader.dracoLoader = null;
                });
            });
            const gltfPath = createMemo(() => this.src);
            const center = createMemo(() => this.centerGeometry);
            createEffect(() => {
                gltfPath();
                decoderPath();
                center();
                this.#version++;
                untrack(() => this.#loadModel());
                onCleanup(() => this.#cleanupModel());
            });
        });
    }
    unloadGL() {
        this.gltfLoader = undefined;
        this.#version++;
    }
    #cleanupModel() {
        if (this.model)
            disposeObjectTree(this.model.scene);
        this.model = null;
    }
    #loadModel() {
        const { src } = this;
        const version = this.#version;
        if (!src)
            return;
        this.gltfLoader.load(src, model => version == this.#version && this.#setModel(model), progress => version == this.#version && this.element.emit(Events.PROGRESS, progress), error => version == this.#version && this.#onError(error));
    }
    #onError(error) {
        const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}" and dracoDecoder "${this.dracoDecoder}". See the following error.`;
        console.warn(message);
        const err = error instanceof ErrorEvent && error.error ? error.error : error;
        console.error(err);
        this.element.emit(Events.MODEL_ERROR, err);
    }
    #setModel(model) {
        this.model = model;
        model.scene = model.scene || new Scene().add(...model.scenes);
        if (this.centerGeometry) {
            const box = new Box3();
            box.setFromObject(model.scene);
            const center = new Vector3();
            box.getCenter(center);
            model.scene.position.copy(center.negate());
        }
        this.element.three.add(model.scene);
        this.element.emit(Events.MODEL_LOAD, { format: 'gltf', model });
        this.element.needsUpdate();
    }
};
__decorate([
    attribute
], GltfModelBehavior.prototype, "src", void 0);
__decorate([
    stringAttribute(defaultDracoDecoder)
], GltfModelBehavior.prototype, "dracoDecoder", void 0);
__decorate([
    booleanAttribute(false)
], GltfModelBehavior.prototype, "centerGeometry", void 0);
GltfModelBehavior = __decorate([
    reactive
], GltfModelBehavior);
export { GltfModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('gltf-model'))
    elementBehaviors.define('gltf-model', GltfModelBehavior);
function getDracoLoader(url) {
    let dracoLoader;
    if (!dracoLoaders.has(url)) {
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(url);
        dracoLoaders.set(url, { count: 1, dracoLoader });
    }
    else {
        const ref = dracoLoaders.get(url);
        ref.count++;
        dracoLoader = ref.dracoLoader;
    }
    return dracoLoader;
}
function disposeDracoLoader(url) {
    if (!dracoLoaders.has(url))
        return;
    const ref = dracoLoaders.get(url);
    ref.count--;
    if (!ref.count) {
        ref.dracoLoader.dispose();
        dracoLoaders.delete(url);
    }
}
//# sourceMappingURL=GltfModelBehavior.js.map