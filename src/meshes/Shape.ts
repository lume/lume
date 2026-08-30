import {element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {MeshAttributes} from './Mesh.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes} from '../behaviors/index.js'
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/ShapeGeometry.js')

export type ShapeAttributes = MeshAttributes | ShapeGeometryBehaviorAttributes

/**
 * @class Shape - Allows creating a 2D shape that can be extruded.
 *
 * Element: `<lume-shape>`
 *
 * Default behaviors:
 *
 * - [`<lume-shape-geometry>`](../behavior-elements/mesh-behaviors/geometries/ShapeGeometry.md)
 * - [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial.md)
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = shapesExample
 * </script>
 *
 * @extends Mesh
 */
export
@element('lume-shape', autoDefineElements)
class Shape extends Mesh {
	protected override _defaultGeometry = () => html`<lume-shape-geometry></lume-shape-geometry>`
}

export interface Shape extends ElementWithBehaviors<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes> {}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-shape': ElementAttributes<Shape, ShapeAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-shape': Shape
	}
}
