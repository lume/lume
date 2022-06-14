import {element, numberAttribute} from '@lume/element'
import {html} from '@lume/element/dist/html.js'
import {autoDefineElements} from '../LumeConfig.js'
import {Node, NodeAttributes} from '../core/Node.js'

export type FlickeringOrbsAttributes = NodeAttributes | 'shadowBias'

@element('flickering-orbs', autoDefineElements)
export class FlickeringOrbs extends Node {
	@numberAttribute(0) shadowBias = 0

	// FIXME 'attr:' is used to work around an issue with default property behavior
	override template = () => html`
		<>
			<flickering-orb color="yellow" position="500 0 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
			<flickering-orb color="deeppink" position="-500 0 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
			<flickering-orb color="cyan" position="0 0 500" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
			<flickering-orb color="limegreen" position="0 0 -500" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
			<flickering-orb color="white" position="0 -500 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
			<flickering-orb color="white" position="0 250 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
		</>
	`
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'flickering-orbs': ElementAttributes<FlickeringOrbs, FlickeringOrbsAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'flickering-orbs': FlickeringOrbs
	}
}
