import { Color } from 'three/src/math/Color.js';
import { Material } from 'three/src/materials/Material.js';
import { GeometryOrMaterialBehavior } from '../GeometryOrMaterialBehavior.js';
import type { MeshComponentType } from '../MeshBehavior.js';
import type { Texture } from 'three';
export declare type MaterialBehaviorAttributes = 'alphaTest' | 'colorWrite' | 'depthTest' | 'depthWrite' | 'dithering' | 'wireframe' | 'sidedness' | 'color' | 'materialOpacity';
export declare class MaterialBehavior extends GeometryOrMaterialBehavior {
    #private;
    type: MeshComponentType;
    alphaTest: number;
    colorWrite: boolean;
    depthTest: boolean;
    depthWrite: boolean;
    dithering: boolean;
    fog: boolean;
    wireframe: boolean;
    sidedness: 'front' | 'back' | 'double';
    materialOpacity: number;
    get color(): Color;
    set color(val: string | number | Color);
    get transparent(): boolean;
    loadGL(): void;
    _createComponent(): Material;
    _handleTexture(textureUrl: () => string, setTexture: (mat: NonNullable<this['meshComponent']>, t: Texture | null) => void, hasTexture: (mat: NonNullable<this['meshComponent']>) => boolean, onLoad?: () => void, isColor?: boolean): void;
}
//# sourceMappingURL=MaterialBehavior.d.ts.map