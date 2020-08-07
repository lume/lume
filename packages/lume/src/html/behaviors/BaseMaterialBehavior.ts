import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'
// import {props} from '../../core/props'
import {Color, MeshPhongMaterial} from 'three'
import {reactive, attribute, autorun} from '@lume/element'

// base class for geometry behaviors
export default class BaseMaterialBehavior extends BaseMeshBehavior {
	type: MeshComponentType = 'material'

	__color = new Color('deeppink')

	@reactive
	@attribute
	get color(): string | number | Color {
		return this.__color
	}
	set color(val: string | number | Color) {
		if (typeof val === 'string') this.__color.set(val)
		else if (typeof val === 'number') this.__color.set(val)
		else this.__color = val
	}

	@reactive @attribute opacity = 1

	get transparent(): boolean {
		if (this.opacity < 1) return true
		else return false
	}

	protected static _observedProperties = ['color', 'opacity']

	loadGL() {
		if (!super.loadGL()) return false

		autorun(() => {
			this.color
			this.updateMaterial('color')
		})

		autorun(() => {
			this.opacity
			this.updateMaterial('opacity')
			this.updateMaterial('transparent')
		})

		return true
	}

	updateMaterial(propName: 'color' | 'opacity' | 'transparent') {
		// The following type casting isn't type safe, but we can't type
		// everything we can do in JavaScript. It at leat shows our intent, but
		// swap "color" with "opacity", "transparent", etc.
		// TODO support Material[]
		;(this.element.three.material as MeshPhongMaterial)[propName as 'color'] = this[
			propName
		] as MeshPhongMaterial['color']

		this.element.needsUpdate()
	}
}

export {BaseMaterialBehavior}
