import 'element-behaviors'
import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'

export class BoxGeometryBehavior extends GeometryBehavior {
	override _createComponent() {
		return new BoxGeometry(
			this.element.calculatedSize.x,
			this.element.calculatedSize.y,
			this.element.calculatedSize.z,
		)
	}
}

if (!elementBehaviors.has('box-geometry')) elementBehaviors.define('box-geometry', BoxGeometryBehavior)
