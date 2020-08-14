import {Mixin, MixinResult, Constructor} from 'lowclass'
import jss from '../lib/jss'
import DefaultBehaviors from './behaviors/DefaultBehaviors'
import WithChildren from './WithChildren'

import type {PossibleCustomElement} from './PossibleCustomElement'

/**
 * Creates a WebComponent base class dynamically, depending on which
 * HTMLElement class you want it to extend from. Extend from WebComponent when
 * making a new Custom Element class.
 *
 * @param {Constructor} Base The class that the generated WebComponent
 * base class will extend from.
 *
 * @example
 * class AwesomeButton extends WebComponent.mixin(HTMLButtonElement) { ... }
 */
function WebComponentMixin<T extends Constructor<HTMLElement>>(Base: T) {
	Base = Base || HTMLElement

	class WebComponent extends WithChildren.mixin(DefaultBehaviors.mixin(Constructor<PossibleCustomElement>(Base))) {
		/**
		 * This method can be overridden by extending classes, it should return
		 * JSS-compatible styling. See http://github.com/cssinjs/jss for
		 * documentation.
		 * @abstract
		 */
		getStyles() {
			return {}
		}

		// TODO: when we make setAttribute accept non-strings, we need to move
		// logic from attributeChangedCallback
		attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
			if (super.attributeChangedCallback) super.attributeChangedCallback(name, oldVal, newVal)
			this.__initialAttributeChange = true
		}

		connectedCallback() {
			super.connectedCallback()

			if (!this.__style) this.__style = this.__createStyles()

			// fire this.attributeChangedCallback in case some attributes have
			// existed before the custom element was upgraded.
			if (!this.__initialAttributeChange && this.hasAttributes()) {
				const {attributes} = this
				for (let l = attributes.length, i = 0; i < l; i += 1)
					this.attributeChangedCallback(attributes[i].name, null, attributes[i].value)
			}
		}

		private __style: object | null = null
		private __initialAttributeChange = false

		private __createStyles(): object {
			const rule = jss.createRule(this.getStyles())

			// @ts-ignore TODO update JSS types, it is missing the applyTo method.
			rule.applyTo(this)

			return rule
		}
	}

	return WebComponent as MixinResult<typeof WebComponent, T>
}

export const WebComponent = Mixin(WebComponentMixin, HTMLElement)
export interface WebComponent extends InstanceType<typeof WebComponent> {}
export default WebComponent
