import {Color} from 'three/src/math/Color.js'
import {DoubleSide, FrontSide, BackSide, Side} from 'three/src/constants.js'
import {reactive, autorun, numberAttribute, booleanAttribute, StopFunction, stringAttribute} from '@lume/element'
import {MeshBehavior, MeshComponentType} from '../MeshBehavior.js'

import type {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'

export type BaseMaterialBehaviorAttributes = 'wireframe' | 'opacity' | 'sidedness' | 'color'

/** @class BaseMaterialBehavior - Base class for material behaviors. */
@reactive
export class MaterialBehavior extends MeshBehavior {
	type: MeshComponentType = 'material'

	static _observedProperties = [
		'wireframe',
		'opacity',
		'sidedness',
		'color',
		...(MeshBehavior._observedProperties || []),
	]

	// TODO wireframe works with -geometry behaviors, but not with obj-model
	// because obj-model doesn't inherit from geometry. We should share common
	// props like wireframe...
	@booleanAttribute(false) wireframe = false

	@numberAttribute(1) opacity = 1

	/**
	 * @property {'front' | 'back' | 'double'} sidedness - Whether to render
	 * one side or the other of any polygons, or both sides.  If the side that
	 * isn't rendered is facing towards the camera, the polygon will be
	 * invisible. Use "both" if you want the polygons to always be visible no
	 * matter which side faces the camera.
	 */
	@stringAttribute('front') sidedness: 'front' | 'back' | 'double' = 'front'

	@stringAttribute('deeppink')
	get color(): string | number | Color {
		return this.#color
	}
	set color(val: string | number | Color) {
		val = val ?? ''
		if (typeof val === 'string') this.#color.set(val)
		else if (typeof val === 'number') this.#color.set(val)
		else this.#color = val
	}

	#color = new Color('deeppink')

	get transparent(): boolean {
		if (this.opacity < 1) return true
		else return false
	}

	_stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this._stopFns.push(
			autorun(() => {
				this.wireframe
				this.updateMaterial('wireframe')
			}),
			autorun(() => {
				this.opacity
				this.updateMaterial('opacity')
				// @ts-ignore see FIXME regarding F-Bounded Types in PointsMaterialBehavior.
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

		for (const stop of this._stopFns) stop()
		this._stopFns.length = 0

		return true
	}

	updateMaterial<Prop extends BaseMaterialBehaviorAttributes>(propName: Prop, thisProp: keyof this = propName) {
		const mat = this.element.three.material as any

		// TODO Better taxonomy organization. F.e. ShaderMaterial doesn't have
		// a 'color' prop, but it has the others that we've enabled to far.

		if (Array.isArray(mat)) {
			for (const m of mat) {
				// @ts-ignore
				m[propName] = this[thisProp]
			}
		} else {
			// @ts-ignore
			mat[propName] = this[thisProp]
		}

		this.element.needsUpdate()
	}
}
