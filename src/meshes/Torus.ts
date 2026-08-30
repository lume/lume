import {element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {MeshAttributes} from './Mesh.js'
import type {ElementWithBehaviors, TorusGeometryBehavior, TorusGeometryBehaviorAttributes} from '../behaviors/index.js'
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/TorusGeometry.js')

export type TorusAttributes = MeshAttributes | TorusGeometryBehaviorAttributes

/**
 * @class Torus
 *
 * Element: `<lume-torus>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`<lume-torus-geometry>`](../behavior-elements/mesh-behaviors/geometries/TorusGeometry)
 * and
 * [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * @extends Mesh
 */
export
@element('lume-torus', autoDefineElements)
class Torus extends Mesh {
	protected override _defaultGeometry = () => html`<lume-torus-geometry></lume-torus-geometry>`
}

export interface Torus extends ElementWithBehaviors<TorusGeometryBehavior, TorusGeometryBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-torus': ElementAttributes<Torus, TorusAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-torus': Torus
	}
}
