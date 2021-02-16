import 'element-behaviors'
import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import BaseGeometryBehavior from './BaseGeometryBehavior.js'

export default class BoxGeometryBehavior extends BaseGeometryBehavior {
	protected _createComponent() {
		return new BoxGeometry(
			this.element.calculatedSize.x,
			this.element.calculatedSize.y,
			this.element.calculatedSize.z,
		)
	}
}

elementBehaviors.define('box-geometry', BoxGeometryBehavior)

export {BoxGeometryBehavior}
