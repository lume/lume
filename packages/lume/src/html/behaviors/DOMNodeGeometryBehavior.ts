import 'element-behaviors'
import {BoxGeometry} from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default class DOMNodeGeometryBehavior extends BaseGeometryBehavior {
	protected _createComponent() {
		// We have to use a BoxGeometry instead of a
		// PlaneGeometry because Three.js is not capable of
		// casting shadows from Planes, at least until we find
		// another way. Unfortunately, this increases polygon
		// count by a factor of 6. See issue
		// https://github.com/mrdoob/three.js/issues/9315
		return new BoxGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, 1)
	}
}

elementBehaviors.define('domnode-geometry', DOMNodeGeometryBehavior)

export {DOMNodeGeometryBehavior}
