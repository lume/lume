import 'element-behaviors'
import {PlaneGeometry} from 'three/src/geometries/PlaneGeometry.js'
import {BaseGeometryBehavior} from './BaseGeometryBehavior.js'

export class PlaneGeometryBehavior extends BaseGeometryBehavior {
	_createComponent() {
		return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y)
	}
}

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)
