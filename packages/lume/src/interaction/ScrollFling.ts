import {reactive} from '@lume/element'
import {Motor} from '../core/Motor.js'
import {clamp} from '../math/clamp.js'

import type {RenderTask} from '../core/index.js'

type ScrollFlingOptions = Partial<
	Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY' | 'scrollFactor'>
>

@reactive
export class ScrollFling {
	@reactive x = 0
	@reactive y = 0

	minX = -Infinity
	maxX = Infinity
	minY = -Infinity
	maxY = Infinity

	target: Document | ShadowRoot | Element = document

	scrollFactor = 1

	__task!: RenderTask

	constructor(options: ScrollFlingOptions) {
		Object.assign(this, options)
	}

	__onWheel = (event: WheelEvent) => {
		event.preventDefault()

		let dx = event.deltaX * this.scrollFactor
		let dy = event.deltaY * this.scrollFactor

		this.x = clamp(this.x + dx, this.minX, this.maxX)
		this.y = clamp(this.y + dy, this.minY, this.maxY)

		if (dx === 0 && dy === 0) return

		if (this.__task) Motor.removeRenderTask(this.__task)

		// slow the rotation down based on former drag speed
		this.__task = Motor.addRenderTask((): false | void => {
			dx = dx * 0.95
			dy = dy * 0.95

			this.x = clamp(this.x + dx, this.minX, this.maxX)
			this.y = clamp(this.y + dy, this.minY, this.maxY)

			// Stop the rotation update loop once the deltas are small enough
			// that we no longer notice a change.
			if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return false
		})
	}

	private __isStarted = false

	// TODO switch to Pointer Events

	start(): this {
		if (this.__isStarted) return this
		this.__isStarted = true

		// @ts-ignore, whyyyyy TypeScript
		this.target.addEventListener('wheel', this.__onWheel)

		return this
	}

	stop(): this {
		if (!this.__isStarted) return this
		this.__isStarted = false

		// @ts-ignore, whyyyyy TypeScript
		this.target.removeEventListener('wheel', this.__onWheel)

		return this
	}
}
