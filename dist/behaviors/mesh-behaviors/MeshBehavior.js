var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { reactive } from '@lume/element';
import { RenderableBehavior } from '../RenderableBehavior.js';
import { Mesh } from '../../meshes/Mesh.js';
import { Points } from '../../meshes/Points.js';
import { InstancedMesh } from '../../meshes/InstancedMesh.js';
import { Line } from '../../meshes/Line.js';
let MeshBehavior = class MeshBehavior extends RenderableBehavior {
    requiredElementType() {
        return [Mesh, Points, InstancedMesh, Line];
    }
    _createComponent() {
        throw new Error('`_createComponent()` is not implemented by subclass.');
    }
    meshComponent = null;
};
__decorate([
    reactive
], MeshBehavior.prototype, "meshComponent", void 0);
MeshBehavior = __decorate([
    reactive
], MeshBehavior);
export { MeshBehavior };
//# sourceMappingURL=MeshBehavior.js.map