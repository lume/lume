/**
 * @class LoadEvent - This event is fired when on an element (f.e.
 * `<lume-gltf-model>`) when it has loaded it's 3D content from an asset file.
 * It serves the same purpose as `load` events for built-in elements such as
 * `<img>`, `<script>`, `<iframe>`, etc, to notify when an element has loaded
 * whatever it loads.
 *
 * The loaded model will be accessible on the element's `.threeModel` property.
 *
 * Example (plain HTML):
 *
 * ```html
 * <lume-scene>
 *   <lume-gltf-model id="rocket" src="./rocket-ship.gltf"></lume-gltf-model>
 * </lume-scene>
 *
 * <script type="module">
 *   import 'lume'
 *
 *   const el = document.getElementById('rocket')
 *
 *   el.addEventListener('load', event => console.log('model loaded:', el.threeModel))
 * </script>
 * ```
 *
 * While the `load` event is usable, the `.threeModel` property is a Solid
 * signal, and it is recommended to use a Solid effect to observe its value:
 *
 * ```html
 * <script type="module">
 *   // createEffect is re-exported from Solid.js
 *   import {createEffect} from 'lume'
 *
 *   const el = document.getElementById('rocket')
 *
 *   createEffect(() => console.log('model:', el.threeModel))
 * </script>
 * ```
 *
 * Example (React JSX):
 *
 * ```jsx
 * function SomeReactComponent() {
 *   const threeModel = useRef()
 *
 *   useEffect(() => console.log('model:', threeModel.current), [threeModel.current])
 *
 *   return (
 *     <lume-scene>
 *       <lume-gltf-model
 *         src="./rocket-ship.gltf"
 *         // In React we must use the load event to wire the value to the ref:
 *         onload=${event => console.log('model loaded:', threeModel.current = event.target.threeModel)}}
 *       ></lume-gltf-model>
 *     </lume-scene>
 *   )
 * }
 * ```
 *
 * Example (Solid JSX):
 *
 * ```jsx
 * function SomeSolidComponent() {
 *   let el
 *
 *   createEffect(() => console.log('model:', el.threeModel))
 *
 *   return (
 *     <lume-scene>
 *       <lume-gltf-model
 *         ref={el}
 *         src="./rocket-ship.gltf"
 *         // The event is not needed in Solid like it is in React, but for
 *         // sake of example it is usable:
 *         onload=${event => console.log('model loaded:', el.threeModel)}}
 *       ></lume-gltf-model>
 *     </lume-scene>
 *   )
 * }
 * ```
 *
 * Example (Lit, replace `@@` with a signle ampersand which is a small hack for rendering the docs markdown from JSDoc comments):
 *
 * ```js
 * class SomeLitElement {
 *   render() {
 *     return html`
 *       <lume-scene>
 *         <lume-gltf-model
 *           src="./rocket-ship.gltf"
 *           @@load=${event => console.log('model loaded:', event.target.threeModel)}}
 *         ></lume-gltf-model>
 *       </lume-scene>
 *     `
 *   }
 * }
 * ```
 *
 * @extends Event
 */
export class LoadEvent extends Event {
    static type = 'load';
    static defaultOptions = { cancelable: false, bubbles: false };
    constructor(options = {}) {
        super('load', { ...LoadEvent.defaultOptions, ...options });
    }
}
//# sourceMappingURL=LoadEvent.js.map