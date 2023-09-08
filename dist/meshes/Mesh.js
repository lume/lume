var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Mesh as ThreeMesh } from 'three/src/objects/Mesh.js';
import { booleanAttribute, element } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
let Mesh = class Mesh extends Element3D {
    static defaultBehaviors = {
        'box-geometry': (initialBehaviors) => {
            return !initialBehaviors.some(b => b.endsWith('-geometry'));
        },
        'phong-material': (initialBehaviors) => {
            return !initialBehaviors.some(b => b.endsWith('-material'));
        },
    };
    castShadow = true;
    receiveShadow = true;
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.createGLEffect(() => {
            this.three.castShadow = this.castShadow;
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.three.receiveShadow = this.receiveShadow;
            this.three.material.needsUpdate = true;
            this.needsUpdate();
        });
        return true;
    }
    makeThreeObject3d() {
        return new ThreeMesh();
    }
};
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], Mesh.prototype, "castShadow", void 0);
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], Mesh.prototype, "receiveShadow", void 0);
Mesh = __decorate([
    element('lume-mesh', autoDefineElements)
], Mesh);
export { Mesh };
//# sourceMappingURL=Mesh.js.map