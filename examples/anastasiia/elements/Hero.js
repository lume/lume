{
	const {Node, element, html, attribute} = LUME

	element('av-hero')(
		class MenuBtn extends Node {
			hasShadow = true

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				${
					/*<!-- Hero ###############################################################################################-->
				${/*<!-- <lume-mixed-plane -->*/ ''
				}
				<lume-element3d
					id="hero"
					has="clip-planes"
					clip-planes="#topClip"
					receive-shadow="false"
					size="1 1"
					size-mode="p p"
				>
					<img src="./dreamforce-tree.jpg" />

					<lume-element3d size-mode="p p" size="1 1" style="background: black" opacity="0.5"></lume-element3d>

					<lume-element3d id="titlename" size="400 300" align-point="0 1" mount-point="0 1" position="30 -30 0.01">
						<h1 class="title">
							<span>— CREATIVE DIRECTOR —</span>
						</h1>
						<h1 class="first">
							<span>Anastasiia</span>
						</h1>
						<h1 class="middlelast">
							<span>V. Pea</span>
						</h1>
					</lume-element3d>

					${
						'' /*FIXME empty style tag crashes html template tag*/
						/*<style></style>*/
					}
				</lume-element3d>
				${/*<!-- </lume-mixed-plane> -->*/ ''}
			`

			css = /*css*/ `
				#hero img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: bottom;
				}
				#hero {
					font-family: 'Open Sans', sans-serif;
					text-transform: uppercase;
					line-height: 0.7;
				}
				#titlename {
					display: flex !important;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				#hero h1 {
					margin: 0;
				}
				#hero .title {
					font-size: 15px;
					font-weight: 300;
					line-height: 2.8;
				}
				#hero .first {
					font-family: 'Austin-LightItalic', serif;
					font-weight: 300;
					font-size: 90px;
				}
				#hero .middlelast {
					font-size: 90px;
					font-weight: 700;
					transform: translate(24px, 0);
				}
			`
		},
	)
}
