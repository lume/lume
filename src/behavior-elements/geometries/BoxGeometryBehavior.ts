import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {element} from '@lume/element'
import {GeometryBehavior} from './GeometryBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

/**
 * @class BoxGeometryBehavior -
 *
 * Element: `box-geometry`
 *
 * @extends GeometryBehavior
 * @element box-geometry
 */
export
@element('box-geometry', autoDefineElements)
class BoxGeometryBehavior extends GeometryBehavior {
	override _createComponent() {
		return new BoxGeometry(
			this.parentElement!.calculatedSize.x, 
			this.parentElement!.calculatedSize.y, 
			this.parentElement!.calculatedSize.z
		)
	}
}