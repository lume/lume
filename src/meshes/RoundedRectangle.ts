import {element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes} from '../behaviors/index.js'
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/RoundedrectGeometry.js')

export type RoundedRectangleAttributes = MeshAttributes | RoundedRectangleGeometryBehaviorAttributes

/**
 * @class RoundedRectangle -
 *
 * Element: `<lume-rounded-rectangle>`
 *
 * Applies default behaviors of
 * [`<lume-roundedrect-geometry>`](../behavior-elements/mesh-behaviors/geometries/RoundedrectGeometry)
 * and
 * [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * The dimensions of the rounded rectangle are determined by the
 * [`size`](../core/Sizeable#size) of the element.
 *
 * @extends Mesh
 */
export
@element('lume-rounded-rectangle', autoDefineElements)
class RoundedRectangle extends Mesh {
	protected override _defaultGeometry = () => html`<lume-roundedrect-geometry></lume-roundedrect-geometry>`
}

export interface RoundedRectangle
	extends ElementWithBehaviors<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-rounded-rectangle': ElementAttributes<RoundedRectangle, RoundedRectangleAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-rounded-rectangle': RoundedRectangle
	}
}
