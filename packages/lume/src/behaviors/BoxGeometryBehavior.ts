import 'element-behaviors'
import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {BaseGeometryBehavior} from './BaseGeometryBehavior.js'

export class BoxGeometryBehavior extends BaseGeometryBehavior {
	_createComponent() {
		return new BoxGeometry(
			this.element.calculatedSize.x,
			this.element.calculatedSize.y,
			this.element.calculatedSize.z,
		)
	}
}

if (!elementBehaviors.has('box-geometry')) elementBehaviors.define('box-geometry', BoxGeometryBehavior)
