import {Constructor} from 'lowclass'
import type {PossibleCustomElement, PossibleCustomElementConstructor} from '../core/PossibleCustomElement.js'
import {r} from 'regexr'

// TODO Move this to element-behaviors package?
export function InitialBehaviors<T extends Constructor<HTMLElement>>(Base: T) {
	return class InitialBehaviors extends Constructor<PossibleCustomElement, PossibleCustomElementConstructor & T>(Base) {
		initialBehaviors?: Record<string, string>

		constructor(...args: any[]) {
			super(...args)
			queueMicrotask(() => this.#setBehaviors())
		}

		#setBehaviors() {
			if (!this.initialBehaviors) return
			setBehaviors(this, this.initialBehaviors, false) // false -> don't replace if it already exists (the user set it)
		}
	}
}

function _setBehaviors(el: Element, behaviors: Record<string, string>, replace: boolean) {
	let has = el.getAttribute('has') ?? ''
	const parts = has.split(' ')

	for (const [category, type] of Object.entries(behaviors)) {
		if (replace) el.setAttribute('has', (has = has.replace(r`/[a-z-]*-${category}/`, '') + ` ${type}-${category}`))
		else if (!parts.some(b => b.endsWith('-' + category))) el.setAttribute('has', (has = has + ` ${type}-${category}`))
	}
}

export function setBehaviors(el: Element, behaviors: Record<string, string>, replace = true) {
	_setBehaviors(el, behaviors, replace)
}
