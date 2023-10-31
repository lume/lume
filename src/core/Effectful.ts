// TODO move Effectful to to classy-solid

import {createEffect, createRoot, getOwner, Owner, runWithOwner} from 'solid-js'
import type {Constructor} from 'lowclass'

/**
 * @class Effectful -
 *
 * `mixin`
 *
 * Create Solid.js effects using `this.createEffect(fn)` and easily stop them
 * all by calling `this.stopEffects()`.
 *
 * Example (note, replace double ampersands with one ampersand):
 *
 * ```js
 * import {element, Effectful} from 'lume'
 *
 * @@element('my-element')
 * class MyElement extends Effectful(HTMLElement) {
 *   @@attribute foo = "foo"
 *   @@attribute bar = "bar"
 *
 *   connectedCallback() {
 *     // Log `foo` and `bar` any time either of them change.
 *     this.createEffect(() => {
 *       console.log('foo, bar:', this.foo, this.bar)
 *     })
 *
 *     // Log only `bar` any time it changes.
 *     this.createEffect(() => {
 *       console.log('bar:', this.bar)
 *     })
 *   }
 *
 *   disconnectedCallback() {
 *     // Stop both of the effects.
 *     this.stopEffects()
 *   }
 * }
 * ```
 */
export function Effectful<T extends Constructor | AbstractConstructor>(Base: T) {
	return class Effectful extends Base {
		#owner: Owner | null = null
		#dispose: StopFunction | null = null

		/**
		 * Create a Solid.js effect. If there's no owner (i.e. this will be a
		 * top-level effect) then it implicitly creates an owner. Normally with
		 * Solid.js you must use createRoot with top-level effects, and this
		 * prevents that for convenience.
		 */
		createEffect(fn: () => void) {
			if (!this.#owner) {
				createRoot(dispose => {
					this.#owner = getOwner()
					this.#dispose = dispose
				})
			}

			runWithOwner(this.#owner!, () => createEffect(fn))
		}

		/**
		 * Stop all of the effects that were created. For example, create
		 * effects in a constructor, then stop them all in a destructor, to
		 * avoid mem leaks.
		 */
		stopEffects() {
			this.#dispose?.()
			this.#dispose = null
			this.#owner = null
		}
	}
}

type StopFunction = () => void

// TODO move to lowclass
export type AbstractConstructor<T = object, A extends any[] = any[], Static = {}> = (abstract new (...a: A) => T) &
	Static
