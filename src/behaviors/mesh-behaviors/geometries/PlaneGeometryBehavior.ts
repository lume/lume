import 'element-behaviors'
import {PlaneGeometry} from 'three/src/geometries/PlaneGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'

export class PlaneGeometryBehavior extends GeometryBehavior {
	override _createComponent() {
		return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y)
	}
}

if (!elementBehaviors.has('plane-geometry')) elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)
