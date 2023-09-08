import { Object3DWithPivot } from '../core/Object3DWithPivot.js';
import type { Scene } from 'three/src/scenes/Scene.js';
import type { Camera } from 'three/src/cameras/Camera.js';
export declare class CSS3DObjectNested extends Object3DWithPivot {
    #private;
    element: HTMLElement;
    type: string;
    constructor(element: HTMLElement);
    dispose(): void;
}
export declare class CSS3DNestedSprite extends CSS3DObjectNested {
}
export declare class CSS3DRendererNested {
    #private;
    domElement: HTMLDivElement;
    constructor();
    getSize(): {
        width: number;
        height: number;
    };
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: Camera): void;
}
//# sourceMappingURL=CSS3DRendererNested.d.ts.map