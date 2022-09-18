{
	const {Node, element, html, attribute} = LUME

	element('av-menu-btn')(
		class MenuBtn extends Node {
			hasShadow = true

			static observedAttributes = {
				activated: attribute.boolean(false),
			}

			activated = false

			constructor() {
				super()

				// Default size.
				this.size.set(36, 36, 0)
			}

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				<!-- TODO replace with webgl square -->
				<div class="square"></div>

				<slot name="lines">
					<!-- TODO replace with webgl lines -->
					<lume-element3d
						class="menuBtnLine"
						size-mode="proportional"
						size="0.5 1.5"
						mount-point="0.5 0.5"
						align-point=${[0.5, this.activated ? 0.5 : 0.35]}
						rotation=${[0, 0, this.activated ? 45 : 0]}
					></lume-element3d>
					<lume-element3d
						class="menuBtnLine"
						size-mode="proportional"
						size="0.5 1.5"
						mount-point="0.5 0.5"
						align-point="0.5 0.5"
						opacity=${this.activated ? 0 : 1}
					></lume-element3d>
					<lume-element3d
						class="menuBtnLine"
						size-mode="proportional"
						size="0.5 1.5"
						mount-point="0.5 0.5"
						align-point=${[0.5, this.activated ? 0.5 : 0.65]}
						rotation=${[0, 0, this.activated ? -45 : 0]}
					></lume-element3d>
				</slot>

				<slot></slot>
			`

			css = /*css*/ `
				:host * {
					cursor: pointer;
				}

				:host .square {
					width: 100%;
					height: 100%;
					border: 1.5px solid white;
					box-sizing: border-box;
				}

				:host .menuBtnLine {
					background: white;
				}
			`
		},
	)
}
