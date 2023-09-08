var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'element-behaviors';
import { reactive, stringAttribute } from '../../attribute.js';
import { ColladaLoader } from '../../../lib/three/examples/jsm/loaders/ColladaLoader.js';
import { disposeObjectTree } from '../../../utils/three.js';
import { Events } from '../../../core/Events.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
let ColladaModelBehavior = class ColladaModelBehavior extends RenderableBehavior {
    src = '';
    loader;
    model;
    #version = 0;
    loadGL() {
        this.loader = new ColladaLoader();
        this.createEffect(() => {
            this.src;
            this.#cleanupModel();
            this.#version++;
            this.#loadModel();
        });
    }
    unloadGL() {
        this.loader = undefined;
        this.#cleanupModel();
        this.#version++;
    }
    #cleanupModel() {
        if (this.model)
            disposeObjectTree(this.model.scene);
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
        this.element.three.add(model.scene);
        this.element.emit(Events.MODEL_LOAD, { format: 'collada', model });
        this.element.needsUpdate();
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], ColladaModelBehavior.prototype, "src", void 0);
ColladaModelBehavior = __decorate([
    reactive
], ColladaModelBehavior);
export { ColladaModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('collada-model'))
    elementBehaviors.define('collada-model', ColladaModelBehavior);
//# sourceMappingURL=ColladaModelBehavior.js.map