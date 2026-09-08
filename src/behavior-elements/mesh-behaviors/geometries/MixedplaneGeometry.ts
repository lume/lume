import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {element, type ElementAttributes} from '@lume/element'
import {GeometryBehaviorEl} from './GeometryBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type MixedplaneGeometryAttributes = never

/**
 * @class MixedPlaneGeometryBehavior -
 *
 * Element: `<lume-mixedplane-geometry>`
 *
 * Used as the geometry for [`<lume-mixed-plane>`](../../../meshes/MixedPlane)
 * elements. The planes are thin boxes instead of actually planes, otherwise
 * Three.js cannot currently cast shadows from plane geometries.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends GeometryBehaviorEl
 * @element lume-mixedplane-geometry
 */
export
@element('lume-mixedplane-geometry', autoDefineElements)
class MixedplaneGeometry extends GeometryBehaviorEl {
	override _createComponent() {
		// We have to use a BoxGeometry instead of a
		// PlaneGeometry because Three.js is not capable of
		// casting shadows from Planes, at least until we find
		// another way. Unfortunately, this increases polygon
		// count by a factor of 6. See issue
		// https://github.com/mrdoob/three.js/issues/9315
		return new BoxGeometry(this.composedParent!.calculatedSize.x, this.composedParent!.calculatedSize.y, 1)
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-mixedplane-geometry': ElementAttributes<MixedplaneGeometry, MixedplaneGeometryAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-mixedplane-geometry': MixedplaneGeometry
	}
}
