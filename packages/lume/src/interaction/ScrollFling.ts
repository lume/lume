import {reactive} from '@lume/element'
import {Motor} from '../core/Motor.js'
import {clamp} from '../math/clamp.js'

import type {RenderTask} from '../core/index.js'

type ScrollFlingOptions = Partial<Pick<ScrollFling, 'target' | 'x' | 'y' | 'minX' | 'maxX' | 'minY' | 'maxY'>>

@reactive
export class ScrollFling {
	@reactive x = 0
	@reactive y = 0

	minX = -Infinity
	maxX = Infinity
	minY = -Infinity
	maxY = Infinity

	target: Document | ShadowRoot | Element = document

	deltaX = 0
	deltaY = 0

	__task!: RenderTask

	constructor(options: ScrollFlingOptions) {
		Object.assign(this, options)
	}

	__onWheel = (event: WheelEvent) => {
		event.preventDefault()

		this.deltaX = event.deltaX
		this.deltaY = event.deltaY

		this.x = clamp(this.x + this.deltaX, this.minX, this.maxX)
		this.y = clamp(this.y + this.deltaY, this.minY, this.maxY)

		if (this.deltaX === 0 && this.deltaY === 0) return

		if (this.__task) Motor.removeRenderTask(this.__task)

		let dx = this.deltaX
		let dy = this.deltaY

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

	// TODO switch to Pointer Events

	start() {
		// @ts-ignore, whyyyyy TypeScript
		this.target.addEventListener('wheel', this.__onWheel)
		return this
	}

	stop() {
		// @ts-ignore, whyyyyy TypeScript
		this.target.removeEventListener('wheel', this.__onWheel)
		return this
	}
}
