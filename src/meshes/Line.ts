import {element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Line as ThreeLine} from 'three/src/objects/Line.js'
import {MeshLike} from './MeshLike.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {Element3DAttributes} from '../core/Element3D.js'
import type {ElementWithBehaviors} from '../behaviors/ElementWithBehaviors.js'
import type {
	ClipPlanesBehavior,
	ClipPlanesBehaviorAttributes,
	LineBasicMaterialBehavior,
	LineBasicMaterialBehaviorAttributes,
	LineGeometryBehavior,
	LineGeometryBehaviorAttributes,
} from '../behaviors/index.js'
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/LineGeometry.js')
import('../behavior-elements/mesh-behaviors/materials/BasiclineMaterial.js')

export type LineAttributes = Element3DAttributes | BehaviorAttributes

/**
 * @class Line - Renders a line based on a sequence of points.
 *
 * Element: `<lume-line>`
 *
 * Default behaviors:
 *
 * - [`<lume-line-geometry>`](../behavior-elements/mesh-behaviors/geometries/LineGeometry.md)
 * - [`<lume-basicline-material>`](../behavior-elements/mesh-behaviors/materials/BasiclineMaterial.md)
 *
 * It can be useful to have
 * [`<lume-ply-geometry>`](../behavior-elements/mesh-behaviors/geometries/PlyGeometry.md)
 * behavior on this element to load a set of points from a file.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = lineExample
 * </script>
 *
 * @extends MeshLike
 */
@element('lume-line', autoDefineElements)
export class Line extends MeshLike {
	protected override _defaultGeometry = () => html`<lume-line-geometry></lume-line-geometry>`
	protected override _defaultMaterial = () => html`<lume-basicline-material></lume-basicline-material>`

	override makeThreeObject3d() {
		return new ThreeLine()
	}
}

export interface Line extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {}

type BehaviorInstanceTypes = LineBasicMaterialBehavior & LineGeometryBehavior & ClipPlanesBehavior

type BehaviorAttributes =
	| LineBasicMaterialBehaviorAttributes
	| LineGeometryBehaviorAttributes
	| ClipPlanesBehaviorAttributes

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-line': ElementAttributes<Line, LineAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-line': Line
	}
}
