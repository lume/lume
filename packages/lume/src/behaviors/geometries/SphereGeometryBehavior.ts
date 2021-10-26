import 'element-behaviors'
import {SphereGeometry} from 'three/src/geometries/SphereGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'

export class SphereGeometryBehavior extends GeometryBehavior {
	_createComponent() {
		return new SphereGeometry(this.element.calculatedSize.x / 2, 32, 32)
	}
}

if (!elementBehaviors.has('sphere-geometry')) elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)
