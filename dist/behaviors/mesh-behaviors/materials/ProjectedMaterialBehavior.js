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
import { ProjectedMaterial } from '@lume/three-projected-material/dist/ProjectedMaterial.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { onCleanup, createEffect } from 'solid-js';
import { Texture } from 'three/src/textures/Texture.js';
import { stringAttribute, reactive } from '../../attribute.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
import { TextureProjector } from '../../../textures/TextureProjector.js';
let ProjectedMaterialBehavior = class ProjectedMaterialBehavior extends PhysicalMaterialBehavior {
    #projectedTextures = [];
    #rawProjectedTextures = [];
    get projectedTextures() {
        return this.#projectedTextures;
    }
    set projectedTextures(value) {
        this.#rawProjectedTextures = value;
        let array = [];
        if (typeof value === 'string') {
            array = [value.trim()];
        }
        else if (Array.isArray(value)) {
            array = value;
        }
        else {
            throw new TypeError('Invalid value for projectedTextures');
        }
        this.#projectedTextures = [];
        for (const v of array) {
            if (typeof v !== 'string') {
                if (v instanceof TextureProjector && v.scene)
                    this.#projectedTextures.push(v);
                continue;
            }
            let root = this.element.getRootNode();
            while (root) {
                const els = root.querySelectorAll(v);
                for (let i = 0, l = els.length; i < l; i += 1) {
                    const el = els.item(i);
                    if (!el)
                        continue;
                    if (el instanceof TextureProjector && el.scene)
                        this.#projectedTextures.push(el);
                }
                root = root instanceof ShadowRoot ? root.host.getRootNode() : null;
            }
        }
    }
    _createComponent() {
        return new ProjectedMaterial();
    }
    #observer = null;
    loadGL() {
        super.loadGL();
        let queuedRequery = false;
        this.#observer = new MutationObserver(() => {
            if (queuedRequery)
                return;
            queuedRequery = true;
            setTimeout(() => {
                queuedRequery = false;
                this.projectedTextures = this.#rawProjectedTextures;
            }, 0);
        });
        this.#observer.observe(this.element.getRootNode(), { childList: true, subtree: true });
        this._handleTexture(() => this.projectedTextures[0]?.src ?? '', (mat, tex) => (mat.texture = tex || new Texture()), mat => !!mat.texture, () => { }, true);
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            const three = this.element.three;
            if (three.material !== mat)
                return;
            createEffect(() => {
                const tex = this.projectedTextures[0];
                if (!tex)
                    return;
                createEffect(() => {
                    mat.fitment = tex.fitment;
                    mat.frontFacesOnly = tex.frontFacesOnly;
                    this.element.needsUpdate();
                });
            });
            createEffect(() => {
                const tex = this.projectedTextures[0];
                if (!tex)
                    return;
                const cam = tex._camera;
                if (!cam)
                    return;
                if (three.material !== mat)
                    return;
                mat.camera = cam;
                mat.updateFromCamera();
                mat.project(three, false);
                this.element.needsUpdate();
                onCleanup(() => {
                    const mat = this.meshComponent;
                    if (!mat)
                        return;
                    if (three.material !== mat)
                        return;
                    mat.camera = new OrthographicCamera(0.00000001, 0.00000001, 0.00000001, 0.00000001);
                    mat.updateFromCamera();
                    mat.project(three, false);
                    this.element.needsUpdate();
                });
            });
            createEffect(() => {
                const tex = this.projectedTextures[0];
                if (!tex)
                    return;
                createEffect(() => {
                    tex.calculatedSize;
                    mat.updateFromCamera();
                    this.element.needsUpdate();
                });
            });
            createEffect(() => {
                if (three.material !== mat)
                    return;
                this.element.version;
                mat.project(three, false);
            });
            createEffect(() => {
                console.log('> meshComponent effect', this.element.tagName + '#' + this.element.id);
                const tex = this.projectedTextures[0];
                if (!tex)
                    return;
                createEffect(() => {
                    if (three.material !== mat)
                        return;
                    tex.version;
                    mat.project(three, false);
                    this.element.needsUpdate();
                });
            });
        });
    }
    unloadGL() {
        super.unloadGL();
        this.#observer?.disconnect();
        this.#observer = null;
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ProjectedMaterialBehavior.prototype, "projectedTextures", null);
ProjectedMaterialBehavior = __decorate([
    reactive
], ProjectedMaterialBehavior);
export { ProjectedMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('projected-material'))
    elementBehaviors.define('projected-material', ProjectedMaterialBehavior);
//# sourceMappingURL=ProjectedMaterialBehavior.js.map