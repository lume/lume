import 'element-behaviors'
import {SphereGeometry} from 'three/src/geometries/SphereGeometry.js'
import BaseGeometryBehavior from './BaseGeometryBehavior.js'

export default class SphereGeometryBehavior extends BaseGeometryBehavior {
	_createComponent() {
		return new SphereGeometry(this.element.calculatedSize.x / 2, 32, 32)
	}
}

elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)

export {SphereGeometryBehavior}
