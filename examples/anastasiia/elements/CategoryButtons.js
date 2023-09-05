{
	const {Node, element, html, createEffect, untrack} = LUME

	element('av-category-buttons')(
		class CategoryButtons extends Node {
			hasShadow = true

			#categoriesInner

			async categoriesLayout() {
				// Note, yoga 2.0 breaks the layout, needs migration
				const {default: yoga} = await import('https://jspm.dev/yoga-layout@1.9.3')

				const yogaRoot = yoga.Node.create()
				yogaRoot.setJustifyContent(yoga.JUSTIFY_SPACE_EVENLY)
				yogaRoot.setAlignItems(yoga.ALIGN_CENTER)
				yogaRoot.setFlexDirection(yoga.FLEX_DIRECTION_ROW)

				const children = Array.from(this.#categoriesInner.children)

				const yogaNodes = []

				let i = 0
				for (const child of children) {
					const yogaNode = yoga.Node.create()

					yogaNodes.push(yogaNode)
					yogaRoot.insertChild(yogaNode, i)

					i++
				}

				createEffect(() => {
					const parentSize = this.#categoriesInner.calculatedSize

					yogaRoot.setWidth(parentSize.x)
					yogaRoot.setHeight(parentSize.y)

					let i = 0
					for (const child of children) {
						const {x, y} = child.calculatedSize

						const node = yogaNodes[i]
						node.setWidth(x)
						node.setHeight(y)

						i++
					}

					yogaRoot.calculateLayout(parentSize.x, parentSize.y, yoga.DIRECTION_LTR)

					i = 0
					for (const child of children) {
						const yogaNode = yogaNodes[i]
						yogaNode.calculateLayout()
						const {left, top, width, height} = yogaNode.getComputedLayout()

						untrack(() => child.position).set(left, top)
						// untrack(() => child.position).set(top, left)
						// child.size.set(width, height)

						i++
					}
				})
			}

			connectedCallback() {
				super.connectedCallback()
				this.categoriesLayout()
			}

			#onClickCategory = e => {
				e.preventDefault()
				this.dispatchEvent(new CategoryChange(e.target.href.split('#')[1]))
			}

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				${/*<!-- layout is calculated in JS -->*/ ''}
				<lume-element3d ref=${e => (this.#categoriesInner = e)} id="categoriesInner" size-mode="p p" size="1 1">
					<lume-element3d class="centerContent" size="200 100">
						<a href="#experiential" onclick=${this.#onClickCategory}>Experiential</a>
					</lume-element3d>
					<lume-element3d class="centerContent" size="200 100">
						<a href="#industrial" onclick=${this.#onClickCategory}>Industrial</a>
					</lume-element3d>
					<lume-element3d class="centerContent" size="200 100">
						<a href="#visual" onclick=${this.#onClickCategory}>Visual / Digital</a>
					</lume-element3d>
				</lume-element3d>
			`

			css = /*css*/ `
				#categoriesInner {
					overflow: hidden;
				}

				a {
					text-transform: uppercase;
					text-decoration: none;

					font-family: 'Open Sans', sans-serif;
					font-weight: 600;
					font-size: calc(20px * var(--scale));
					letter-spacing: calc(0.3px * var(--scale));
				}

				a.active,
				a:hover,
				a:focus,
				a:active {
					outline: none;
					font-family: 'Austin-Semibold', serif;
					font-size: calc(22px * var(--scale));
					letter-spacing: calc(0.33px * var(--scale));
					text-decoration: underline;
					text-decoration-color: var(--purple);
					text-underline-offset: calc(9px * var(--scale));
					text-decoration-thickness: calc(4px * var(--scale));
				}

				.heading {
					display: flex !important;
					align-items: center;
					color: var(--purple);
					font-size: calc(30px * var(--scale));
					font-family: 'Austin-MediumItalic', serif;
					text-transform: uppercase;
				}
				.heading span:first-child {
					font-family: 'Austin-LightItalic', serif;
					font-weight: 100;
				}
			`
		},
	)

	class CategoryChange extends CustomEvent {
		constructor(/** @type {string} */ category) {
			super('categorychange', {bubbles: true, composed: true, detail: category})
		}
	}
}
