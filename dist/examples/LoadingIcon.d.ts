/**
 * @class LoadingIcon - A `<loading-icon>` element useful for an initial loading
 * animation while assets are loading. The element has no dependencies, so it
 * can be imported directly quickly on its own to add into a web app as soon as
 * possible while other modules are still being fetched.
 *
 * ## Live Example
 *
 * Hit "Rerun" to see the loading icon again.
 *
 * <live-code src="../../examples/skateboard-configurator/example.html"></live-code>
 * <script>
 *   // A small hack to scale the size of the demo to make it easier to view inside the live-code preview.
 *   const livecode = document.querySelector('live-code')
 *
 *   const iframe = livecode.shadowRoot.querySelector('iframe')
 *   iframe.style.width = "200%"
 *   iframe.style.height = "200%"
 *
 *   const preview = livecode.shadowRoot.querySelector('.live-code-preview')
 *   preview.style.overflow = 'hidden'
 *
 *   requestAnimationFrame(function loop() {
 *     if (iframe.contentWindow.document?.body) {
 *       iframe.contentWindow.document.body.style.transformOrigin = 'top left'
 *       iframe.contentWindow.document.body.style.scale = 0.5
 *     }
 *     requestAnimationFrame(loop)
 *   })
 * </script>
 *
 * ## Usage:
 *
 * ```html
 * <!-- In your HTML file (or HTML payload), place the element: -->
 * <loading-icon id="loading"></loading-icon>
 *
 * <!-- Pass options via CSS vars, and postion the icon where needed. -->
 * <style>
 *   loading-icon {
 *       --loading-icon-color: 55, 71, 134;
 *       --loading-icon-outer-radius: 70px;
 *
 *       position: absolute;
 *       top: 50%;
 *       left: 50%;
 *       transform: translate(-50%, -50%);
 *   }
 *
 *   .hidden {display: none;}
 * </style>
 *
 * <!-- Start main content hidden until we are ready to show it. -->
 * <div id="mainContent" class="hidden">
 * </div>
 *
 * <!-- Import the definition file *directly and on its own*, so that it will
 * load as soon as possible while everything else is still loading. -->
 * <script>
 *   import('lume/dist/examples/LoadingIcon.js')
 * </script>
 *
 * <!-- Run other code as usual, *separately* from the LoadingIcon import. -->
 * <script type="module">
 *   import stuff from 'somewhere'
 *   import moreStuff from 'elsewhere'
 *
 *   // Finally remove the loading icon once things are loaded.
 *   // Implement custom logic to detect when your assets are done loading,
 *   // then remove the icon (this depends on your app, you might
 *   // need to use other APIs to detect when assets are done loading,
 *   // this is only an example!)
 *   window.onload = () => {
 *     document.getElementById('loading').remove()
 *     document.getElementById('mainContent').classList.remove('hidden')
 *   }
 * </script>
 * ```
 *
 * ## CSS Properties
 *
 * ### `--loading-icon-color`
 *
 * A string with an RGB triplet, comma separated.
 *
 * Default: `120,130,140`
 *
 * ### `--loading-icon-outer-radius`
 *
 * The outer size of the icon.
 *
 * Default: `20px`
 *
 * ### `--loading-icon-inner-radius`
 *
 * The size of the inner hole.
 *
 * Default: `calc(0.7 * var(--loading-icon-outer-radius))`
 *
 * @extends HTMLElement
 */
export declare class LoadingIcon extends HTMLElement {
    connectedCallback(): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'loading-icon': JSX.HTMLAttributes<LoadingIcon>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'loading-icon': LoadingIcon;
    }
}
//# sourceMappingURL=LoadingIcon.d.ts.map