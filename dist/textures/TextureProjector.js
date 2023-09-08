var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { booleanAttribute, element, reactive, stringAttribute } from '@lume/element';
import { createEffect } from 'solid-js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
let TextureProjector = class TextureProjector extends Element3D {
    src = '';
    fitment = 'cover';
    frontFacesOnly = false;
    _camera = null;
    _loadGL() {
        if (!super._loadGL())
            return false;
        this._camera = new OrthographicCamera();
        this.three.add(this._camera);
        this.createGLEffect(() => {
            createEffect(() => {
                const size = this.calculatedSize;
                const cam = this._camera;
                if (cam instanceof OrthographicCamera) {
                    cam.left = -size.x / 2;
                    cam.right = size.x / 2;
                    cam.top = size.y / 2;
                    cam.bottom = -size.y / 2;
                }
                else {
                    cam.near = 1;
                    cam.far = 10000;
                    cam.aspect = 1;
                    cam.fov = 45;
                }
                cam.updateProjectionMatrix();
                this.needsUpdate();
            });
        });
        return true;
    }
    _unloadGL() {
        if (!super._unloadGL())
            return false;
        this.three.remove(this._camera);
        this._camera = null;
        return true;
    }
};
__decorate([
    stringAttribute(''),
    __metadata("design:type", Object)
], TextureProjector.prototype, "src", void 0);
__decorate([
    stringAttribute('cover'),
    __metadata("design:type", String)
], TextureProjector.prototype, "fitment", void 0);
__decorate([
    booleanAttribute(false),
    __metadata("design:type", Object)
], TextureProjector.prototype, "frontFacesOnly", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], TextureProjector.prototype, "_camera", void 0);
TextureProjector = __decorate([
    element('lume-texture-projector', autoDefineElements)
], TextureProjector);
export { TextureProjector };
//# sourceMappingURL=TextureProjector.js.map