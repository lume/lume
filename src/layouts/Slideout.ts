import html from 'solid-js/html'
import {booleanAttribute, element, numberAttribute, reactive, stringAttribute} from '@lume/element'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import {Motor} from '../core/Motor.js'
import {Tween, Group, Easing} from '@tweenjs/tween.js'

import type {ElementAttributes} from '@lume/element'
import {batch} from 'solid-js'

export type SlideoutAttributes =
	| Element3DAttributes
	| 'slideoutWidth'
	| 'slideoutSide'
	| 'gripSize'
	| 'contentDepth'
	| 'fadeOpacity'
	| 'fadeColor'
	| 'showHint'
	| 'duration'

// TODO top and bottom
type SlideoutSide = 'left' | 'right'

// TODO use the jsdoc tags to expose this in the documentation when ready.

/**
 * A layout that provides a main content area, and a drawer that slides out on
 * finger drag or mouse enter. By default the content recedes backward in space,
 * and the drawer slides out on top of it.
 */
@element('lume-slideout', autoDefineElements)
export class Slideout extends Element3D {
	override hasShadow = true

	/** Width of the slideout drawer. */
	@numberAttribute(230) slideoutWidth = 230
	/** Side on which the drawer enters from, either "left" or "right" for now. Values of "top" and "bottom" will be follow on options. */
	@stringAttribute('left') slideoutSide: SlideoutSide = 'left'
	/** The width of the invisible grip on the edge of the layout. This is an area on the edge of the layout (typically the edge of the display) on which a finger drag can pull out the drawer, or on which a mouse pointer hover will reveal the drawer. */
	@numberAttribute(50) gripSize = 50
	/** The depth that the content will recede to when the slideout drawer is opened. */
	@numberAttribute(70) contentDepth = 70
	/** The amount of opacity that the "fade" effect over the content will have. Set to 0 to disable (and use `.drawerPosition` in your code to animate your own). */
	@numberAttribute(0.6) fadeOpacity = 0.6
	/** The color of the fade. Match this to a background color, for example, to give the appearance of fading into the background. */
	@stringAttribute('#333') fadeColor = '#333'
	/** Set to `false` to disable the animated triangle that hints to the user that there is a drawer that can be opened. You may have something else like a hamburger button to show this instent instead. Note, this value is initial only (for now), set it as an initial attribute or JS property before the element is parsed or inserted into the DOM. */
	@booleanAttribute(true) showHint = true
	/** Duration of the slideout animation (when not dragging with a finger). */
	@numberAttribute(1000) duration = 1000

	// TODO attributes for hint sizing and color

	// TODO Replace private `@reactive __var`s with `@reactive #var`s once we upgrade to the final decorator spec.

	@reactive __drawerIsClosing = false

	/** A boolean that is `true` while the slideout drawer is animating to closed position. */
	get drawerIsClosing() {
		return this.__drawerIsClosing
	}

	@reactive __drawerIsOpening = false

	/** A boolean that is `true` while the slideout drawer is animating to open position. */
	get drawerIsOpening() {
		return this.__drawerIsOpening
	}

	@reactive __drawerPosition = 0

	/** A number between 0 and 1 that indicates at any moment the position of the slider between closed and open position, respectively. */
	get drawerPosition() {
		return this.__drawerPosition
	}

	// refs
	#menu?: Element3D
	#invisibleGrip?: Element3D
	#hint?: Element3D
	#content?: Element3D
	#fadeEffect?: Element3D

