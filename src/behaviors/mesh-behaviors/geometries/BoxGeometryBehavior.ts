import 'element-behaviors'
import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'

/**
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-box-geometry>` child elements instead. Legacy behaviors will be removed in a future version.
 */
export class BoxGeometryBehavior extends GeometryBehavior {
	override _createComponent() {
		return new BoxGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, this.element.calculatedSize.z)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('box-geometry'))
	elementBehaviors.define('box-geometry', BoxGeometryBehavior)
