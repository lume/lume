import 'element-behaviors'
import {PlaneGeometry} from 'three/src/geometries/PlaneGeometry'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default class PlaneGeometryBehavior extends BaseGeometryBehavior {
	protected _createComponent() {
		return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y)
	}
}

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)

export {PlaneGeometryBehavior}
