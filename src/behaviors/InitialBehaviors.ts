import {Constructor} from 'lowclass/dist/Constructor.js'
import type {PossibleCustomElement, PossibleCustomElementConstructor} from '../core/PossibleCustomElement.js'
import {r} from 'regexr'

/**
 * @deprecated Use child element behaviors instead. For default behaviors,
 * define them in `<slot>` elements of the mesh element as shown in the
 * `<lume-box>` and `<lume-points>` examples.
 */
export function InitialBehaviors<T extends Constructor<HTMLElement>>(Base: T) {
	return class InitialBehaviors extends Constructor<PossibleCustomElement, PossibleCustomElementConstructor & T>(Base) {
		/**
		 * @deprecated This, and the has= attribute, are deprecated. Use child
		 * behavior elements instead. For example see how the `Sphere` class
		 * specifies a default `<lume-sphere-geometry>` element instead of a
		 * legacy attribute-based behavior.
		 */
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

function setBehaviors(el: Element, behaviors: Record<string, string>, replace = true) {
	let has = el.getAttribute('has') ?? ''
	const parts = has.split(' ')

	for (const [category, type] of Object.entries(behaviors)) {
		if (replace) el.setAttribute('has', (has = has.replace(r`/[a-z-]*-${category}/`, '') + ` ${type}-${category}`))
		else if (!parts.some(b => b.endsWith('-' + category))) el.setAttribute('has', (has = has + ` ${type}-${category}`))
	}
}
