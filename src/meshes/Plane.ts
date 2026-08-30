import {element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/PlaneGeometry.js')

export type PlaneAttributes = MeshAttributes

/**
 * @class Plane -
 *
 * Element: `<lume-plane>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`<lume-plane-geometry>`](../behavior-elements/mesh-behaviors/geometries/PlaneGeometry.md)
 * and
 * [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial.md).
 *
 * The dimensions of the plane are determined by the
 * [`size`](../core/Sizeable#size) of the element on `x` and `y`.
 *
 * @extends Mesh
 */
export
@element('lume-plane', autoDefineElements)
class Plane extends Mesh {
	protected override _defaultGeometry = () => html`<lume-plane-geometry></lume-plane-geometry>`
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-plane': ElementAttributes<Plane, PlaneAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-plane': Plane
	}
}
