import {attribute, element, html, Element3D} from 'lume'
import {createEffect} from 'solid-js'

// This example show plain JS custom element definitions without usage of decorators.

export const ShimmerSurface = element('shimmer-surface')(
	class ShimmerSurface extends Element3D {
		static observedAttributeHandlers = {
			color: attribute.string(),
		}

		/** Must be a hex color string */
		color = '#ffff0045'

		// root = this.attachShadow({mode: 'open'})

		connectedCallback() {
			super.connectedCallback()

			createEffect(() => this.style.setProperty('--shimmer-color', this.color))
		}

		// css = /*css*/ `
		static css = /*css*/ `
			@keyframes ShimmerEffect {
				0% { transform: translate3d(-15%, -15%, 30px) }
				100% { transform: translate3d(-60%, -60%, 30px) }
			}
			:root {
				--shimmer-color: deeppink;
			}
			:host {
				overflow: hidden;
				perspective: 100000px
			}
			.shimmerSurfaceContent {
				transform-style: preserve-3d;
				/*${this.color} 50%,*/
				background: linear-gradient(
					-45deg,
					rgba(0,0,0,0) 40%,
					var(--shimmer-color) 50%,
					rgba(0,0,0,0) 60%
				);
				background-repeat: repeat;
				background-size: 100% 100%;
				width: 400%; height: 400%;

				/* TODO Report Chrome bug: the animation has to be disabled then re-enabled in devtools to make the yellow gradient appear. */
				animation: ShimmerEffect 1.8s cubic-bezier(0.75, 0.000, 0.25, 1.000) infinite;
			}
		`

		template() {
			return html`<div class="shimmerSurfaceContent"></div>`
		}
	},
)

export const ShimmerCube = element('shimmer-cube')(
	class ShimmerCube extends Element3D {
		static observedAttributeHandlers = {
			color: attribute.string(),
		}

		/** Must be a hex color string */
		color = '#ffff0045'

		template() {
			// prettier-ignore
			const cubeFaceOrientations = [
				[0, 180, 0],
				[0, 0, 0],
				[0, 90, 0],
				[0, 270, 0],
				[90, 0, 0],
				[270, 0, 0],
			]

			return html`
				<lume-box
					id=${() => (this.id ? `${this.id}-box` : '')}
					color="#364659"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					opacity="0.06"
					has="physical-material"
					roughness="0.4"
				>
					<slot></slot>
				</lume-box>
				${cubeFaceOrientations.map(
					orientation => html`
						<shimmer-surface
							id=${() => (this.id ? `${this.id}-shimmer-surface` : '')}
							color=${() => this.color}
							size-mode="proportional proportional proportional"
							size="1 1 1"
							origin="0.5 0.5 0"
							align-point="0 0 0.5"
							rotation="${() => orientation}"
						>
						</shimmer-surface>
					`,
				)}
			`
		}
	},
)
