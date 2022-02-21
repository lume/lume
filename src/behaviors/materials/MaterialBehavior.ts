import {Color} from 'three/src/math/Color.js'
import {DoubleSide, FrontSide, BackSide, Side} from 'three/src/constants.js'
import {Material} from 'three/src/materials/Material.js'
import {reactive, autorun, booleanAttribute, StopFunction, stringAttribute} from '@lume/element'
import {MeshBehavior, MeshComponentType} from '../MeshBehavior.js'

export type MaterialBehaviorAttributes = 'wireframe' | 'sidedness' | 'color'

/**
 * @class MaterialBehavior -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * Base class for material behaviors.
 */
@reactive
export class MaterialBehavior extends MeshBehavior {
	type: MeshComponentType = 'material'

	static _observedProperties = ['wireframe', 'sidedness', 'color', ...(MeshBehavior._observedProperties || [])]

	// TODO wireframe works with -geometry behaviors, but not with obj-model
	// because obj-model doesn't inherit from geometry. We should share common
	// props like wireframe...
	@booleanAttribute(false) wireframe = false

	/**
	 * @property {'front' | 'back' | 'double'} sidedness - Whether to render
	 * one side or the other of any polygons, or both sides.  If the side that
	 * isn't rendered is facing towards the camera, the polygon will be
	 * invisible. Use "both" if you want the polygons to always be visible no
	 * matter which side faces the camera.
	 */
	@stringAttribute('front') sidedness: 'front' | 'back' | 'double' = 'front'

	@stringAttribute('deeppink')
	get color(): Color {
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
		if (this.element.opacity < 1) return true
		else return false
	}

	// TODO material arrays are not handled. Any LUME elements have one material. If
	// a user make a subclass or provides a custom three objects with a material
	// array, we set properties onto each material, assuming they're all the same
	// type. Perhaps we need an HTML syntax for multiple materials on an element.
	get material(): Material {
		const mat = this.element.three.material

		if (Array.isArray(mat)) {
			throw new Error(
				'Unexpected material array. Instead of modifying elemeht.three.material, use element.three.add(obj) to add an object with multiple materials.',
			)
		}

		return mat
	}

	_stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		const mat = this.material

		// TODO Better taxonomy organization, no any types, to avoid the below
		// conditional checks.

		// Only some materials have wireframe.
		if ('wireframe' in mat) {
			this._stopFns.push(
				autorun(() => {
					this.wireframe
					this.updateMaterial(
						'wireframe' as any /* because the material must have wireframe here */,
						this.wireframe,
					)
				}),
			)
		}

		if ('side' in mat) {
			this._stopFns.push(
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

					mat.side = side

					this.element.needsUpdate()
				}),
			)
		}

		if ('color' in mat) {
			this._stopFns.push(
				autorun(() => {
					this.color
					this.updateMaterial('color' as any, this.color)
				}),
			)
		}

		this._stopFns.push(
			autorun(() => {
				this.element.opacity
				this.updateMaterial('opacity', this.element.opacity)
				this.updateMaterial('transparent', this.transparent)
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

	override _createComponent(): Material {
		return new Material()
	}

	updateMaterial<Prop extends keyof this['material']>(propName: Prop, value: this['material'][Prop]) {
		const mat = this.material as this['material']
		mat[propName] = value
		this.element.needsUpdate()
	}
}
