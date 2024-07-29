import { Element3D, type Element3DAttributes } from '../core/Element3D.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Collada } from 'three/examples/jsm/loaders/ColladaLoader.js';
import type { Group } from 'three/src/objects/Group.js';
import type { BufferGeometry } from 'three/src/core/BufferGeometry.js';
export type ModelAttributes = Element3DAttributes;
/**
 * @class Model - Base class for model elements that load 3D models from
 * various types of asset files (f.e. gltf, fbx, obj, etc).
 *
 * @extends Element3D
 */
export declare abstract class Model extends Element3D {
    addEventListener: <Key extends keyof ModelEvents>(type: Key, listener: (this: this, event: ModelEvents[Key]) => void, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener: <Key extends keyof ModelEvents>(type: Key, listener: (this: this, event: ModelEvents[Key]) => void, options?: boolean | AddEventListenerOptions) => void;
}
export type ModelType = 'obj' | 'gltf' | 'collada' | 'fbx' | 'ply' | '3ds';
export type ThreeModel = Group | GLTF | Collada | BufferGeometry;
interface ModelEvents extends HTMLElementEventMap {
    load: ModelLoadEvent;
}
/**
 * @class ModelLoadEvent - This event is fired by a `<lume-*-model>` element, or
 * a `<lume-element3d>` with a `*-model` behavior, when it has loaded it's 3D
 * content. It serves the same purpose as `load` events for elements such as
 * `<img>`, `<script>`, `<iframe>`, etc, to notify when an element has loaded
 * whatever it loads.
 *
 * The Event will expose `format`, a string containing the file type of the
 * loaded model (usually the file extension used for the model file, but not
 * always, for example a "gltf" model can be loaded from both a .gltf or a .glb
 * file, and a "collada" model is loaded from a .dae file), and `model` which is
 * the underlying model object loaded by Three.js for direct manipulation if
 * needed. The `format` values are 'obj', 'gltf', 'collada', 'fbx', 'ply', and
 * '3ds'.
 *
 * Example (plain HTML):
 *
 * ```html
 * <lume-scene>
 *   <lume-gltf-model id="rocket" src="./rocket-ship.gltf"></lume-gltf-model>
 * </lume-scene>
 *
 * <script>
 *   const el = document.getElementById('rocket')
 *   el.addEventListener('load', event => console.log('model loaded:', event.format, event.model))
 * </script>
 * ```
 *
 * Example (JSX):
 *
 * ```jsx
 * function SomeComponent() {
 *   return (
 *     <lume-scene>
 *       <lume-gltf-model
 *         src="./rocket-ship.gltf"
 *         onload=${event => console.log('model loaded:', event.format, event.model)}}
 *       ></lume-gltf-model>
 *     </lume-scene>
 *   )
 * }
 * ```
 */
export declare class ModelLoadEvent extends Event {
    static type: string;
    static defaultOptions: EventInit;
    format: ModelType;
    model: ThreeModel;
    constructor(format: ModelType, model: ThreeModel, options?: EventInit);
}
export {};
//# sourceMappingURL=Model.d.ts.map