import { type ElementAttributes } from '@lume/element';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { Fitment } from '@lume/three-projected-material/dist/ProjectedMaterial';
import type { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
type TextureProjectorAttributes = Element3DAttributes | 'src' | 'fitment';
export declare class TextureProjector extends Element3D {
    src: string;
    fitment: Fitment;
    frontFacesOnly: boolean;
    _camera: PerspectiveCamera | OrthographicCamera | null;
    _loadGL(): boolean;
    _unloadGL(): boolean;
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-texture-projector': ElementAttributes<TextureProjector, TextureProjectorAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-texture-projector': TextureProjector;
    }
}
export {};
//# sourceMappingURL=TextureProjector.d.ts.map