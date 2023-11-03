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
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { Events } from '../../../core/Events.js';
import { Points } from '../../../meshes/Points.js';
import { GeometryBehavior } from './GeometryBehavior.js';
let PlyGeometryBehavior = class PlyGeometryBehavior extends GeometryBehavior {
    src = '';
    loader = null;
    model = null;
    requiredElementType() {
        return [Points];
    }
    _createComponent() {
        if (!this.model)
            return new BufferGeometry();
        return this.model;
    }
    #version = 0;
    loadGL() {
        super.loadGL();
        this.loader = new PLYLoader();
        this.createEffect(() => {
            this.src;
            this.#cleanupModel();
            this.#version++;
            this.#loadModel();
        });
    }
    unloadGL() {
        this.loader = null;
        this.#cleanupModel();
        this.#version++;
    }
    #cleanupModel() {
        this.model = null;
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
        model.computeVertexNormals();
        this.model = model;
        this.element.emit(Events.MODEL_LOAD, { format: 'ply', model });
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], PlyGeometryBehavior.prototype, "src", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], PlyGeometryBehavior.prototype, "model", void 0);
PlyGeometryBehavior = __decorate([
    reactive
], PlyGeometryBehavior);
export { PlyGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('ply-geometry'))
    elementBehaviors.define('ply-geometry', PlyGeometryBehavior);
//# sourceMappingURL=PlyGeometryBehavior.js.map