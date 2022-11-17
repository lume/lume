{
	const {Node, element, html, createEffect} = LUME

	element('av-layout')(
		class Layout extends Node {
			hasShadow = true

			#slideout
			#content

			toggle() {
				this.#slideout.toggle()
			}

			get drawerPosition() {
				return this.#slideout.drawerPosition
			}

			connectedCallback() {
				super.connectedCallback()

				const fadeOpacityTarget = 0.6
				const rotationTarget = 5

				createEffect(() => {
					this.#content.opacity = 1 - this.drawerPosition * (1 - fadeOpacityTarget)
					// untrack(() => this.#content.rotation).y = this.drawerPosition * rotationTarget
				})
			}

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				<lume-slideout
					ref=${el => (this.#slideout = el)}
					id="slideout"
					size="1 1"
					size-mode="p p"
					slideout-width="344"
					slideout-side="right"
					duration="1500"
					content-depth="80"
					show-hint="false"
					fade-opacity="0"
					fade-opacity-comment="set to 0 to disable the fade, we add our own opacity fade in the effect below"
				>
					<lume-element3d slot="slideout" size-mode="p p" size="1 1">
						<slot name="menu"></slot>
					</lume-element3d>
					<lume-element3d ref=${e => (this.#content = e)} slot="content" size-mode="p p" size="1 1">
						<slot name="content"></slot>
					</lume-element3d>
				</lume-slideout>
			`

			css = /*css*/ `
			`
		},
	)
}
