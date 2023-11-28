import {element} from '@lume/element'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {MeshAttributes} from './Mesh.js'

export type ShapeAttributes = MeshAttributes

/**
 * @class Shape - Allows creating a 2D shape that can be extruded.
 *
 * Element: `<lume-shape>`
 *
 * Default behaviors:
 *
 * - [`shape-geometry`](../behaviors/mesh-behaviors/geometries/ShapeGeometryBehavior.md)
 * - [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior.md)
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.code = shapesExample
 * </script>
 *
 * Inherits attribute properties from [`ShapeGeometryBehavior`](../behaviors/geometries/ShapeGeometryBehavior.md).
 *
 * @extends Mesh
 */
export
@element('lume-shape', autoDefineElements)
class Shape extends Mesh {
	static override defaultBehaviors = {
		'shape-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors, ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes} from '../index.js'

export interface Shape extends ElementWithBehaviors<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-shape': Shape
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-shape': JSX.IntrinsicElements['lume-mesh'] &
				ElementAttributes<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes>
		}
	}
}
