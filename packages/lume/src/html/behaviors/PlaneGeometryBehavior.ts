import 'element-behaviors'
import {PlaneGeometry} from 'three/src/geometries/PlaneGeometry.js'
import BaseGeometryBehavior from './BaseGeometryBehavior.js'

export default class PlaneGeometryBehavior extends BaseGeometryBehavior {
	protected _createComponent() {
		return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y)
	}
}

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)

export {PlaneGeometryBehavior}
