import 'element-behaviors'
import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'

/**
 * @class MixedPlaneGeometryBehavior -
 *
 * Used as the geometry for [`<lume-mixed-plane>`](../../../meshes/MixedPlane)
 * elements. The planes are thin boxes instead of actually planes, otherwise
 * Three.js cannot currently cast shadows from plane geometries.
 *
 * <div id="mixedPlaneExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#mixedPlaneExample', data: { code: buttonsWithShadowExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends GeometryBehavior
 */
export class MixedPlaneGeometryBehavior extends GeometryBehavior {
	override _createComponent() {
		// We have to use a BoxGeometry instead of a
		// PlaneGeometry because Three.js is not capable of
		// casting shadows from Planes, at least until we find
		// another way. Unfortunately, this increases polygon
		// count by a factor of 6. See issue
		// https://github.com/mrdoob/three.js/issues/9315
		return new BoxGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, 1)
	}
}

if (!elementBehaviors.has('mixedplane-geometry'))
	elementBehaviors.define('mixedplane-geometry', MixedPlaneGeometryBehavior)
