import 'element-behaviors'
import {PlaneGeometry} from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default class PlaneGeometryBehavior extends BaseGeometryBehavior {
	protected _createComponent() {
		return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y)
	}
}

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)

export {PlaneGeometryBehavior}
