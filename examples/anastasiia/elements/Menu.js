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
						${'' /* wrapper div is a trick so that centered flex content is left aligned in the middle of the menu */}
						<div>
							<header>
								<a class="navLink" href="./TODO.html">
									Work
									<div clickArea></div>
								</a>
								<a class="navLink" href="./TODO.html">
									Work
									<div clickArea></div>
								</a>
								<span class="pageNumber">01.</span>
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
								<span class="pageNumber">02.</span>
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
								<span class="pageNumber">03.</span>
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
					padding: calc(20px * var(--scale));
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

				nav {
					width: 100%;
					height: 100%;

					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				a {
					display: block;
					position: relative;
					text-decoration: none;
					text-transform: uppercase;
					text-underline-offset: 0.3em;
				}

				header,
				section {
					position: relative;
				}

				header {
					position: relative;

					margin-bottom: calc(59px * var(--scale));
				}

				header + header {
					margin-top: calc(141px * var(--scale));
				}

				.pageNumber {
					position: absolute;
					bottom: 64%;
					right: 102%;
				}

				[clickArea] {
					/* border: 1px solid #532c79; */ /* debug */
					position: absolute;
					width: 120%;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				header [clickArea] {
					height: 200%;
				}

				section [clickArea] {
					height: 300%;
				}

				.navLink:first-child {
					font-family: 'Open Sans', sans-serif;
					font-weight: 600; /*semibold*/
					font-size: calc(39px * var(--scale));
					letter-spacing: calc(0.58px * var(--scale));
				}
				.navLink:nth-child(2) {
					font-family: 'Austin-MediumItalic', sans-serif;
					font-weight: 500;
					font-size: calc(43px * var(--scale));
					letter-spacing: calc(0.65px * var(--scale));
					text-decoration: underline;
					text-decoration-thickness: calc(2px * var(--scale));;
					position: absolute;
					top: 0;
					left: 0;
					transform: translateY(0.13em);
					opacity: 0;
				}

				header:hover .navLink:first-child {
					opacity: 0;
				}
				header:hover .navLink:nth-child(2) {
					opacity: 1;
				}
				header:active .navLink:nth-child(2) {
					text-decoration: underline;
				}

				.sublinks {
					display: contents;
				}

				.navSublink {
					font-family: 'Open Sans', sans-serif;
					font-weight: 600; /*semibold*/
					font-size: calc(20px * var(--scale));
					letter-spacing: calc(0.3px * var(--scale));

					margin-bottom: calc(59px * var(--scale));
				}
				.navSublink:hover {
					font-style: italic;
				/*}
				.navSublink:active {*/
					text-decoration: underline;
				}

				.navSublink:last-of-type {
					margin-bottom: calc(100px * var(--scale));
				}
			`
		},
	)
}
