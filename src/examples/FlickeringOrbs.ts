import html from 'solid-js/html'
import {element, attribute, numberAttribute} from '@lume/element'
import {autoDefineElements} from '../LumeConfig.js'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'

export type FlickeringOrbsAttributes = Element3DAttributes | 'shadowBias' | 'intensity'

export
@element('flickering-orbs', autoDefineElements)
class FlickeringOrbs extends Element3D {
	@numberAttribute shadowBias = 0
	@numberAttribute intensity = 1.3
	@numberAttribute flickerRange = 0.4
	@attribute color: string | null = null

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

declare module 'solid-js' {
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
