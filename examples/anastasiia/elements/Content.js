/* @checkJs */
{
	const {Node, element, html, ScrollFling, createEffect, untrack, onCleanup, variable, Motor} = LUME

	element('av-content')(
		class Content extends Node {
			hasShadow = true

			// the slideout layout, assigned from by parent element
			layout = null

			// #menuBtnOpen
			#scrollContainer
			#scrollknob
			// #logo
			#featured
			#otherProjects

			connectedCallback() {
				super.connectedCallback()

				// this.#menuBtnOpen.onclick = () => this.layout?.toggle()

				// createEffect(() => {
				// 	this.#menuBtnOpen.opacity = 1 - layout.drawerPosition * (1 - 0)
				// })

				// Scroll implementation //////////////////////////////////////////////////////////////////////

				// BEFORE making fling reactive ////////////////////////

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
				// 		this.#scrollContainer.position.y = -fling.y
				// 		this.#scrollknob.alignPoint.y = fling.y / 2000
				// 		this.#scrollknob.mountPoint.y = fling.y / 2000
				// 	})
				// })

				// AFTER making fling reactive ////////////////////////

				let scrollRatio = 0
				let amountScrolled = 0

				const tiny = 0.000000000000000000001
				const scrollableAmount = variable(0)
				const contentHeight = variable(0)

				createEffect(() => {
					let _contentHeight = 0

					// reactive dependencies (child.calculatedSize)
					for (const child of Array.from(this.#scrollContainer.children)) {
						_contentHeight += child.calculatedSize.y
					}

					contentHeight(_contentHeight)

					// Using Math.max here to prevent negative numbers in case content is smaller than scroll area.
					scrollableAmount(Math.max(0, _contentHeight - this.#scrollContainer.calculatedSize.y))

					// In firefox scene is initially null here, but not in Safari. Huh.
					if (!this.scene) return

					// debugger
					// TODO make scrollfling (and other flings) fully updateable, avoid creating a new one each time.
					console.log('make new fling', amountScrolled, scrollRatio, scrollRatio * untrack(scrollableAmount))
					const fling = new ScrollFling({
						target: untrack(() => this.scene),
						// y: scrollRatio * untrack(scrollableAmount),
						// Use Math.min in case the page is at the end, so that the viewport won't be scrolled beyond the end of content in case content height shrunk.
						y: Math.min(amountScrolled, untrack(scrollableAmount)),
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
							this.#scrollContainer.position.y = -(fling.y || 0)
							console.log('scroll content Y:', this.#scrollContainer.position.y)

							// FIXME, this conditional checking is because of values-in-the-past, which should be fixed in Solid 1.5
							scrollRatio = fling.y ? fling.y / (scrollableAmount() || tiny) : scrollRatio
							amountScrolled = fling.y ?? amountScrolled
							console.log('scroll content Y:', fling.y, amountScrolled)

							this.#scrollknob.alignPoint.y = scrollRatio
							this.#scrollknob.mountPoint.y = scrollRatio
						})
					})

					onCleanup(() => fling.stop())
				})

				createEffect(() => {
					// if y size is 0, the || tiny prevents NaN
					if (this.#scrollContainer.calculatedSize.y / (contentHeight() || tiny) >= 1) {
						untrack(() => this.#scrollknob.size).y = 0
						return
					}
					console.log('scroll content size changed')
					untrack(() => this.#scrollknob.size).y = Math.max(
						10,
						(this.#scrollContainer.calculatedSize.y / (contentHeight() || tiny)) *
							this.#scrollContainer.calculatedSize.y,
					)
				})

				// second light ///////////////////////////////////////////////////////////////////
				// document.addEventListener('pointermove', event => {
				// 	pointlight2.position.set(event.clientX, event.clientY)
				// })

				// Logo ////////////////////////////////////////////////////////////////////////

				// /** @param {HTMLImageElement} img */
				// function onLoad(img, fn) {
				// 	if (img.complete) fn()
				// 	else img.addEventListener('load', fn, {once: true})
				// }

				// /** @type {HTMLImageElement} */
				// onLoad(this.#logo, () => {
				// 	createEffect(() => {})
				// })

				// categories layout //////////////////////////////////////////////////////////////////////////////////////////////

				/////////////////////////////////////////////////////////////

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
						this.#scrollContainer.visualFormat = visualFormat
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

					const children = this.#scrollContainer.children

					for (let i = 0; i < children.length; i++) observer.observe(children[i])

					const cards = this.#scrollContainer.querySelectorAll('.card')

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
					${
						'' /*<!-- Header ###############################################################################################-->*/
					}
					<av-header
						id="header"
						slot="header"
						size="1 1"
						size-mode="p p"
						position="0 0 0.1"
						on:menubtnclick=${e => this.layout?.toggle()}
						on:categorychange=${e => this.isos.forEach(iso => iso.arrange({filter: '.type-' + e.detail}))}
					></av-header>

					<lume-scroller></lume-scroller>
					<lume-element3d id="scroller" slot="body" size="1 1" size-mode="p p">
						<lume-autolayout
							ref=${e => (this.#scrollContainer = e)}
							id="scrollContainer"
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
							<av-categories
								slot="categories"
								size-mode="p p"
								size="1 1"
								opacity="0"
								on:categorychange=${e => this.isos.forEach(iso => iso.arrange({filter: '.type-' + e.detail}))}
							></av-categories>

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
									<div class="featuredLabel">Featured projects:</div>
									<div class="flex-row featuredGrid">
										<div class="card hide type-experiential">
											<div class="cardContent">
												<img src="./imgs/Dreamforce thumb big.jpeg" />
												<h2>Dreamforce 2019</h2>
												<p>
													Campground is the main expo of an annual four day event that brings together global Salesforce
													community.
												</p>
											</div>
										</div>
										<div class="card hide type-industrial">
											<div class="cardContent">
												<img src="./imgs/Google NEXT thumb big.jpeg" />
												<h2>Google Next</h2>
												<p>
													Google’s flagship event. The biggest cloud conference of the year for entrepreneurs, business
													leaders and developers.
												</p>
											</div>
										</div>
										<div class="card hide type-visual">
											<div class="cardContent">
												<img src="./imgs/Salesforce Connections thumb big.jpeg" />
												<h2>Salesforce Connections 2019</h2>
												<p>
													Salesforce Connections is a conference that is geared towards digital marketing and commerce
													using Salesforce platform.
												</p>
											</div>
										</div>
										<div class="card hide type-experiential">
											<div class="cardContent">
												<img src="./imgs/Funimation thumb big.jpeg" />
												<h2>Funimation</h2>
												<p>Funimation event experience creates the portal to a world of extraordinary anime.</p>
											</div>
										</div>
										<div class="card hide type-industrial">
											<div class="cardContent">
												<img src="./imgs/Wisk thumb big.jpeg" />
												<h2>Wisk</h2>
												<p>Product reveal of a vertical takeoff flying aircraft.</p>
											</div>
										</div>
										<div class="card hide type-visual">
											<div class="cardContent">
												<img src="./imgs/GE LOGIQ thumb big.jpeg" />
												<h2>GE Logiq Ultrasound</h2>
												<p>Product launch through marketing website.</p>
											</div>
										</div>
									</div>
								</div>
								<style>
									.featuredLabel {
										font-size: calc(30px * var(--scale));
										font-family: 'Austin-LightItalic', serif;
									}

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
									<div class="card hide type-experiential">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-industrial">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-visual">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-experiential">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-industrial">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-visual">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-experiential">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-industrial">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-visual">
										<img src="./dreamforce-tree.jpg" />
									</div>
									<div class="card hide type-experiential">
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
				#headerbody {
					/* Flattens 3D CSS rendering */
					/* overflow: hidden; */

					background: #0a131f;
				}
			`
		},
	)
}
