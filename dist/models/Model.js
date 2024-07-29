import { Element3D } from '../core/Element3D.js';
/**
 * @class Model - Base class for model elements that load 3D models from
 * various types of asset files (f.e. gltf, fbx, obj, etc).
 *
 * @extends Element3D
 */
export class Model extends Element3D {
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
export class ModelLoadEvent extends Event {
    static type = 'load';
    static defaultOptions = { cancelable: false, bubbles: false };
    format;
    model;
    constructor(format, model, options = ModelLoadEvent.defaultOptions) {
        super('load', { ...ModelLoadEvent.defaultOptions, ...options });
        this.format = format;
        this.model = model;
    }
}
//# sourceMappingURL=Model.js.map