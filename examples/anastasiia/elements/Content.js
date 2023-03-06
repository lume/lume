// CONTINUE:
// - separate featured projects and other projects into custom elements, encapsulate slightly differing grid sizing styles.
// - Try other projects having 4 across instead of 3.
// - hover text for other projects items
// - contact/footer section at bottom

/* @checkJs */

{
	const {
		Node,
		element,
		html,
		ScrollFling,
		batch,
		createEffect,
		createMemo,
		untrack,
		onCleanup,
		variable,
		Motor,
		reactify,
	} = LUME

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
			#rainbow
			#rainbow2

			rainbowUniforms = ''
			rainbowVert = ''
			rainbowFrag = ''

			constructor() {
				super()

				reactify(this, ['rainbowUniforms', 'rainbowVert', 'rainbowFrag'])

				// UGH.
				import('../shaders/rainbow-gradient.js').then(({uniforms, vertexShader, fragmentShader}) => {
					batch(() => {
						this.rainbowUniforms = uniforms
						this.rainbowVert = vertexShader
						this.rainbowFrag = fragmentShader
					})
				})
			}

			// These should be properties on lume-scroller
			scrollRatio = variable(0)
			amountScrolled = variable(0)

			connectedCallback() {
				super.connectedCallback()

				// this.#menuBtnOpen.onclick = () => this.layout?.toggle()

				// createEffect(() => {
				// 	this.#menuBtnOpen.opacity = 1 - layout.drawerPosition * (1 - 0)
				// })

				createEffect(() => {
					let _contentHeight = 0

					// reactive dependencies (child.calculatedSize)
					for (const child of Array.from(this.#scrollContainer.children)) {
						_contentHeight += child.calculatedSize.y
					}

					// this.#scrollContainer.size.y = _contentHeight
				})

				// Scroll implementation //////////////////////////////////////////////////////////////////////

				const scrollRatio = this.scrollRatio
				const amountScrolled = this.amountScrolled

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
					console.log(
						'make new fling',
						untrack(amountScrolled),
						untrack(scrollRatio),
						untrack(scrollRatio) * untrack(scrollableAmount),
					)
					const fling = new ScrollFling({
						target: untrack(() => this.scene),
						// y: scrollRatio * untrack(scrollableAmount),
						// Use Math.min in case the page is at the end, so that the viewport won't be scrolled beyond the end of content in case content height shrunk.
						y: Math.min(untrack(amountScrolled), untrack(scrollableAmount)),
						minY: 0,
						// The `|| tiny` prevents divide by zero errors.
						maxY: untrack(scrollableAmount) || tiny,
						scrollFactor: 0.3,
					})

					// if (untrack(() => fling.y === undefined)) debugger

					fling.start()

					createEffect(() => {
						fling.y

						untrack(() => {
							this.#scrollContainer.position.y = -(fling.y || 0)
							console.log('scroll content Y:', this.#scrollContainer.position.y)

							// FIXME, this conditional checking is because of values-in-the-past, which should be fixed in Solid 1.5
							scrollRatio(fling.y ? fling.y / (scrollableAmount() || tiny) : scrollRatio())
							amountScrolled(fling.y ?? amountScrolled())
							console.log('scroll content Y:', fling.y, amountScrolled())

							this.#scrollknob.alignPoint.y = scrollRatio()
							this.#scrollknob.mountPoint.y = scrollRatio()
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
							V:|[hero(85%)][categories(125)][featured(${featuredHeight})][skills(282)][other(${otherHeight})][letsconnect(540)][shoes(100)]

							H:|[hero]|
							H:|[categories]|
							H:|[featured]|
							H:|[skills]|
							H:|[other]|
							H:|[letsconnect]|
							H:|[shoes]|
						`
						this.#scrollContainer.visualFormat = visualFormat
					})
				}

				this.isos = []

				const isotopeLayout = (gridEl, gutter) => {
					const iso = new Isotope(gridEl, {
						itemSelector: '.card',
						layoutMode: 'fitRows',
						stagger: 150,

						fitRows: {
							gutter: gutter * scale,
						},
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
					isotopeLayout(grid, 112)
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
					isotopeLayout(grid, 22)
				}

				// fade things in ///////////////////////////////////////////////////////////
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
								element.classList.remove('hidden')

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

					const thingsToFadeIn = [
						...Array.from(this.shadowRoot.querySelectorAll('.fadeIn')),
						...Array.from(this.shadowRoot.querySelector('av-hero').shadowRoot.querySelectorAll('.fadeIn')),
						...Array.from(this.#scrollContainer.querySelectorAll('.hidden')),
					]

					for (let i = 0; i < thingsToFadeIn.length; i++) observer.observe(thingsToFadeIn[i])
				}

				// shader ///////////////////////////////////////////////////////////////////

				createEffect(() => {
					if (!this.rainbowVert || !this.rainbowFrag || !Object.keys(this.rainbowUniforms).length) return
					animateShader(this.#rainbow)
					// animateShader(this.#rainbow2)
				})

				async function animateShader(el) {
					createEffect(() => {
						const mat = el.behaviors.get('shader-material')

						if (!mat?.meshComponent) return

						// *0.5 to make the pattern size smaller
						mat.uniforms.iResolution.value.x = el.calculatedSize.x * 0.5
						mat.uniforms.iResolution.value.y = el.calculatedSize.y * 0.5

						el.needsUpdate()
					})

					Motor.addRenderTask(t => {
						const mat = el.behaviors.get('shader-material')

						if (!mat?.meshComponent) return

						mat.uniforms.iTime.value = t * 0.001
						el.needsUpdate()
					})
				}

				// footer mouse follow ////////////////////////////////////////////////////////////////////////
				// TODO consolidate with similar code in SkillsBanner
				createEffect(() => {
					if (!this.scene) return

					const maxDisplacement = 10
					let targetX = 0
					let targetY = 0

					const eventAborter = new AbortController()
					this.scene.addEventListener(
						'pointermove',
						event => {
							// get a value between -maxDisplacement and maxDisplacement
							targetX = (event.clientX / this.scene.calculatedSize.x) * (maxDisplacement * 2) - maxDisplacement
							targetY = (event.clientY / this.scene.calculatedSize.y) * (maxDisplacement * 2) - maxDisplacement
						},
						{signal: eventAborter.signal},
					)

					const task = Motor.addRenderTask(() => {
						// Every frame, move the value closer to target by 5%.
						this.#letsconnect.rotation.y += 0.05 * (targetX - this.#letsconnect.rotation.y)
						this.#letsconnect.rotation.x += 0.05 * (-targetY - this.#letsconnect.rotation.x)
					})

					onCleanup(() => {
						eventAborter.abort()
						Motor.removeRenderTask(task)
					})
				})

				////////////////////////////////////////////////////////////////////////

				naturalSize(this.shadowRoot.querySelector('#contactButton'))

				///////////////////////////////////////////////////////////////////////
				// On scroll, "snap" category buttons into the header.

				const bodyCatButtons = this.shadowRoot
					.querySelector('av-categories')
					.shadowRoot.querySelector('av-category-buttons')
				const bodyCategoryLinkWrapper = bodyCatButtons.shadowRoot.querySelector('.centerContent')

				const headerCatButtons = this.shadowRoot
					.querySelector('av-header')
					.shadowRoot.querySelector('av-category-buttons')
				const headerCategoryLinks = Array.from(headerCatButtons.shadowRoot.querySelectorAll('a'))
				const headerCategoryLinkWrappers = Array.from(headerCatButtons.shadowRoot.querySelectorAll('.centerContent'))

				//////////////////
				// Method 1, a single effect

				// createEffect(() => {
				// 	amountScrolled() // Any time scrolled amount changes

				// 	console.log('>>>>> update all at once')

				// 	const bodyButtonBounds = bodyCategoryLinkWrapper.getBoundingClientRect()
				// 	const headerButtonBounds = headerCategoryLinkWrappers[0].getBoundingClientRect()

				// 	const showLinks = bodyButtonBounds.top <= headerButtonBounds.bottom
				// 	const wentPast = bodyButtonBounds.top <= headerButtonBounds.top
				// 	const diff = bodyButtonBounds.top - headerButtonBounds.top

				// 	const y = showLinks && !wentPast ? diff : 0
				// 	for (const link of headerCategoryLinks) link.style.transform = `translate3d(0, ${y}px, 0)`

				// 	// If the body category links move past the header links, show the header links.
				// 	if (showLinks) headerCatButtons.opacity = 1
				// 	else headerCatButtons.opacity = 0
				// })

				//////////////////
				// Method 2, memos

				const bodyButtonBounds = createMemo(() => {
					amountScrolled() // Any time scrolled amount changes
					return bodyCategoryLinkWrapper.getBoundingClientRect()
				})
				const headerButtonBounds = createMemo(() => {
					amountScrolled() // Any time scrolled amount changes
					return headerCategoryLinkWrappers[0].getBoundingClientRect()
				})

				const showLinks = createMemo(() => bodyButtonBounds().top <= headerButtonBounds().bottom)
				const wentPast = createMemo(() => bodyButtonBounds().top <= headerButtonBounds().top)
				const diff = createMemo(() => bodyButtonBounds().top - headerButtonBounds().top)
				const y = createMemo(() => (showLinks() && !wentPast() ? diff() : 0))

				createEffect(() => {
					const _y = y()
					for (const link of headerCategoryLinks) link.style.transform = `translate3d(0, ${_y}px, 0)`
				})

				createEffect(() => {
					// If the body category links move past the header links, show the header links.
					if (showLinks()) headerCatButtons.opacity = 1
					else headerCatButtons.opacity = 0
				})

				///////////////////////////////////////////////////////////////////////
			}

			#letsconnect

			template = () => {
				return html`
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

						${
							''
							/*TODO move the autolayout into here and remove scroller code from here.
					<lume-scroller></lume-scroller>
					*/
						}

						<lume-element3d id="scroller" slot="body" size="1 1" size-mode="p p">
							<!-- Using a lume-scene here to make the body content 3D
						within its own surface, so f.e. 3D content will not
						intersect with the header or slideout menu. -->
							<lume-scene class="bodyContent" perspective="1200">
								<lume-autolayout
									ref=${e => (this.#scrollContainer = e)}
									id="scrollContainer"
									xslot="content"
									visual-format="
									V:|[hero(85%)][categories(125)][featured(0)][skills(282)][other(1200)][letsconnect(540)][shoes(100)]

									H:|[hero]|
									H:|[categories]|
									H:|[featured]|
									H:|[skills]|
									H:|[other]|
									H:|[letsconnect]|
									H:|[shoes]|
								"
									size="1 1"
									size-mode="p p"
								>
									<av-hero slot="hero" size="1 1" size-mode="p p"></av-hero>

									${
										/*<!-- Categories ###############################################################################################-->*/ ''
									}
									<av-categories
										class="fadeIn"
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
										class="fadeIn"
										slot="featured"
										opacity="0"
										size-mode="p p"
										size="1 1"
									>
										<div>
											<div class="featuredLabel">Featured projects:</div>
											<div class="flex-row featuredGrid">
												<div class="card hidden type-experiential">
													<div class="cardContent">
														<img src="./imgs/Dreamforce thumb big.jpeg" />
														<h2>Dreamforce 2019</h2>
														<p>
															Campground is the main expo of an annual four day event that brings together global
															Salesforce community.
														</p>
													</div>
												</div>
												<div class="card hidden type-industrial">
													<div class="cardContent">
														<img src="./imgs/Google NEXT thumb big.jpeg" />
														<h2>Google Next</h2>
														<p>
															Google’s flagship event. The biggest cloud conference of the year for entrepreneurs,
															business leaders and developers.
														</p>
													</div>
												</div>
												<div class="card hidden type-visual">
													<div class="cardContent">
														<img src="./imgs/Salesforce Connections thumb big.jpeg" />
														<h2>Salesforce Connections 2019</h2>
														<p>
															Salesforce Connections is a conference that is geared towards digital marketing and
															commerce using Salesforce platform.
														</p>
													</div>
												</div>
												<div class="card hidden type-experiential">
													<div class="cardContent">
														<img src="./imgs/Funimation thumb big.jpeg" />
														<h2>Funimation</h2>
														<p>Funimation event experience creates the portal to a world of extraordinary anime.</p>
													</div>
												</div>
												<div class="card hidden type-industrial">
													<div class="cardContent">
														<img src="./imgs/Wisk thumb big.jpeg" />
														<h2>Wisk</h2>
														<p>Product reveal of a vertical takeoff flying aircraft.</p>
													</div>
												</div>
												<div class="card hidden type-visual">
													<div class="cardContent">
														<img src="./imgs/GE LOGIQ thumb big.jpeg" />
														<h2>GE Logiq Ultrasound</h2>
														<p>Product launch through marketing website.</p>
													</div>
												</div>
											</div>
										</div>
										<style>
											#featured {
												--gutter: calc(112px * var(--scale));
												padding: 0px calc(165px * var(--scale));
											}

											.featuredLabel {
												font-size: calc(30px * var(--scale));
												letter-spacing: calc(0.6px * var(--scale));
												font-family: 'Austin-LightItalic', serif;
												font-weight: 100;
												margin-bottom: calc(62px * var(--scale));
											}

											#featured div {
												transform-style: preserve-3d;
											}

											.flex-row {
												--transition-time: 0.6s;
											}

											.flex-row .card {
												max-width: calc(0.25 * (100% - var(--gutter) * 3) - 1px);
												width: calc(0.25 * (100% - var(--gutter) * 3) - 1px);
												margin-bottom: var(--gutter);
												overflow: visible;
											}

											.flex-row .card img {
												width: 100%;
												aspect-ratio: 1;
												object-fit: cover;
												border-radius: 0;
												/* box-shadow: 0px 0px calc(100px * var(--scale)) 0px rgba(0, 0, 0, 0); */
												transition: border-radius var(--transition-time) /* , box-shadow var(--transition-time) */;
											}

											.cardContent {
												transform-style: preserve-3d;
												transform: translate3d(0, 0, 0.1px) scale(1);
												transition: transform var(--transition-time);
											}

											.flex-row .card:hover .cardContent {
												transform: translate3d(0, 0, 0.1px) scale(1.03);
											}

											.flex-row .card:hover img {
												border-radius: 100%;
												/* box-shadow: 0px 0px calc(100px * var(--scale)) 0px #808080; */
											}

											@media screen and (max-width: 1600px) {
												.flex-row .card {
													max-width: calc(0.333333 * (100% - var(--gutter) * 2));
													width: calc(0.333333 * (100% - var(--gutter) * 2));
												}
											}

											@media screen and (max-width: 1080px) {
												.flex-row .card {
													max-width: calc(0.5 * (100% - var(--gutter) * 1) - 1px);
													width: calc(0.5 * (100% - var(--gutter) * 1) - 1px);
												}
											}

											@media screen and (max-width: 800px) {
												.flex-row .card {
													max-width: calc(1 * (100% - var(--gutter) * 0) - 1px);
													width: calc(1 * (100% - var(--gutter) * 0) - 1px);
												}
											}

											.card {
												transition: opacity var(--fadeInDuration, 0.5s);

												font-family: 'Open Sans', sans-serif;
												font-weight: 400; /*regular*/
												font-size: calc(20px * var(--scale));
												letter-spacing: calc(0px * var(--scale));
											}

											.card h2 {
												font-weight: 600; /*semibold*/
												font-size: calc(25px * var(--scale));
												letter-spacing: calc(0.38px * var(--scale));
												text-transform: uppercase;
											}
										</style>
									</lume-element3d>
									${/*<!-- </featured-projs> -->*/ ''}
									${
										/*<!-- Skills description ######################################################################################### -->*/ ''
									}
									<av-skills-banner
										class="fadeIn"
										opacity="0"
										size-mode="p p"
										size="1 1"
										slot="skills"
									></av-skills-banner>

									${
										/*<!-- Other projects ############################################################################################# -->*/ ''
									}
									<lume-element3d
										ref=${e => (this.#otherProjects = e)}
										id="otherProjects"
										class="fadeIn"
										slot="other"
										opacity="0"
										size-mode="p p"
										size="1 1"
									>
										<div>
											<div class="featuredLabel">Other projects:</div>
											<div class="flex-row otherProjectsGrid">
												<div class="card hidden type-experiential">
													<img src="./imgs/medical device.jpg" />
												</div>
												<div class="card hidden type-industrial">
													<img src="./imgs/airport project.jpg" />
												</div>
												<div class="card hidden type-visual">
													<img src="./imgs/transplant machine.jpg" />
												</div>
												<div class="card hidden type-experiential">
													<img src="./imgs/Pervuy Moscovsky.jpg" />
												</div>
												<div class="card hidden type-industrial">
													<img src="./imgs/linkedin-logo.jpg" />
												</div>
												<div class="card hidden type-visual">
													<img src="./imgs/polydance.jpeg" />
												</div>
												<div class="card hidden type-experiential">
													<img src="./imgs/adobe express logo.png" />
												</div>
												<div class="card hidden type-industrial">
													<img src="./imgs/library.jpg" />
												</div>
												<div class="card hidden type-visual">
													<img src="./imgs/yakama.jpg" />
												</div>
											</div>
										</div>
										<style>
											#otherProjects {
												--gutter: calc(22px * var(--scale));
												padding: 0px calc(83px * var(--scale));
											}
										</style>
									</lume-element3d>

									${
										/*<!-- Connect #################################################################################################### -->*/ ''
									}
									<lume-element3d
										ref=${e => (this.#letsconnect = e)}
										id="letsconnect"
										slot="letsconnect"
										size-mode="p p"
										size="1 1"
									>
										<lume-element3d class="fadeIn thatsAWrap" opacity="0" size-mode="p p" size="1 1">
											<h2 class="getReady">Ready to make something</h2>
										</lume-element3d>
										<lume-element3d
											class="fadeIn thatsAWrap"
											opacity="0"
											size-mode="p p"
											size="1 1"
											position=${[0, scale * 200, scale * 130]}
										>
											<h2 class="forAwesome">Awesome <span class="areYouReady">?</span></h2>
										</lume-element3d>
										<lume-element3d
											class="fadeIn"
											opacity="0"
											align-point="0 0.5"
											position=${[659 * scale, 0, -130 * scale]}
											mount-point="0.5 0.5"
											size=${[260 * scale, 443 * scale]}
										>
											<lume-scene webgl>
												<lume-plane
													ref=${e => (this.#rainbow = e)}
													has="shader-material"
													size-mode="p p"
													size="1 1"
													scale="1 1"
													uniforms=${() => this.rainbowUniforms}
													vertex-shader=${() => this.rainbowVert}
													fragment-shader=${() => this.rainbowFrag}
												></lume-plane>
											</lume-scene>
										</lume-element3d>
										<lume-mixed-plane
											id="contactButton"
											xsize-mode="p l"
											xsize="1 50"
											align-point="0.5 1 0"
											mount-point="0.5 1 0"
											position=${[0, -237 * scale, 0]}
										>
											<div class="sayHello">
												<a href="mailto:vnastasia@gmail.com">Contact</a>
											</div>

											<lume-element3d
												opacity="0"
												class="fadeIn"
												align-point="0.5 0.5"
												mount-point="0.5 0.5"
												size-mode="p p"
												size="1.05 1.1"
												position="0 0 -5"
											>
												<lume-scene webgl>
													<lume-plane
														ref=${e => (this.#rainbow2 = e)}
														has="shader-material"
														size-mode="p p"
														size="1 1"
														scale="1 1"
														uniforms=${() => this.rainbowUniforms}
														vertex-shader=${() => this.rainbowVert}
														fragment-shader=${() => this.rainbowFrag}
													></lume-plane>
												</lume-scene>
											</lume-element3d>
										</lume-mixed-plane>
										<style>
											.thatsAWrap {
												padding: 0 calc(157px * var(--scale)) calc(157px * var(--scale));
											}

											.getReady {
												font-family: 'Austin-LightItalic', serif;
												font-size: calc(165px * var(--scale));
												letter-spacing: calc(0px * var(--scale));
												font-weight: 100;
											}

											.forAwesome {
												padding-left: calc(650px * var(--scale));
												font-family: 'Open Sans', sans-serif;
												font-weight: 700;
												font-size: calc(165px * var(--scale));
												letter-spacing: calc(4.95px * var(--scale));
												text-transform: uppercase;
											}

											.areYouReady {
												font-family: 'Austin-LightItalic', serif;
												font-size: calc(170px * var(--scale));
												letter-spacing: calc(0px * var(--scale));
												font-weight: 100;
											}

											.sayHello {
												position: absolute;
												/* height: 100%; */
												display: flex;
												justify-content: center;
												align-items: flex-end;
												background: #0a131f;
												cursor: pointer;
											}

											.sayHello a {
												font-family: 'Open Sans', sans-serif;
												font-size: calc(50px * var(--scale));
												text-transform: uppercase;
												text-decoration: none;
												padding: calc(40px * var(--scale)) calc(100px * var(--scale));
												/* border: calc(2px * var(--scale)) solid white; */
											}
										</style>
									</lume-element3d>

									<lume-element3d class="fadeIn" opacity="0" slot="shoes" size-mode="p p" size="1 1">
										<div class="onlyTheBeginning">
											<span class="original">
												Copyright ©&nbsp;
												<span class="avp"
													>2022 Anastasiia<span dot></span><span shrink>&nbsp;</span>V<span dot></span
													><span shrink>&nbsp;</span>Pea</span
												>
											</span>
										</div>
										<style>
											.onlyTheBeginning {
												font-family: 'Open Sans', sans-serif;
												font-size: calc(20px * var(--scale));
												letter-spacing: calc(0.3px * var(--scale));
												height: 100%;
												background: black;
												padding: calc(71px * var(--scale)) calc(165px * var(--scale));
											}

											[shrink] {
												display: inline-block;
												width: 0;
												height: 0;
											}

											[dot]::before {
												content: '.';
												display: inline;
											}

											.avp {
												font-weight: bold;
												text-transform: uppercase;
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
									ref=${e => (console.log('set scrollknob'), (this.#scrollknob = e))}
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
							</lume-scene>
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
			}

			css = /*css*/ `
				#headerbody {
					/* Flattens 3D CSS rendering */
					/* overflow: hidden; */
				}

				.bodyContent {
					background: var(--background);
				}

				av-categories {
					background: var(--background);
				}
			`
		},
	)
}

// Initial version of natural size based on DOM content. Children must be
// position:absolute, and not sized as portion of their parent.
function naturalSize(element3d) {
	const {Motor, Element3D} = LUME

	/** @type {Array<HTMLElement>} */
	const children = Array.from(element3d.children)
		// non-lume nodes for now
		.filter(el => !(el instanceof Element3D))

	Motor.addRenderTask(() => {
		let totalBound = {left: 0, top: 0, bottom: 0, right: 0}

		for (const child of children) {
			totalBound.left = Math.max(0, Math.min(totalBound.left, child.offsetLeft))
			totalBound.top = Math.max(0, Math.min(totalBound.top, child.offsetTop))
			totalBound.bottom = Math.max(totalBound.bottom, child.offsetTop + child.offsetHeight)
			totalBound.right = Math.max(totalBound.right, child.offsetLeft + child.offsetWidth)
		}

		const width = totalBound.right - totalBound.left
		const height = totalBound.bottom - totalBound.top

		element3d.size.x = width
		element3d.size.y = height
	})
}
