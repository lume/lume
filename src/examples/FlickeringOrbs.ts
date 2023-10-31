import html from 'solid-js/html'
import {element, attribute, numberAttribute} from '@lume/element'
import {autoDefineElements} from '../LumeConfig.js'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'

export type FlickeringOrbsAttributes = Element3DAttributes | 'shadowBias' | 'intensity'

@element('flickering-orbs', autoDefineElements)
export class FlickeringOrbs extends Element3D {
	@numberAttribute(0) shadowBias = 0
	@numberAttribute(1.3) intensity = 1.3
	@numberAttribute(0.4) flickerRange = 0.4
	@attribute color: string | null = null

	// CONTINUE 'attr:' is used to work around an issue with default property
	// behavior, should be fixed once we switch to classy-solid with latest
	// solid.js.
	// prettier-ignore
	override template = () => html`
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ??    "yellow"} position="500 0 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ??  "deeppink"} position="-500 0 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ??      "cyan"} position="0 0 500"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "limegreen"} position="0 0 -500"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ??     "white"} position="0 -500 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ??     "white"} position="0 250 0"></flickering-orb>
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
