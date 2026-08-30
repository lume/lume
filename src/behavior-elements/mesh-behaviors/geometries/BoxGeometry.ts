import {BoxGeometry as ThreeBoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {element, type ElementAttributes} from '@lume/element'
import {GeometryBehaviorEl} from './GeometryBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type BoxGeometryAttributes = never

/**
 * @class BoxGeometry -
 *
 * Element: `<lume-box-geometry>`
 *
 * @extends GeometryBehaviorEl
 * @element lume-box-geometry
 */
export
@element('lume-box-geometry', autoDefineElements)
class BoxGeometry extends GeometryBehaviorEl {
	override _createComponent() {
		return new ThreeBoxGeometry(
			this.composedParent!.calculatedSize.x,
			this.composedParent!.calculatedSize.y,
			this.composedParent!.calculatedSize.z,
		)
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-box-geometry': ElementAttributes<BoxGeometry, BoxGeometryAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-box-geometry': BoxGeometry
	}
}
