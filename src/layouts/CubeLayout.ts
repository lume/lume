import {element, ElementAttributes} from '@lume/element'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import {XYZNonNegativeValues} from '../xyz-values/XYZNonNegativeValues.js'
import {XYZNumberValues} from '../xyz-values/XYZNumberValues.js'

export type CubeLayoutAttributes = Element3DAttributes

/**
 * @extends Element3D
 * @class CubeLayout -
 *
 * Element: `<lume-cube-layout>`
 *
 * A layout in which layout slots are six sides of a cube, facing outwards.
 *
 * Slots:
 *
 * - `front` - The front face of the cube layout.
 * - `back` - The back face of the cube layout.
 * - `left` - The left face of the cube layout.
 * - `right` - The right face of the cube layout.
 * - `top` - The top face of the cube layout.
 * - `bottom` - The bottom face of the cube layout.
 * - Default: The default slot is a catch-all for all other children, so they behave the same as children of a node without a shadow tree.
 */
// This class is written imperatively, as opposed to declaratively, for sake of
// example. It would be cleaner written declaratively, but it's not a big class.
@element('lume-cube-layout', autoDefineElements)
export class CubeLayout extends Element3D {
	#sides: Element3D[] = []

	// Use a ShadowRoot
	override readonly hasShadow = true

	#created = false

	override connectedCallback() {
		super.connectedCallback()

		if (this.#created) return

		for (let n = 0; n < 6; n += 1) this.#createCubeSide(n)

		const defaultSlot = document.createElement('slot')
		this.root.appendChild(defaultSlot)
	}

	/**
	 * @method createCubeSide - Creates one side of the cube.
	 * @param {number} index - A number between 0 and 5 specifying which side to create.
	 * @param {string} name - The name of the side.
	 */
	#createCubeSide(index: number) {
		const rotator = new Element3D().set({
			alignPoint: new XYZNumberValues(0.5, 0.5, 0.5),
		})

		const side = new Element3D().set({
			mountPoint: new XYZNumberValues(0.5, 0.5),
			size: new XYZNonNegativeValues(this.size.x, this.size.x),
		})

		this.#sides.push(side)
		rotator.append(side)

		const slot = document.createElement('slot')
		side.append(slot)
		slot.name =
			index === 0
				? 'front'
				: index === 1
				? 'right'
				: index === 2
				? 'back'
				: index === 3
				? 'left'
				: index === 4
				? 'top'
				: 'bottom'

		// rotate and place each side.
		if (index < 4)
			// 4 sides
			rotator.rotation.y = 90 * index
		// top/bottom
		else rotator.rotation.x = 90 * (index % 2 ? -1 : 1)

		side.position.z = this.size.x / 2

		this.root.appendChild(rotator)
	}

	/**
	 * @method setContent - As an imperative alternative to slotting, an array
	 * of 6 children (any more are ignored) can be passed in to make them
	 * children of the 6 sides of the cube layout. The order in which they are
	 * added is front, right, back, left, top, bottom. Note, it can be easier to
	 * assign nodes to slots by name, without worrying about their order.
	 * @param {Array<Element3D>} content - An array containing [Node](../core/Node)
	 * instances to place in the cube sides. Only the first 6 items are used,
	 * the rest are ignored.
	 * @returns {this}
	 */
	setContent(content: Element3D[]) {
		for (let index = 0; index < 6; index += 1) {
			this.#sides[index].innerHTML = ''
			this.#sides[index].append(content[index])
		}

		return this
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-cube-layout': ElementAttributes<CubeLayout, CubeLayoutAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-cube-layout': CubeLayout
	}
}
