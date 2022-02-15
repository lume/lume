import {Constructor} from 'lowclass'
import type {PossibleCustomElement, PossibleCustomElementConstructor} from '../core/PossibleCustomElement.js'

export function DefaultBehaviors<T extends Constructor<HTMLElement>>(Base: T) {
	// TODO This is here for now. Make it an extension to
	// element-behaviors so that it can be applied to any element
	// generically.
	return class DefaultBehaviors extends Constructor<PossibleCustomElement, PossibleCustomElementConstructor & T>(
		Base,
	) {
		// override in subclasses
		static defaultBehaviors: any = []

		connectedCallback() {
			super.connectedCallback && super.connectedCallback()

			// If no geometry or material behavior is detected, add default ones.
			this.#setDefaultBehaviorsIfNeeded()
		}

		#setDefaultBehaviorsIfNeeded() {
			let defaultBehaviors = (this.constructor as typeof DefaultBehaviors).defaultBehaviors

			// do nothing if there's no defaults
			if (!defaultBehaviors) return
			if (Object.keys(defaultBehaviors).length == 0) return

			const hasAttribute = this.getAttribute('has')
			const initialBehaviorNames = (hasAttribute && hasAttribute.split(' ')) || []

			// small optimization: if there are no initial behaviors and we
			// have default behaviors, just set the default behaviors.
			if (initialBehaviorNames.length === 0) {
				// if not an array, then it's an object.
				if (!(defaultBehaviors instanceof Array)) defaultBehaviors = Object.keys(defaultBehaviors)

				this.setAttribute('has', `${this.getAttribute('has') || ''} ${defaultBehaviors.join(' ')}`)
			}

			// otherwise detect which default behavior(s) to add
			else {
				let behaviorNamesToAdd = ''

				// if defaultBehaviors is an array, use default logic to add
				// behaviors that aren't already added.
				if (defaultBehaviors instanceof Array) {
					for (const defaultBehaviorName of defaultBehaviors) {
						let hasBehavior = false

						for (const initialBehaviorName of initialBehaviorNames) {
							if (defaultBehaviorName == initialBehaviorName) {
								hasBehavior = true
								break
							}
						}

						if (hasBehavior) continue
						else {
							// TODO programmatic API:
							//this.behaviors.add('box-geometry')

							// add a space in front of each name except the first
							if (behaviorNamesToAdd) behaviorNamesToAdd += ' '

							behaviorNamesToAdd += defaultBehaviorName
						}
					}
				}

				// if defaultBehaviors is an object, then behaviors are added
				// based on conditions.
				else if (typeof defaultBehaviors == 'object') {
					const defaultBehaviorNames = Object.keys(defaultBehaviors)

					for (const defaultBehaviorName of defaultBehaviorNames) {
						const condition = defaultBehaviors[defaultBehaviorName]

						if (
							(typeof condition == 'function' && condition(initialBehaviorNames)) ||
							(typeof condition != 'function' && condition)
						) {
							// add a space in front of each name except the first
							if (behaviorNamesToAdd) behaviorNamesToAdd += ' '

							behaviorNamesToAdd += defaultBehaviorName
						}
					}
				}

				// add the needed behaviors all at once.
				if (behaviorNamesToAdd) {
					let currentHasValue = this.getAttribute('has')

					if (currentHasValue) currentHasValue += ' '

					this.setAttribute('has', currentHasValue + behaviorNamesToAdd)
				}
			}
		}
	}
}