	override template = () => {
		return html`
			<lume-element3d id="layoutRoot" size-mode="proportional, proportional, literal" size="1, 1, 0">
				<lume-element3d
					id="menu"
					ref=${(el: Element3D) => (this.#menu = el)}
					size-mode="literal proportional"
					size=${[this.slideoutWidth, 1]}
					position=${[0]}
					align-point=${[this.slideoutSide === 'left' ? 0 : 1]}
					mount-point=${[this.slideoutSide === 'left' ? 1 : 0]}
				>
					<lume-element3d
						id="invisibleGrip"
						ref=${(el: Element3D) => (this.#invisibleGrip = el)}
						size-mode="literal proportional"
						size=${[this.gripSize, 1]}
						align-point=${[this.slideoutSide === 'left' ? 1 : 0]}
						mount-point=${[this.slideoutSide === 'left' ? 0 : 1]}
						position=${[this.slideoutSide === 'left' ? -5 : 5, 0, 0.1]}
						position-comment="slightly above the content so it catches pointer events"
					></lume-element3d>

					<lume-element3d
						id="hint"
						ref=${(el: Element3D) => (this.#hint = el)}
						size="12 24"
						align-point=${[this.slideoutSide === 'left' ? 1 : 0, 0.5]}
						mount-point=${[this.slideoutSide === 'left' ? 0 : 1, 0.5]}
						visible=${this.showHint ? true : false}
						position="0 0 0.1"
						position-comment="slightly above the content so it is visible"
					>
						<div class="triangle" style=${`transform: scale(${this.slideoutSide === 'left' ? 1 : -1})`}></div>
					</lume-element3d>

					<slot name="slideout"></slot>
				</lume-element3d>

				<lume-element3d size-mode="proportional proportional" size="1 1 ">
					<lume-element3d
						id="content"
						ref=${(el: Element3D) => (this.#content = el)}
						size-mode="proportional proportional"
						size="1 1"
					>
						<slot name="content"></slot>
					</lume-element3d>
				</lume-element3d>

				<lume-element3d
					position="0 0 0.1"
					position-comment="slightly above the content"
					size-mode="proportional proportional"
					size="1 1 "
				>
					<lume-element3d
						id="fadeEffect"
						ref=${(el: Element3D) => (this.#fadeEffect = el)}
						size-mode="proportional proportional"
						size="1 1 "
						opacity="0"
						style=${`background: ${this.fadeColor}`}
					></lume-element3d>
				</lume-element3d>
			</lume-element3d>

			<slot></slot>
		`
	}

	static override css =
		Element3D.css +
		/*css*/ `
			:host,
			#layoutRoot,
			#content {
				pointer-events: none;
			}

			/* TODO update to Cascade Layers to avoid !important hack */
			#menu {
				pointer-events: auto;
			}

			/* TODO update to Cascade Layers to avoid !important hack */
			#content > * {
				pointer-events: auto;
			}

			.triangle {
				position: absolute;
				top: -2px;
				width: 0;
				height: 0;
				border-top: 12px solid transparent;
				border-bottom: 12px solid transparent;
				border-left: 12px solid #1DD326; /*green*/
			}

			#content {
				/*
				TODO This should not be needed, but it is a
				workaround for this Chrome bug:
				https://bugs.chromium.org/p/chromium/issues/detail?id=1114514.
				Note, we should not place any child nodes on
				this node, because overflow: hidden will
				break the 3D space (flattens transforms).
				*/
				/* overflow: hidden; */
			}

			#fadeEffect {
				pointer-events: none;
			}
		`

	// TODO currently this element only works with CSS enabled, for the user events.

	override _loadCSS() {
		if (!super._loadCSS()) return false

		this.#initMouseEvents()
		this.#initTouchEvents()

		// TODO not reactive, only initial value.
		if (this.showHint) this.#startHintAnimation()

		return true
	}

	#hintTween: StatusTween<any> | null = null

	#initMouseEvents() {
		const menu = this.#menu
		const hint = this.#hint

		let hintStopped = false

