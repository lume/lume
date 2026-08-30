import {element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {SphereGeometryBehavior, SphereGeometryBehaviorAttributes} from '../behaviors/index.js'
// Import this lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/SphereGeometry.js')

export type SphereAttributes = MeshAttributes

/**
 * @class Sphere -
 *
 * Element: `<lume-sphere>`
 *
 * Extends from `Mesh` to apply a default
 * [`<lume-sphere-geometry>`](../behavior-elements/mesh-behaviors/geometries/SphereGeometry).
 *
 * The diameter of the sphere is determined by the `x` size of the element.
 *
 * @extends Mesh
 */
export
@element('lume-sphere', autoDefineElements)
class Sphere extends Mesh {
	protected override _defaultGeometry = () => html`<lume-sphere-geometry></lume-sphere-geometry>`
}

export interface Sphere extends ElementWithBehaviors<SphereGeometryBehavior, SphereGeometryBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-sphere': ElementAttributes<Sphere, SphereAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-sphere': Sphere
	}
}
