/* @checkJs */
{
	const {Node, element, html, ScrollFling, createEffect, untrack, onCleanup, variable, Motor} = LUME

	element('av-content')(
		class Content extends Node {
			hasShadow = true

			// static observedAttributes = {
			// 	activated: attribute.boolean(false),
			// }

			// activated = false

			#menuBtnOpen
			#scrollContent
			#scrollknob
			#logo
			#categoriesInner
			#featured
			#otherProjects

			connectedCallback() {
				super.connectedCallback()

				this.#menuBtnOpen.onclick = () => this.layout?.toggle()

				createEffect(() => {
					this.#menuBtnOpen.opacity = 1 - layout.drawerPosition * (1 - 0)
				})

				// BEFORE making fling reactive ////////////////////////////////////////////

				// const fling = new ScrollFling({
				// 	target: scene,
				// 	y: 0,
				// 	minY: 0,
				// 	maxY: 2000,
				// 	scrollFactor: 0.3,
				// }).start()

				// createEffect(() => {
				// 	fling.y

				// 	untrack(() => {
				// 		this.#scrollContent.position.y = -fling.y
				// 		this.#scrollknob.alignPoint.y = fling.y / 2000
				// 		this.#scrollknob.mountPoint.y = fling.y / 2000
				// 	})
				// })

				// AFTER making fling reactive ////////////////////////////////////////////

				let scrollRatio = 0

				const tiny = 0.000000000000000000001
				const scrollableAmount = variable(0)
				const contentHeight = variable(0)

				// Scroll implementation //////////////////////////////////////////////////////////////////////
				createEffect(() => {
					let _contentHeight = 0

					// reactive dependencies (child.calculatedSize)
					for (const child of Array.from(this.#scrollContent.children)) {
						_contentHeight += child.calculatedSize.y
					}

					contentHeight(_contentHeight)

					// Using Math.max here to prevent negative numbers in case content is smaller than scroll area.
					scrollableAmount(Math.max(0, _contentHeight - this.#scrollContent.calculatedSize.y))

					// In firefox scene is initially null here, but not in Safari. Huh.
					if (!this.scene) return

					// debugger
					// TODO make scrollfling fully updateable, avoid creating a new one each time.
					const fling = new ScrollFling({
						target: untrack(() => this.scene),
						y: scrollRatio * untrack(scrollableAmount),
						minY: 0,
						// The `|| tiny` prevents divide by zero errors.
						maxY: untrack(scrollableAmount) || tiny,
						scrollFactor: 0.3,
					})

					if (untrack(() => fling.y === undefined)) debugger

					fling.start()

					createEffect(() => {
						fling.y

						untrack(() => {
							this.#scrollContent.position.y = -(fling.y || 0)

							// FIXME
							// scrollRatio = (fling.y || 0) / (scrollableAmount() || tiny) // fling.y is undefined for some weird reason after making a new instance, and sets scrollRatio to 0.
							scrollRatio = fling.y ? fling.y / (scrollableAmount() || tiny) : scrollRatio // so instead set to the previous value, but we shouldn't need to do this || trick.

							this.#scrollknob.alignPoint.y = scrollRatio
							this.#scrollknob.mountPoint.y = scrollRatio
						})
					})

					onCleanup(() => fling.stop())
				})

				createEffect(() => {
					if (this.#scrollContent.calculatedSize.y / (contentHeight() || tiny) >= 1) {
						untrack(() => this.#scrollknob.size).y = 0
						return
					}
					untrack(() => this.#scrollknob.size).y = Math.max(
						10,
						(this.#scrollContent.calculatedSize.y / (contentHeight() || tiny)) * this.#scrollContent.calculatedSize.y,
					)
				})

				// second light ///////////////////////////////////////////////////////////////////
				// document.addEventListener('pointermove', event => {
				// 	pointlight2.position.set(event.clientX, event.clientY)
				// })

				// Logo ////////////////////////////////////////////////////////////////////////

				/** @param {HTMLImageElement} img */
				function onLoad(img, fn) {
					if (img.complete) fn()
					else img.addEventListener('load', fn, {once: true})
				}

				/** @type {HTMLImageElement} */
				onLoad(this.#logo, () => {
					createEffect(() => {})
				})

				// categories layout //////////////////////////////////////////////////////////////////////////////////////////////
				categoriesLayout.call(this)
				async function categoriesLayout() {
					const {default: yoga} = await import('https://jspm.dev/yoga-layout')
					const {Node: YogaNode} = yoga

					const yogaRoot = YogaNode.create()
					yogaRoot.setJustifyContent(yoga.JUSTIFY_SPACE_EVENLY)
					yogaRoot.setAlignItems(yoga.ALIGN_CENTER)
					yogaRoot.setFlexDirection(yoga.FLEX_DIRECTION_ROW)

					const children = Array.from(this.#categoriesInner.children)

					const yogaNodes = []

					let i = 0
					for (const child of children) {
						const yogaNode = YogaNode.create()

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

				let queuedLayout = false

				const updateLayout = () => {
					if (queuedLayout) return
					queuedLayout = true
					queueMicrotask(() => {
						queuedLayout = false

						const visualFormat = /*vfl*/ `
							V:|[hero(85%)][categories(125)][featured(${featuredHeight})][skills(282)][other(${otherHeight})][letsconnect(540)]

							H:|[hero]|
							H:|[categories]|
							H:|[featured]|
							H:|[skills]|
							H:|[other]|
							H:|[letsconnect]|
						`
						this.#scrollContent.visualFormat = visualFormat
					})
				}

				this.isos = []

				const isotopeLayout = gridEl => {
					const iso = new Isotope(gridEl, {
						itemSelector: '.card',
						layoutMode: 'fitRows',
					})

					this.isos.push(iso)

					const relayout = () => iso.layout()

					// Do the best we can initially.
					relayout()

					// Relayout on container size change all the time (isotope
					// defaults to debounced 100ms after any resizing)
					const ro = new ResizeObserver(relayout)
					ro.observe(gridEl)

					// Perform layouts on document state change until the window
					// is loaded (complete) to give time for things to
					// initialize and to do the best we can meanwhile (f.e.
					// sizing of LUME elements happens after scripts and things
					// are loaded).
					document.addEventListener('readystatechange', function change() {
						relayout()
						if (document.readyState === 'complete') document.removeEventListener('readystatechange', change)
					})

					// catches the case when the window was not initially in
					// focus and we switch to it, otherwise the layout will not
					// be based on LUME sizing (which depends on rAF).
					requestAnimationFrame(relayout)
				}

				// Featured Products sizing based on children ///////////////////////////////////////////////////////////////////////////
				let featuredHeight = 0
				if (true) {
					// TODO height should be based on all children, not just one?
					/** @type {HTMLElement} */
					const container = this.#featured.children[0]

					const observer = new ResizeObserver(() => {
						// The early returns prevent an issue where when we set
						// visualFormat below, it causes an infinite resize loop,
						// because the observed container momentarily resizes every
						// time a new layout is created. As to why this happens, the
						// size goes to zero and back when the autolayout's internal
						// layout nodes are updated or re-created. Can we fix that?
						if (container.offsetHeight === 0) return
						if (featuredHeight === container.offsetHeight) return

						featuredHeight = container.offsetHeight

						updateLayout()
					})

					observer.observe(container)

					const grid = this.shadowRoot.querySelector('.featuredGrid')
					isotopeLayout(grid)
				}

				// Other Projects sizing based on children ///////////////////////////////////////////////////////////////////////////
				let otherHeight = 0
				if (true) {
					/** @type {HTMLElement} */
					const container = this.#otherProjects.children[0]

					const observer = new ResizeObserver(() => {
						// The early returns prevent an issue where when we set
						// visualFormat below, it causes an infinite resize loop,
						// because the observed container momentarily resizes every
						// time a new layout is created. As to why this happens, the
						// size goes to zero and back when the autolayout's internal
						// layout nodes are updated or re-created. Can we fix that?
						if (container.offsetHeight === 0) return
						if (otherHeight === container.offsetHeight) return

						otherHeight = container.offsetHeight

						updateLayout()
					})

					observer.observe(container)

					const grid = this.shadowRoot.querySelector('.otherProjectsGrid')
					isotopeLayout(grid)
				}

				// Animate things in
				if (true) {
					function fadeIn(element, delay) {
						setTimeout(() => {
							if (element.isElement3D) {
								element.opacity = 0

								Motor.addRenderTask(() => {
									element.opacity += 0.02
									if (element.opacity >= 1) {
										element.opacity = 1
										return false
									}
								})
							} else {
								element.classList.remove('hide')

								// let opacity = 0
								// element.style.opacity = opacity

								// // TODO time based instead of incremental.
								// Motor.addRenderTask(() => {
								// 	opacity += 0.15
								// 	element.style.opacity = opacity
								// 	if (opacity >= 1) {
								// 		element.style.opacity = 1
								// 		return false
								// 	}
								// })
							}
						}, delay)
					}

					const observer = new IntersectionObserver(
						entries => {
							let itemNum = 0
							entries.forEach(entry => {
								if (entry.intersectionRatio > 0) {
									fadeIn(entry.target, ++itemNum * 150)
									observer.unobserve(entry.target)
								}
							})
						},
						// {
						// 	threshold: Array.from({length: 100}).map((_, i) => i / 100),
						// },
					)

					const children = this.#scrollContent.children

					for (let i = 0; i < children.length; i++) observer.observe(children[i])

					const cards = this.#scrollContent.querySelectorAll('.card')

					for (let i = 0; i < cards.length; i++) observer.observe(cards[i])
				}
			}

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				<lume-autolayout
					id="headerbody"
					visual-format="
						V:|[header(82)]
						V:|[body]|
						H:|[header]|
						H:|[body]|
					"
					size="1 1"
					size-mode="p p"
				>
					<style>
						#headerbody {
							/* Flattens 3D CSS rendering */
							/* overflow: hidden; */

							background: #0a131f;
						}
					</style>

					${
						'' /*<!-- Header ###############################################################################################-->*/
					}
					${'' /*<!-- <lume-element3d id="header" slot="header" size="1 1" size-mode="p p" position="0 0 0.1"> -->*/}
					<lume-mixed-plane id="header" slot="header" size="1 1" size-mode="p p" position="0 0 0.1">
						<div class="bg"></div>

						<style>
							#header > .bg {
								width: 100%;
								height: 100%;
								background: rgba(0, 0, 0, 0.45);
								backdrop-filter: blur(20px);
							}
						</style>

						${
							'' /*<!-- Logo ###############################################################################################-->*/
						}
						<lume-element3d align-point="0 0.5" mount-point="0 0.5" position="25">
							${'' /*<!-- TODO replace with webgl circle -->*/}
							<lume-element3d ref=${e => (this.#logo = e)} id="logo" mount-point="0 0.5">
								<img src="./logo.svg" />
							</lume-element3d>
							<style>
								#logo img {
									scale: 0.5;
								}
								#logo {
									display: flex !important;
									justify-content: flex-start;
									align-items: center;
								}
							</style>
						</lume-element3d>

						${
							/*<!-- Menu Button ############################################################################################### -->*/ ''
						}
						<av-menu-btn
							ref=${e => (this.#menuBtnOpen = e)}
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

					<lume-element3d id="scroller" slot="body" size="1 1" size-mode="p p">
						<lume-autolayout
							ref=${e => (this.#scrollContent = e)}
							id="scrollContent"
							slot="content"
							visual-format="
								V:|[hero(85%)][categories(125)][featured(0)][skills(282)][other(1200)][letsconnect(540)]

								H:|[hero]|
								H:|[categories]|
								H:|[featured]|
								H:|[skills]|
								H:|[other]|
								H:|[letsconnect]|
							"
							size="1 1"
							size-mode="p p"
						>
							<av-hero opacity="0" slot="hero" size="1 1" size-mode="p p"></av-hero>
							${
								/*<!-- Categories ###############################################################################################-->*/ ''
							}
							${/*<!-- <lume-mixed-plane -->*/ ''}
							<lume-element3d
								id="categories"
								slot="categories"
								opacity="0"
								has="clip-planes"
								clip-planes="#bottomClip"
								size-mode="p p"
								size="1 1"
								receive-shadow="false"
							>
								<lume-element3d size="100 64" class="heading centerContent">
									<span>01.</span><span>&nbsp;Work</span>
								</lume-element3d>

								${/*<!-- layout is calculated in JS -->*/ ''}
								<lume-element3d
									ref=${e => (this.#categoriesInner = e)}
									id="categoriesInner"
									size-mode="p p"
									size="0.8 1"
									align-point="0.5 0.5"
									mount-point="0.5 0.5"
								>
									<lume-element3d class="centerContent" size="200 100">
										<a
											href="experiential"
											onclick=${e => {
												e.preventDefault()
												this.isos.forEach(iso => iso.arrange({filter: '.typeExperiential'}))
											}}
											>Experiential</a
										>
									</lume-element3d>
									<lume-element3d class="centerContent" size="200 100">
										<a
											href="industrial"
											onclick=${e => {
												e.preventDefault()
												this.isos.forEach(iso => iso.arrange({filter: '.typeIndustrial'}))
											}}
											>Industrial</a
										>
									</lume-element3d>
									<lume-element3d class="centerContent" size="200 100">
										<a
											href="visual"
											onclick=${e => {
												e.preventDefault()
												this.isos.forEach(iso => iso.arrange({filter: '.typeVisual'}))
											}}
											>Visual / Digital</a
										>
									</lume-element3d>

									${
										/*<!-- <div class="centerContent" size="200 100">
										<a href="./TODO.html">Experiential</a>
									</div>
									<div class="centerContent" size="200 100">
										<a href="./TODO.html">Industrial</a>
									</div>
									<div class="centerContent" size="200 100">
										<a href="./TODO.html">Visual / Digital</a>
									</div> -->*/ ''
									}
								</lume-element3d>

								<style>
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
										color: var(--purple);
										font-size: calc(30px * var(--scale));
										font-family: 'Austin-MediumItalic', serif;
										text-transform: uppercase;
									}
									#categories .heading span:first-child {
										font-family: 'Austin-LightItalic', serif;
									}

									#categoriesInner {
										/* display: flex !important;
										flex-direction: row;
										justify-content: space-evenly;
										align-items: center; */
									}

									#categoriesInner > * {
										/* width: 300px;
										height: 100px; */
									}
								</style>
							</lume-element3d>
							${/*<!-- </lume-mixed-plane> -->*/ ''}
							${
								/*<!-- Featured Products ########################################################################################## -->*/ ''
							}
							${
								/*<!-- <featured-projs
								ref=${e => (this.#featured = e)}
								id="featured"
								slot="featured"
								size-mode="p p"
								size="1 1"
								Xhas="clip-planes"
								Xclip-planes="#bottomClip"
							> -->*/ ''
							}
							<lume-element3d
								ref=${e => (this.#featured = e)}
								id="featured"
								slot="featured"
								opacity="0"
								size-mode="p p"
								size="1 1"
							>
								<div>
									<div>Featured</div>
									<div class="flex-row featuredGrid">
										<div class="card hide typeExperiential">
											<div class="cardContent">
												<img src="./imgs/Dreamforce thumb big.jpeg" />
												<h2>Dreamforce 2019</h2>
												<p>
													Campground is the main expo of an annual four day event that brings together global Salesforce
													community.
												</p>
											</div>
										</div>
										<div class="card hide typeIndustrial">
											<div class="cardContent">
												<img src="./imgs/Google NEXT thumb big.jpeg" />
												<h2>Google Next</h2>
												<p>
													Google’s flagship event. The biggest cloud conference of the year for entrepreneurs, business
													leaders and developers.
												</p>
											</div>
										</div>
										<div class="card hide typeVisual">
											<div class="cardContent">
												<img src="./imgs/Salesforce Connections thumb big.jpeg" />
												<h2>Salesforce Connections 2019</h2>
												<p>
													Salesforce Connections is a conference that is geared towards digital marketing and commerce
													using Salesforce platform.
												</p>
											</div>
										</div>
										<div class="card hide typeExperiential">
											<div class="cardContent">
												<img src="./imgs/Funimation thumb big.jpeg" />
												<h2>Funimation</h2>
												<p>Funimation event experience creates the portal to a world of extraordinary anime.</p>
											</div>
										</div>
										<div class="card hide typeIndustrial">
											<div class="cardContent">
												<img src="./imgs/Wisk thumb big.jpeg" />
												<h2>Wisk</h2>
												<p>Product reveal of a vertical takeoff flying aircraft.</p>
											</div>
										</div>
										<div class="card hide typeVisual">
											<div class="cardContent">
												<img src="./imgs/GE LOGIQ thumb big.jpeg" />
												<h2>GE Logiq Ultrasound</h2>
												<p>Product launch through marketing website.</p>
											</div>
										</div>
									</div>
								</div>
								<style>
									/* flex layout inspired by https://codepen.io/AaronTeering/pen/GRdoLMW */
									.flex-row {
										/* position: absolute; */

										/* display: flex;
										flex-direction: row;
										flex-wrap: wrap; */

										--flex-margin: 24px;
										--transition-time: 0.6s;
									}

									.flex-row .card {
										max-width: calc(25% - (var(--flex-margin) * 2 + 1px));
										width: calc(25% - (var(--flex-margin) * 2 + 1px));
										margin: var(--flex-margin);
										/* background: #fafafa; */
										/* border-radius: 10px; */
										/* transition: var(--transition-time); */
										overflow: visible;
									}

									.flex-row .card img {
										width: 100%;
										aspect-ratio: 1;
										object-fit: cover;
										border-radius: 0;
										transition: border-radius var(--transition-time);
									}

									.flex-row .card:hover .cardContent {
										transform: scale(1.03);
										/* box-shadow: 0px 0px 50px -20px #808080; */
									}

									.flex-row .card:hover img {
										border-radius: 100%;
									}

									.cardContent {
										transition: transform var(--transition-time);
									}

									@media screen and (max-width: 1600px) {
										.flex-row .card {
											max-width: calc(33% - (var(--flex-margin) * 2 + 1px));
											width: calc(33% - (var(--flex-margin) * 2 + 1px));
										}
									}

									@media screen and (max-width: 1080px) {
										.flex-row .card {
											max-width: calc(50% - (var(--flex-margin) * 2 + 1px));
											width: calc(50% - (var(--flex-margin) * 2 + 1px));
										}
									}

									@media screen and (max-width: 600px) {
										.flex-row .card {
											max-width: calc(100% - (var(--flex-margin) * 2 + 1px));
											width: calc(100% - (var(--flex-margin) * 2 + 1px));
										}
									}

									.card {
										transition: opacity var(--fadeInDuration, 0.5s);

										font-family: 'Open Sans', sans-serif;
										font-weight: 400;
										font-size: calc(20px * var(--scale));
									}

									.card h2 {
										font-weight: 600;
										font-size: calc(25px * var(--scale));
										text-transform: uppercase;
									}
								</style>
							</lume-element3d>
							${/*<!-- </featured-projs> -->*/ ''}
							${
								/*<!-- Skills description ######################################################################################### -->*/ ''
							}
							<av-skills-banner opacity="0" size-mode="p p" size="1 1" slot="skills"></av-skills-banner>

							${
								/*<!-- Other projects ############################################################################################# -->*/ ''
							}
							<lume-element3d
								ref=${e => (this.#otherProjects = e)}
								id="otherProjects"
								slot="other"
								opacity="0"
								size-mode="p p"
								size="1 1"
							>
								<div class="flex-row otherProjectsGrid">
									<div class="card hide typeExperiential">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeIndustrial">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeVisual">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeExperiential">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeIndustrial">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeVisual">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeExperiential">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeIndustrial">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeVisual">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide typeExperiential">
										<img src="./dreamforce-tree.jpg" />
									</div>
								</div>
								<style>
									#otherProjects .flex-row {
										--flex-margin: 10px;
									}
								</style>
							</lume-element3d>

							${
								/*<!-- Connect #################################################################################################### -->*/ ''
							}
							<lume-element3d id="letsconnect" slot="letsconnect" opacity="0" size-mode="p p" size="1 1">
								<div left>
									<h2>
										<span>Ready to make something</span>
										<br />
										<span>Awesome?</span>
									</h2>
									<p>
										I AM ALWAYS CURIOUS TO MEET NEW PEOPLE AND VALUE KEEPING RELATIONSHIPS. IF YOU WANT TO CHAT ABOUT
										WORK OR LIFE, SEND ME A NOTE TO
									</p>
									<p>
										<a href="mailto:vnastasia@gmail.com"><span>vnastasia@gmail.com</span> </a>
									</p>
								</div>
								<div right>
									<div>
										<a href="https://twitter.com/vedernikova">@vedernikova</a>
									</div>
									<div>
										<a href="https://www.instagram.com/anastasia.vpea/">@anastasia.vpea</a>
									</div>
								</div>
								<style>
									#letsconnect {
										display: flex !important;
										align-items: flex-end;
										padding: 0 calc(157px * var(--scale)) calc(157px * var(--scale));
									}

									#letsconnect [left] {
										width: 80%;
										padding-left: 20px;

										display: flex;
										flex-direction: column;
									}

									/* TODO scaled sizes */
									#letsconnect [left] h2 {
										font-size: 90px;
									}

									#letsconnect [left] span:nth-of-type(2) {
										padding-left: 84px;
									}

									#letsconnect [left] p {
										font-size: 20px;
									}

									#letsconnect [left] a {
										font-size: 30px;
										text-transform: uppercase;
										background: #8145bfb3;
										padding: 10px;
									}

									#letsconnect [right] {
										width: 20%;

										display: flex;
										flex-direction: column;
									}
								</style>
							</lume-element3d>
						</lume-autolayout>

						<lume-clip-plane
							id="topClip"
							sidedness="double"
							rotation="90 0 0"
							align-point="0 0"
							mount-point="0 0.5"
							size="1 100"
							size-mode="p"
							color="green"
						></lume-clip-plane>
						<lume-clip-plane
							id="bottomClip"
							sidedness="double"
							rotation="-90 0 0"
							align-point="0 1"
							mount-point="0 0.5"
							size="1 100"
							size-mode="p"
							color=""
						></lume-clip-plane>

						<lume-element3d
							ref=${e => (this.#scrollknob = e)}
							id="scrollknob"
							size="10 10 0"
							align-point="1 0"
							mount-point="1 0"
							position="0 0 0.2"
						>
							<style>
								#scrollknob {
									background: rgba(255, 255, 255, 0.2);
								}
							</style>
						</lume-element3d>
					</lume-element3d>
				</lume-autolayout>

				<svg>
					<filter id="wavy">
						<feTurbulence x="-30" y="0" baseFrequency="0.006" numOctaves="1" speed="1">
							<!-- <animate attributeName="baseFrequency" dur="3s" values="0.003; 0.009; 0.003" repeatCount="indefinite" /> -->
						</feTurbulence>
						<feDisplacementMap in="SourceGraphic" scale="10" />
					</filter>
				</svg>
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
					font-family: 'Austin-MediumItalic', serif;
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
