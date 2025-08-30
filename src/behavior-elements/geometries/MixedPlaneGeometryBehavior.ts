import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {element} from '@lume/element'
import {GeometryBehavior} from './GeometryBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

/**
 * @class MixedPlaneGeometryBehavior -
 *
 * Element: `mixedplane-geometry`
 *
 * Used as the geometry for [`<lume-mixed-plane>`](../../../meshes/MixedPlane)
 * elements. The planes are thin boxes instead of actually planes, otherwise
 * Three.js cannot currently cast shadows from plane geometries.
 *
 * @extends GeometryBehavior
 * @element mixedplane-geometry
 */
export
@element('mixedplane-geometry', autoDefineElements)
class MixedPlaneGeometryBehavior extends GeometryBehavior {
	override _createComponent() {
		// We have to use a BoxGeometry instead of a
		// PlaneGeometry because Three.js is not capable of
		// casting shadows from Planes, at least until we find
		// another way. Unfortunately, this increases polygon
		// count by a factor of 6. See issue
		// https://github.com/mrdoob/three.js/issues/9315
		return new BoxGeometry(
			this.parentElement!.calculatedSize.x, 
			this.parentElement!.calculatedSize.y, 
			1
		)
	}
}