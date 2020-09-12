import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'
import {Color} from 'three/src/math/Color'
import {reactive, attribute, autorun, numberAttribute, booleanAttribute, StopFunction} from '@lume/element'

// base class for geometry behaviors
@reactive
export default class BaseMaterialBehavior extends BaseMeshBehavior {
	type: MeshComponentType = 'material'

	// TODO wireframe works with -geometry behaviors, but not with obj-model
	// because obj-model doesn't inherit from geometry. We should share common
	// props like wireframe...
	@reactive @booleanAttribute(false) wireframe = false

	@reactive @numberAttribute(1) opacity = 1

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

	protected static _observedProperties = ['color', 'opacity', ...(BaseMeshBehavior._observedProperties || [])]

	private __stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.__stopFns.push(
			autorun(() => {
				this.wireframe
				this.updateMaterial('wireframe')
			}),
			autorun(() => {
				this.color
				this.updateMaterial('color')
			}),
			autorun(() => {
				this.opacity
				this.updateMaterial('opacity')
				this.updateMaterial('transparent')
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