		menu!.addEventListener('mouseenter', _event => {
			if (!hintStopped) {
				hintStopped = true
				this.#hintTween?.stop()
				hint!.position.x = this.slideoutSide === 'left' ? 5 : -5
			}

			this.open()
		})
		menu!.addEventListener('mouseleave', _event => {
			this.close()
		})
	}

	#initTouchEvents() {
		const menu = this.#menu
		const hint = this.#hint

		let hintStopped = false

		let lastX = 0
		let delta = 0
		let dragX = 0

		menu!.addEventListener('touchstart', event => {
			const touches = event.touches

			if (touches.length === 1) {
				if (!hintStopped) {
					hintStopped = true
					this.#hintTween?.stop()
					hint!.position.x = this.slideoutSide === 'left' ? 5 : -5
				}

				if (this.#menuTween) this.#menuTween.stop()

				lastX = touches[0].screenX
				dragX = this.__drawerPosition
			}
		})
		menu!.addEventListener('touchmove', event => {
			const touches = event.touches

			if (touches.length === 1) {
				const touch = touches[0]

				delta = touch.screenX - lastX
				dragX += delta / this.slideoutWidth

				this.#updateMenuPosition(dragX)

				lastX = touch.screenX
			}
		})
		menu!.addEventListener('touchend', event => {
			const touches = event.changedTouches

			if (touches.length === 1) {
				if (delta > 0) {
					this.open()
				} else if (delta < 0) {
					this.close()
				} else {
					if (this.__drawerPosition >= 0.5) this.open()
					else this.close()
				}
			}
		})
	}

	#startHintAnimation() {
		this.#hintTween = new StatusTween(this.#hint!.position)
			.to({x: this.slideoutSide === 'left' ? 5 : -5}, this.duration)
			.yoyo(true)
			.repeat(Infinity)
			.easing(Easing.Quintic.Out)
			.start()

		Motor.addRenderTask(time => {
			if (this.#hintTween?.stopped) return false
			this.#hintTween?.update(time)
			return
		})
	}

	/** Programmatically cause the slideout drawer to open. Returns a promise for when the animation completes. Stops any previous closing animation first, if any. */
	open() {
		if (this.__drawerIsOpening) return

		this.__drawerIsOpening = true

		const promise = this.animateTo(1.0)

		promise.then(() => (this.__drawerIsOpening = false))

		return promise
	}

	/** Programmatically cause the slideout drawer to close. Returns a promise for when the animation completes. Stops any previous opening animation first, if any. */
	close() {
		if (this.__drawerIsClosing) return

		this.__drawerIsClosing = true

		const promise = this.animateTo(0.0)

		promise.then(() => (this.__drawerIsClosing = false))

		return promise
	}

	/** Toggle the menu open or closed. Cancels any previous open or close animation before making the drawer animate in the new direction. */
	toggle() {
		if (this.__drawerIsClosing || this.__drawerPosition === 0) this.open()
		else this.close()
	}

	#menuTween: any

	/** Animate the drawer to any position (between 0 and 1). Repeated calls will cancel any previous animation, if any. This can be useful for adding unique features like a drawer that wiggles outward and then hides, to hint the user that there is a drawer. */
	animateTo(value: number) {
		let resolve!: () => void
		const promise = new Promise<void>(r => (resolve = r))

		if (this.#menuTween) this.#menuTween.stop()

		this.#menuTween = new StatusTween({position: this.__drawerPosition})
			.to({position: value}, this.duration)
			.easing(Easing.Exponential.Out)
			.onUpdate(({position}) => (this.__drawerPosition = position))
			.start()

		const tween = this.#menuTween

		const task = Motor.addRenderTask(time => {
			if (tween.stopped) {
				Motor.removeRenderTask(task)
				setTimeout(resolve, 0) // setTimeout so that we don't resolve during rAF. Use postMessage instead?
				return
			}

			tween.update(time)

			this.#updateMenuPosition(this.__drawerPosition)

			if (tween.completed) {
				Motor.removeRenderTask(task)
				setTimeout(resolve, 0) // setTimeout so that we don't resolve during rAF. Use postMessage instead?
			}
		})

		return promise
	}

	#updateMenuPosition(value: number) {
		// limit value to between 0 and 1
		value = value > 1 ? 1 : value < 0 ? 0 : value

		const menu = this.#menu!
		const grip = this.#invisibleGrip!
		grip
		const content = this.#content!
		const fade = this.#fadeEffect!

		// TODO Switch to deferred-batched effects and remove all batch() wrappers.
		batch(() => {
			menu.position.x = (this.slideoutSide === 'left' ? value : -value) * this.slideoutWidth
			content.position.z = value * -this.contentDepth
			fade.position.z = value * -this.contentDepth
			fade.opacity = value * this.fadeOpacity

			// Tuck the grip back when the slideout is out.
			grip.mountPoint.x = this.slideoutSide === 'left' ? value : 1 - value

			this.__drawerPosition = value
		})
	}
}

type UnknownProps = Record<string, any>

// TODO better generic type in Tween.js
class StatusTween<T extends UnknownProps> extends Tween<T> {
	started = false
	stopped = false
	completed = false

	constructor(obj: T, group: Group | false = false) {
		super(obj, group)

		this.onStart(() => (this.started = true))
		this.onStop(() => (this.stopped = true))
		this.onComplete(() => (this.completed = true))
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-slideout': ElementAttributes<Slideout, SlideoutAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-slideout': Slideout
	}
}
