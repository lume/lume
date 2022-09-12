// TODO move Effectful to to classy-solid

import {createEffect, createRoot, getOwner, Owner, runWithOwner} from 'solid-js'
import type {Constructor} from 'lowclass'

export function Effectful<T extends Constructor | AbstractConstructor>(Base: T) {
	return class Effectful extends Base {
		#owner: Owner | null = null
		#dispose: StopFunction | null = null

		createEffect(fn: () => void) {
			if (!this.#owner) {
				createRoot(dispose => {
					this.#owner = getOwner()
					this.#dispose = dispose
				})
			}

			runWithOwner(this.#owner!, () => createEffect(fn))
		}

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
