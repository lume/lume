import {element, numberAttribute} from '@lume/element'
import {html} from '@lume/element/dist/html'
import {autoDefineElements} from '../LumeConfig'
import {Node} from '../core/Node'

@element('flickering-orbs', autoDefineElements)
export class FlickeringOrbs extends Node {
	@numberAttribute(0) shadowBias = 0

	template = () => html`
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
