{
	const {MixedPlane, Node, element, html, attribute} = LUME

	element('featured-projs')(
		// TODO extending from MixedPlane causes major slowdown, while extending
		// from Node does not. Has to do with the `traverseComposedTree`
		// implementation.
		//
		// class extends Node {
		class extends MixedPlane {
			static observedAttributes = {}
			hasShadow = false

			template = () => html`
				<lume-element3d size-mode="proportional" size="1 100"> Featured Projects: </lume-element3d>

				<lume-autolayout
					size-mode="proportional proportional"
					size="1 1"
					visual-format="
						V:|[two][four]
						V:|[one][three]

						H:|[one][two]|
						H:|[three][four]|
					"
				>
					<lume-element3d slot="one" size-mode="p p" size="1 1" style="background: pink;"></lume-element3d>
					<lume-element3d slot="two" size-mode="p p" size="1 1" style="background: pink;"></lume-element3d>
					<lume-element3d slot="three" size-mode="p p" size="1 1" style="background: pink;"></lume-element3d>
					<lume-element3d slot="four" size-mode="p p" size="1 1" style="background: pink;"></lume-element3d>
				</lume-autolayout>
			`

			css = /*css*/ `
			`
		},
	)
}
