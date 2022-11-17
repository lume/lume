import {element, ElementAttributes, variable} from '@lume/element'
import {html} from '@lume/element/dist/html.js'
import {createEffect, onCleanup, untrack} from 'solid-js'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

export type ScrollerAttributes = Element3DAttributes

/**
 * @extends Element3D
 * @class Scroller -
 *
 * Element: `<lume-scroller>`
 *
 * A container that scrolls its children within its boundaries in the X or Y directions.
 *
 * Slots:
 *
 * - `TODO` - The ..........
 * - Default: The default slot is a catch-all for all other children, so they behave the same as children of a node without a shadow tree.
 */
@element('lume-scroller', autoDefineElements)
export class Scroller extends Element3D {
	// Use a ShadowRoot
	// override readonly hasShadow = true

	#scrollContainer: Element3D | null = null
	#scrollknob: Element3D | null = null

	override connectedCallback() {
		super.connectedCallback()

		let scrollRatio = 0
		let amountScrolled = 0

		const tiny = 0.000000000000000000001
		const scrollableAmount = variable(0)
		const contentHeight = variable(0)

		// Scroll implementation //////////////////////////////////////////////////////////////////////
		createEffect(() => {
			let _contentHeight = 0

			// reactive dependencies (child.calculatedSize)
			for (const child of Array.from(this.#scrollContainer!.children)) {
				_contentHeight += child.calculatedSize.y
			}

			contentHeight(_contentHeight)

			// Using Math.max here to prevent negative numbers in case content is smaller than scroll area.
			scrollableAmount(Math.max(0, _contentHeight - this.#scrollContainer!.calculatedSize.y))

			// In firefox scene is initially null here, but not in Safari. Huh.
			if (!this.scene) return

			// debugger
			// TODO make scrollfling (and other flings) fully updateable, avoid creating a new one each time.
			console.log('make new fling', amountScrolled, scrollRatio, scrollRatio * untrack(scrollableAmount))
			const fling = new ScrollFling({
				target: untrack(() => this.scene),
				// y: scrollRatio * untrack(scrollableAmount),
				// Use Math.min in case the page is at the end, so that the viewport won't be scrolled beyond the end of content in case content height shrunk.
				y: Math.min(amountScrolled, untrack(scrollableAmount)),
				minY: 0,
				// The `|| tiny` prevents divide by zero errors.
				maxY: untrack(scrollableAmount) || tiny,
				scrollFactor: 0.3,
			})

			if (untrack(() => fling.y === undefined)) debugger

			fling.start()

			createEffect(() => {
				fling.y

				untrack(() => {
					this.#scrollContainer!.position.y = -(fling.y || 0)
					console.log('scroll content Y:', this.#scrollContainer!.position.y)

					// FIXME, this conditional checking is because of values-in-the-past, which should be fixed in Solid 1.5
					scrollRatio = fling.y ? fling.y / (scrollableAmount() || tiny) : scrollRatio
					amountScrolled = fling.y ?? amountScrolled
					console.log('scroll content Y:', fling.y, amountScrolled)

					this.#scrollknob!.alignPoint.y = scrollRatio
					this.#scrollknob!.mountPoint.y = scrollRatio
				})
			})

			onCleanup(() => fling.stop())
		})

		createEffect(() => {
			// if y size is 0, the || tiny prevents NaN
			if (this.#scrollContainer!.calculatedSize.y / (contentHeight() || tiny) >= 1) {
				untrack(() => this.#scrollknob!.size).y = 0
				return
			}
			console.log('scroll content size changed')
			untrack(() => this.#scrollknob!.size).y = Math.max(
				10,
				(this.#scrollContainer!.calculatedSize.y / (contentHeight() || tiny)) * this.#scrollContainer!.calculatedSize.y,
			)
		})
	}

	override template = () => html`
		<lume-element3d
			id="#scrollContainer"
			size-mode="p p"
			size="1 1"
			ref=${(e: Element3D) => (this.#scrollContainer = e)}
		>
			<slot></slot>
		</lume-element3d>

		<lume-element3d
			ref=${(e: Element3D) => (this.#scrollknob = e)}
			id="scrollknob"
			size="10 10 0"
			align-point="1 0"
			mount-point="1 0"
			position="0 0 0.2"
		></lume-element3d>
	`

	static override css = /*css*/ `
		#scrollknob {
			background: rgba(255, 255, 255, 0.2);
		}
	`
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-scroller': ElementAttributes<Scroller, ScrollerAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-scroller': Scroller
	}
}
