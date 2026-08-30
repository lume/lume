import {element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/MixedplaneGeometry.js')
import('../behavior-elements/mesh-behaviors/materials/MixedplaneMaterial.js')

// TODO We need attributes from behaviors too.
export type MixedPlaneAttributes = MeshAttributes

/**
 * @class MixedPlane -
 *
 * Element: `<lume-mixed-plane>`
 *
 * This element is useful for rendering regular DOM content (`<div>`, `<img>`,
 * etc) mixed with WebGL content. Any regular DOM content placed as children of
 * this element will be visible in the 3D scene and can be occluded by 3D
 * elements as well as occlude other 3D elements.
 *
 * For best results, set the background of the DOM content to a solid color,
 * take up 100% width and height of the lume-mixed-plane element, and don't use
 * border radius (for now), otherwise transparent parts of the regular DOM
 * content will not receal 3D content that would be expected to be behind them.
 *
 * See [`<lume-mixed-plane-geometry>`](../behavior-elements/mesh-behaviors/geometries/MixedPlaneGeometry) and [`<lume-mixed-plane-material>`](../behavior-elements/mesh-behaviors/materials/MixedPlaneMaterial) for
 * available properties.
 *
 * <live-code src="../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends Mesh
 */
export
@element('lume-mixed-plane', autoDefineElements)
class MixedPlane extends Mesh {
	protected override _defaultGeometry = () => html`<lume-mixedplane-geometry></lume-mixedplane-geometry>`
	protected override _defaultMaterial = () => html`<lume-mixedplane-material></lume-mixedplane-material>`
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mixed-plane': ElementAttributes<MixedPlane, MixedPlaneAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-mixed-plane': MixedPlane
	}
}
