{
	const {Node, element, html} = LUME

	element('av-header')(
		class Header extends Node {
			hasShadow = true

			#onClickCategory = () => {}

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				${'' /*<!-- <lume-element3d size="1 1" size-mode="p p"> -->*/}
				<lume-mixed-plane size="1 1" size-mode="p p">
					<div class="bg"></div>

					${
						'' /*<!-- Logo ###############################################################################################-->*/
					}
					<lume-element3d align-point="0 0.5" mount-point="0 0.5" position="25">
						${'' /*<!-- TODO replace with webgl circle -->*/}
						<lume-element3d id="logo" mount-point="0 0.5">
							<img src="./logo.svg" />
						</lume-element3d>
					</lume-element3d>

					${'' /* categories */}
					<av-category-buttons
						size-mode="p p"
						size="0.8 1"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					></av-category-buttons>

					${
						'' /* Menu Button ############################################################################################### */
					}
					<av-menu-btn
						onclick=${e => this.dispatchEvent(new MenubtnclickEvent())}
						id="menuBtnOpen"
						activated="false"
						TODO="scaled sizes"
						size="36 36"
						align-point="1 0.5"
						mount-point="1 0.5"
						position="-25"
					></av-menu-btn>
				</lume-mixed-plane>
				${'' /*<!-- </lume-element3d> -->*/}
			`

			css = /*css*/ `
				.bg {
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.45);
					backdrop-filter: blur(20px);
				}

				#logo img {
					scale: 0.5;
				}
				#logo {
					display: flex !important;
					justify-content: flex-start;
					align-items: center;
				}
			`
		},
	)

	class MenubtnclickEvent extends CustomEvent {
		constructor() {
			super('menubtnclick', {bubbles: true, composed: true})
		}
	}
}
