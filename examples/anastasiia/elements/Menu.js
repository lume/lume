{
	const {Node, element, html} = LUME

	element('av-menu')(
		class Menu extends Node {
			hasShadow = true

			// static observedAttributes = {
			// 	foo: attribute.boolean(false),
			// }

			// foo = false

			// the slideout layout, assigned from by parent element
			layout = null

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				<lume-element3d id="menu" size-mode="p p" size="1 1">
					<lume-element3d id="menuBg" opacity="0.8" size="1 1" size-mode="p p"></lume-element3d>
					<nav>
						<div style="position: absolute">
							<header>
								<a class="navLink" href="./TODO.html">
									Work
									<div clickArea></div>
								</a>
								<a class="navLink" href="./TODO.html">
									Work
									<div clickArea></div>
								</a>
							</header>

							<section class="sublinks">
								<a class="navSublink" href="./TODO.html">
									Experiential
									<div clickArea></div>
								</a>
								<a class="navSublink" href="./TODO.html">
									Industrial
									<div clickArea></div>
								</a>
								<a class="navSublink" href="./TODO.html">
									Visual / Digital
									<div clickArea></div>
								</a>
							</section>

							<header>
								<a class="navLink" href="./TODO.html">
									About
									<div clickArea></div>
								</a>
								<a class="navLink" href="./TODO.html">
									About
									<div clickArea></div>
								</a>
							</header>

							<header>
								<a class="navLink" href="./TODO.html">
									Contact
									<div clickArea></div>
								</a>
								<a class="navLink" href="./TODO.html">
									Contact
									<div clickArea></div>
								</a>
							</header>
						</div>
					</nav>

					<av-menu-btn
						onclick=${e => this.layout?.toggle()}
						id="menuBtnClose"
						activated="true"
						size="36 36"
						align-point="1 0"
						mount-point="1 0"
						position="-25 25"
					></av-menu-btn>
				</lume-element3d>
			`

			css = /*css*/ `
				#menu {
					padding: 10px;
				}

				#menuBg {
					/*original not looking like design*/
					/* background: transparent linear-gradient(207deg, rgba(10, 19, 31, 1) 45%, rgba(86, 28, 165, 1) 145%) 0% 0%
						no-repeat padding-box; */
					/*modified looks better*/
					background: transparent linear-gradient(207deg, rgba(10, 19, 31, 1) 65%, rgba(86, 28, 165, 1) 100%) 0% 0%
						no-repeat padding-box;

					backdrop-filter: blur(20px);
				}

				#menu nav {
					width: 100%;
					height: 100%;

					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				#menu a {
					display: block;
					position: relative;
					text-decoration: none;
					text-transform: uppercase;
					text-underline-offset: 0.3em;
				}
				#menu [clickArea] {
					/* border: 1px solid #532c79; */
					position: absolute;
					width: 120%;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				#menu header [clickArea] {
					height: 200%;
				}

				#menu section [clickArea] {
					height: 300%;
				}

				#menu header {
					position: relative;

					margin-bottom: calc(59px * var(--scale));
				}

				#menu header + header {
					margin-top: calc(141px * var(--scale));
				}

				#menu .navLink:first-child {
					font-family: 'Open Sans', sans-serif;
					font-weight: 600;
					font-size: calc(39px * var(--scale));
				}
				#menu .navLink:nth-child(2) {
					font-family: 'Austin-MediumItalic', sans-serif;
					font-weight: 500;
					font-size: calc(43px * var(--scale));
					position: absolute;
					top: 0;
					left: 0;
					transform: translateY(0.13em);
					opacity: 0;
				}

				#menu header:hover .navLink:first-child {
					opacity: 0;
				}
				#menu header:hover .navLink:nth-child(2) {
					opacity: 1;
				}
				#menu header:active .navLink:nth-child(2) {
					text-decoration: underline;
				}

				#menu .sublinks {
					display: contents;
				}

				#menu .navSublink {
					font-family: 'Open Sans', sans-serif;
					font-weight: 600;
					font-size: calc(20px * var(--scale));

					margin-bottom: calc(59px * var(--scale));
				}
				#menu .navSublink:hover {
					font-style: italic;
				}
				#menu .navSublink:active {
					text-decoration: underline;
				}

				#menu .navSublink:last-of-type {
					margin-bottom: calc(100px * var(--scale));
				}
			`
		},
	)
}
