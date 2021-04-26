import 'element-behaviors'
import {SphereGeometry} from 'three/src/geometries/SphereGeometry.js'
import {BaseGeometryBehavior} from './BaseGeometryBehavior.js'

export class SphereGeometryBehavior extends BaseGeometryBehavior {
	_createComponent() {
		return new SphereGeometry(this.element.calculatedSize.x / 2, 32, 32)
	}
}

if (!elementBehaviors.has('sphere-geometry')) elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)
