import 'element-behaviors';
import { ProjectedMaterial } from '@lume/three-projected-material/dist/ProjectedMaterial.js';
import { PhysicalMaterialBehavior, type PhysicalMaterialBehaviorAttributes } from './PhysicalMaterialBehavior.js';
import { TextureProjector } from '../../../textures/TextureProjector.js';
export type ProjectedMaterialBehaviorAttributes = PhysicalMaterialBehaviorAttributes | 'projectedTextures';
export declare class ProjectedMaterialBehavior extends PhysicalMaterialBehavior {
    #private;
    get projectedTextures(): Array<TextureProjector>;
    set projectedTextures(value: string | Array<TextureProjector | string>);
    _createComponent(): ProjectedMaterial;
    loadGL(): void;
    unloadGL(): void;
}
//# sourceMappingURL=ProjectedMaterialBehavior.d.ts.map