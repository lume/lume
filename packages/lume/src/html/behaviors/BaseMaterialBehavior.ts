import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'
import {Color} from 'three/src/math/Color'
import {reactive, attribute, autorun, numberAttribute, booleanAttribute, StopFunction} from '@lume/element'
import {DoubleSide, FrontSide, BackSide, Side} from 'three/src/constants'

import type {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial'

/** @class BaseMaterialBehavior - Base class for material behaviors. */
@reactive
export default class BaseMaterialBehavior extends BaseMeshBehavior {
	type: MeshComponentType = 'material'

	protected static _observedProperties = [
		'wireframe',
		'opacity',
		'sidedness',
		'color',
		...(BaseMeshBehavior._observedProperties || []),
	]

	// TODO wireframe works with -geometry behaviors, but not with obj-model
	// because obj-model doesn't inherit from geometry. We should share common
	// props like wireframe...
	@reactive @booleanAttribute(false) wireframe = false

	@reactive @numberAttribute(1) opacity = 1

	/**
	 * @property {'front' | 'back' | 'double'} sidedness - Whether to render
	 * one side or the other of any polygons, or both sides.  If the side that
	 * isn't rendered is facing towards the camera, the polygon will be
	 * invisible. Use "both" if you want the polygons to always be visible no
	 * matter which side faces the camera.
	 */
	@reactive @attribute sidedness: 'front' | 'back' | 'double' = 'front'

	private __color = new Color('deeppink')

	@reactive
	@attribute
	get color(): string | number | Color {
		return this.__color
	}
	set color(val: string | number | Color) {
		val = val ?? ''
		if (typeof val === 'string') this.__color.set(val)
		else if (typeof val === 'number') this.__color.set(val)
		else this.__color = val
	}

	get transparent(): boolean {
		if (this.opacity < 1) return true
		else return false
	}

	private __stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.__stopFns.push(
			autorun(() => {
				this.wireframe
				this.updateMaterial('wireframe')
			}),
			autorun(() => {
				this.opacity
				this.updateMaterial('opacity')
				this.updateMaterial('transparent')
			}),
			autorun(() => {
				let side: Side

				switch (this.sidedness) {
					case 'front':
						side = FrontSide
						break
					case 'back':
						side = BackSide
						break
					case 'double':
						side = DoubleSide
						break
				}

				;(this.element.three.material as MeshPhongMaterial).side = side

				this.element.needsUpdate()
			}),
			autorun(() => {
				this.color
				this.updateMaterial('color')
			}),
		)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this.__stopFns) stop()

		return true
	}

	updateMaterial<Prop extends 'color' | 'opacity' | 'transparent' | 'wireframe'>(propName: Prop) {
		// TODO support Material[]
		;(this.element.three.material as any)[propName] = this[propName]

		this.element.needsUpdate()
	}
}

export {BaseMaterialBehavior}
