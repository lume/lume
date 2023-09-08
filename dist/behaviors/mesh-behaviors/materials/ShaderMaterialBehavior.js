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
import { reactive, attribute, stringAttribute } from '../../attribute.js';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
import default_vertex from 'three/src/renderers/shaders/ShaderChunk/default_vertex.glsl.js';
import default_fragment from 'three/src/renderers/shaders/ShaderChunk/default_fragment.glsl.js';
import { MaterialBehavior } from './MaterialBehavior.js';
import { untrack } from 'solid-js';
let ShaderMaterialBehavior = class ShaderMaterialBehavior extends MaterialBehavior {
    get uniforms() {
        return this.#uniforms;
    }
    set uniforms(u) {
        console.log('set uniforms', this.element.tagName, this.element.id, u);
        if (!u) {
            this.#uniforms = {};
            return;
        }
        if (typeof u === 'string') {
            try {
                this.#uniforms = JSON.parse(u);
            }
            catch (e) {
                console.warn('Unparsable uniform value:', u);
            }
        }
        else {
            this.#uniforms = u;
        }
    }
    #uniforms = {};
    vertexShader = default_vertex;
    fragmentShader = default_fragment;
    _createComponent() {
        return untrack(() => {
            return new ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
            });
        });
    }
    loadGL() {
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            mat.uniforms = this.uniforms;
            mat.vertexShader = this.vertexShader || default_vertex;
            mat.fragmentShader = this.fragmentShader || default_fragment;
            mat.needsUpdate = true;
            this.element.needsUpdate();
        });
        super.loadGL();
    }
};
__decorate([
    attribute,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ShaderMaterialBehavior.prototype, "uniforms", null);
__decorate([
    stringAttribute(default_vertex),
    __metadata("design:type", Object)
], ShaderMaterialBehavior.prototype, "vertexShader", void 0);
__decorate([
    stringAttribute(default_fragment),
    __metadata("design:type", Object)
], ShaderMaterialBehavior.prototype, "fragmentShader", void 0);
ShaderMaterialBehavior = __decorate([
    reactive
], ShaderMaterialBehavior);
export { ShaderMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('shader-material'))
    elementBehaviors.define('shader-material', ShaderMaterialBehavior);
//# sourceMappingURL=ShaderMaterialBehavior.js.map