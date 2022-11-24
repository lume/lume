{
	const {Node, element, html, createEffect, untrack} = LUME

	const scale = 0.5

	class Categories extends Node {
		hasShadow = true

		connectedCallback() {
			super.connectedCallback()

			const categories = this.shadowRoot.querySelector('#categories')
			const padding = this.shadowRoot.querySelector('#categoriesPadding')

			createEffect(() => {
				untrack(() => padding.size).x = Math.max(0, categories.calculatedSize.x - 165 * scale * 2)
			})
		}

		template = () => html`
			<link rel="stylesheet" href="./global.css" />

			${/*<!-- <lume-mixed-plane -->*/ ''}
			<lume-element3d
				id="categories"
				has="clip-planes"
				clip-planes="#bottomClip"
				size-mode="p p"
				size="1 1"
				receive-shadow="false"
			>
				<lume-element3d id="categoriesPadding" size-mode="l p" size="0 1" align-point="0.5" mount-point="0.5">
					<lume-element3d size="100 64" class="heading"> <span>01.</span><span>&nbsp;Work</span> </lume-element3d>

					<av-category-buttons
						size-mode="p p"
						size="0.8 1"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
						position="0 0 1"
					></av-category-buttons>
				</lume-element3d>
			</lume-element3d>
			${/*<!-- </lume-mixed-plane> -->*/ ''}
		`

		css = /*css*/ `
			#categories > div {
				width: 100%;
				height: 100%;
				text-transform: uppercase;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			#categories a {
				padding-left: 4px;
				padding-right: 4px;

				text-transform: uppercase;
				text-decoration: none;

				font-family: 'Open Sans', sans-serif;
				font-weight: 600;
				font-size: calc(20px * var(--scale));
			}

			#categories a:last-child {
			}

			#categories a.active,
			#categories a:hover,
			#categories a:focus,
			#categories a:active {
				outline: none;
				font-family: 'Austin-Semibold', serif;
				font-size: calc(22px * var(--scale));
				text-decoration: underline;
				text-decoration-color: var(--purple);
				text-underline-offset: calc(9px * var(--scale));
				text-decoration-thickness: calc(4px * var(--scale));
			}

			#categories .heading {
				display: flex !important;
				align-items: center;
				color: var(--purple);
				font-size: calc(30px * var(--scale));
				font-family: 'Austin-MediumItalic', serif;
				text-transform: uppercase;
			}
			#categories .heading span:first-child {
				font-family: 'Austin-LightItalic', serif;
				font-weight: 100;
			}
		`
	}

	element('av-categories')(Categories)

	class CategoryChange extends CustomEvent {
		constructor(/** @type {string} */ category) {
			super('categorychange', {bubbles: true, composed: true, detail: category})
		}
	}
}
