import type { Mesh, Object3D } from 'three/src/Three.js';
import type { RenderItem } from 'three/src/renderers/webgl/WebGLRenderLists.js';
import type { Camera } from 'three/src/cameras/Camera.js';
import type { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import type { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
export declare const isMesh: (o: Object3D) => o is Mesh<import("three/src/Three.js").BufferGeometry<import("three/src/Three.js").NormalBufferAttributes>, import("three/src/Three.js").Material | import("three/src/Three.js").Material[], import("three/src/Three.js").Object3DEventMap>;
export declare function isRenderItem(obj: any): obj is RenderItem;
export declare function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera;
export declare function isOrthographicCamera(camera: Camera): camera is OrthographicCamera;
//# sourceMappingURL=is.d.ts.map