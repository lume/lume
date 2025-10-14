import {attribute, element, type ElementAttributes} from '@lume/element'
import html from 'solid-js/html'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {MeshAttributes} from './Mesh.js'
import {Show} from 'solid-js'

export type BoxAttributes = MeshAttributes

/**
 * @class Box -
 *
 * Element: `<lume-box>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`box-geometry`](../behaviors/mesh-behaviors/geometries/SphereGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * The dimensions of the box are determined by the
 * [`size`](../core/Sizeable#size) of the element.
 *
 * @extends Mesh
 */
export
@element('lume-box', autoDefineElements)
class Box extends Mesh {
	// override initialBehaviors = {geometry: 'box', material: 'physical'}

	override hasShadow = true

	// Legacy behavior support: if the has attribute has values, disable the
	// behavior element slots, so that explicitly-defined legacy behaviors
	// continue to work and take precedence, for now.
	@attribute has = ''

	override template = () => html`
		<${Show} when=${!this.has}>
			<slot name="geometry">
				<box-geometry></box-geometry>
			</slot>

			<slot name="material">
				<physical-material></physical-material>
			</slot>
		</>

		<slot></slot>
	`
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-box': ElementAttributes<Box, BoxAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-box': Box
	}
}
