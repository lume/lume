/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein) and Joe Pea (trusktr)
 * @license MIT
 * @copyright Gloey Apps, 2015
 * @copyright Joe Pea, 2018
 *
 * Forked and converted to LUME from
 * https://github.com/IjzerenHein/famous-autolayout. Thanks @IjzerenHein for the
 * initial work!
 */

// TODO:
// - Make an <lume-visual-format> element that can contain visual format code to
// re-use in multiple layouts. Or perhaps wait until CSS support and make it a CSS prop.
// - Allow visual-format to be fetched by path (like img src attribute).

import {createEffect, createMemo, createSignal, For, Index, Show, untrack} from 'solid-js'
import AutoLayout from '@lume/autolayout/es/AutoLayout.js'
import {attribute, element} from '@lume/element'
import {html} from '@lume/element/dist/html.js'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {Motor} from '../core/Motor.js'
import {autoDefineElements} from '../LumeConfig.js'

export {AutoLayout}

type LayoutOptions = Partial<{
	spacing: number | number[]

	// TODO remove
	[k: string]: unknown
}>

// TODO move to lume/autolayout package
interface AutolayoutSubview {
	name: string
	type: string // TODO union of values
	left: number
	top: number
	width: number
	height: number
	zIndex: number
}

export type AutolayoutAttributes = Element3DAttributes | 'visualFormat'

/**
 * A Node that lays children out based on an Apple AutoLayout VFL layout
 * description.
 */
@element('lume-autolayout', autoDefineElements)
export class Autolayout extends Element3D {
	static DEFAULT_PARSE_OPTIONS = {
		extended: true,
		strict: false,
	}

	override hasShadow = true

	@attribute visualFormat: string | null = ''

	/* (WIP, not documented)
	 *
	 * Sets the options such as viewport, spacing, etc...
	 *
	 * @param {Object} options Layout-options to set.
	 * @return {Autolayout} this
	 */
	// TODO replace options with reactive props/attributes
	set layoutOptions(options: LayoutOptions) {
		this.#layoutOptions[1](options || {})
	}
	get layoutOptions(): LayoutOptions {
		return this.#layoutOptions[0]()
	}

	#autoLayoutView?: any | undefined

	// TODO use classy-solid decorators
	readonly #subviewsArray = createSignal<AutolayoutSubview[]>([], {equals: false})

	// TODO split options into individual attributes
	readonly #layoutOptions = createSignal<LayoutOptions>({}, {equals: false})

	#metaInfo?: any

	// prettier-ignore
	// (Solid html template bug when prettier formats the template, https://github.com/ryansolid/dom-expressions/issues/156)
	override template = () => {
		const [subviewsArray] = this.#subviewsArray

		// Note, we wrap the <For> loop with the layoutRoot wrapper, otherwise
		// the <style> element injection will clash with Solid's iteration handling.
		//
		// <Index> is a lot faster than <For> because it doesn't re-create the child views, but re-uses them, if only dimentions changed (and not VFL).
		return html`
			<lume-element3d size="1 1" size-mode="proportional proportional" class="layoutRoot">

				<${Index} each=${() => subviewsArray()}>
					${(subview: () => AutolayoutSubview) => {
						// Sometimes the layout sizes intermittently come out as
						// (small) negative numbers (until the layout settles?),
						// so we clamp them to 0 to prevent errors from negative
						// numbers in XYZNonNegativeValues which is used for
						// sizing.
						return html`
							<${Show} when=${() => subview().type !== 'stack'
								// && subview().height >= 0 && subview().width >= 0
							}>
								<lume-element3d
									id=${subview().name}
									class="layoutItem"
									size=${() => [subview().width < 0 ? 0 : subview().width, subview().height < 0 ? 0 : subview().height]}
									position=${() => [subview().left, subview().top, subview().zIndex * 5]}
								>
									<slot name=${subview().name}></slot>
								</lume-element3d>
							</>
						`
					}}
				</>

			</lume-element3d>

			<slot></slot>
		`
	}

	static override css =
		Element3D.css +
		/*css*/ `
			:host,
			.layoutRoot,
			.layoutItem {
				pointer-events: none;
			}

			/* TODO update to Cascade Layers to avoid !important hack */
			.layoutItem > * {
				pointer-events: auto !important;
			}
		`

	override connectedCallback() {
		super.connectedCallback()

		// TODO make this cleaner with deferred-batched effect API and remove this.#queue,
		// something like createAnimationFrameEffect or createRenderTaskEffect.

		// this.createEffect(() => {
		// 	console.log('grid, WTF, Autolayout.connectedCallback.createEffect')
		// 	// if (this.id === 'page')
		// 	console.log('grid, Visual format effect.', this.visualFormat)

		// 	// Any time visual format changes, it means we need to make a new layout (the VFL code may specify a totally different layout with different items in it), not just update the positioning of the layout.
		// 	this.visualFormat
		// 	// this.#queue(this.#newLayout)
		// 	// this.#queue(this.#updateLayout)
		// 	this.#queue(() => {
		// 		this.#newLayout()
		// 		this.#updateLayout()
		// 	})
		// 	// this.#newLayout()
		// 	// this.needsUpdate()
		// })

		this.createEffect(() => {
			this.visualFormat
			this.calculatedSize
			this.layoutOptions

			// this.#queue(this.#updateLayout)
			this.#queue(() => {
				this.#newLayout()
				this.#updateLayout()
			})
		})
	}

	#queued = false
	#queue(fn: () => void) {
		// Motor.once(fn, false)
		if (this.#queued) return
		this.#queued = true
		queueMicrotask(() => {
			this.#queued = false
			fn()
		})
	}

	// TODO parse options as prop/attribute
	#newLayout = (/*parseOptions?: object*/) => {
		if (!this.isConnected) return

		// this work should be deferred-batched too.
		const visualFormat = this.visualFormat
		const constraints = AutoLayout.VisualFormat.parse(
			visualFormat,
			/*parseOptions ||*/ Autolayout.DEFAULT_PARSE_OPTIONS,
		)
		this.#metaInfo = AutoLayout.VisualFormat.parseMetaInfo(visualFormat)
		this.#autoLayoutView = new AutoLayout.View({constraints})

		// triggers the template
		// this.#updateSubviewsArray()
	}

	#updateLayout = () => {
		if (!this.isConnected) return
		if (!this.#autoLayoutView) return

		const size = this.calculatedSize // dependency

		// dependency
		if (this.layoutOptions.spacing || this.#metaInfo.spacing)
			this.#autoLayoutView.setSpacing(this.layoutOptions.spacing || this.#metaInfo.spacing)

		this.#autoLayoutView.setSize(size.x, size.y)

		// triggers the template
		this.#updateSubviewsArray()
	}

	#updateSubviewsArray() {
		const subviewsArray: AutolayoutSubview[] = []

		for (const viewName of Object.keys(this.#autoLayoutView.subViews)) {
			// TODO do we need to make a new object? Or is
			// this.#autoLayoutView.subViews[viewName] already a new object (so
			// that it triggers reactivity in the template iteration)?
			const view = this.#autoLayoutView.subViews[viewName]

			subviewsArray.push({
				name: view.name,
				type: view.type,
				top: view.top,
				left: view.left,
				width: view.width,
				height: view.height,
				zIndex: view.zIndex,
			})
		}

		this.#subviewsArray[1](subviewsArray)
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-autolayout': ElementAttributes<Autolayout, AutolayoutAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-autolayout': Autolayout
	}
}
