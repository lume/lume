// CONTINUE:
// - separate featured projects and other projects into custom elements, encapsulate slightly differing grid sizing styles.
// - Try other projects having 4 across instead of 3.
// - hover text for other projects items
// - contact/footer section at bottom

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
			#rainbow

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
						...Array.from(this.#scrollContainer.querySelectorAll('.hidden')),
					]

					for (let i = 0; i < thingsToFadeIn.length; i++) observer.observe(thingsToFadeIn[i])
				}

				// shader ///////////////////////////////////////////////////////////////////

				animateShader(this.#rainbow)

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
						this.#letsconnect.rotation.y += 0.05 * (-targetX - this.#letsconnect.rotation.y)
						this.#letsconnect.rotation.x += 0.05 * (targetY - this.#letsconnect.rotation.x)
					})

					onCleanup(() => {
						eventAborter.abort()
						Motor.removeRenderTask(task)
					})
				})
			}

			#letsconnect

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
								<av-hero class="fadeIn" opacity="0" slot="hero" size="1 1" size-mode="p p"></av-hero>

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
														Salesforce Connections is a conference that is geared towards digital marketing and commerce
														using Salesforce platform.
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
											font-family: 'Austin-LightItalic', serif;
											font-weight: 100;
											margin-bottom: calc(62px * var(--scale));
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
											max-width: calc(0.25 * (100% - var(--gutter) * 3) - 1px);
											width: calc(0.25 * (100% - var(--gutter) * 3) - 1px);

											/* replace with isotope fitRows.gutter option */
											/* margin: var(--flex-margin); */

											margin-bottom: var(--gutter);

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

										#otherProjects .flex-row {
											--flex-margin: 10px;
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
										position=${[0, scale * 200, scale * 200]}
									>
										<h2 class="forAwesome">Awesome<span class="areYouReady">?</span></h2>
									</lume-element3d>
									<lume-element3d class="fadeIn thatsAWrap" opacity="0" size-mode="p p" size="1 1">
										<div class="sayHello">
											<a href="mailto:vnastasia@gmail.com">Contact</a>
										</div>
									</lume-element3d>
									<lume-element3d
										class="fadeIn"
										opacity="0"
										align-point="0 0.5"
										position=${[659 * scale, 0, -200]}
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
												uniforms='{
													"iTime": { "value": 0 },
													"iResolution": { "value": {"x": 1, "y": 1, "z": 1} }
												}'
												vertex-shader="
													varying vec2 vUv;

													void main() {
														vUv = uv;
														gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
													}
												"
												fragment-shader="
													#include <common>

													uniform vec3 iResolution;
													uniform float iTime;

													// The following is the default shader when you start a new shadertoy example.
													// By iq: https://www.shadertoy.com/user/iq
													// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

													// BEGIN SHADERTOY CODE {

													void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
														// Normalized pixel coordinates (from 0 to 1)
														vec2 uv = fragCoord/iResolution.xy;

														// Time varying pixel color
														vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

														// Output to screen
														fragColor = vec4(col,1.0);
														//fragColor = vec4(1.0, 0.3, 0.1, 1.0);
													}

													// END SHADERTOY CODE }

													varying vec2 vUv;

													void main() {
														mainImage(gl_FragColor, vUv / 2.0 * gl_FragCoord.xy);
													}
												"
											></lume-plane>
										</lume-scene>
									</lume-element3d>
									<style>
										.thatsAWrap {
											padding: 0 calc(157px * var(--scale)) calc(157px * var(--scale));
										}

										/* TODO scaled sizes */
										#letsconnect h2 {
											font-size: 90px;
										}

										#letsconnect a {
											font-size: 30px;
											text-transform: uppercase;
											background: #8145bfb3;
											padding: 10px;
										}

										.getReady {
											font-family: 'Austin-LightItalic', serif;
											font-size: calc(165px * var(--scale));
											font-weight: 100;
										}

										.forAwesome {
											padding-left: calc(650px * var(--scale));
											font-family: 'Open Sans', sans-serif;
											font-weight: 700;
											font-size: calc(165px * var(--scale));
											text-transform: uppercase;
										}

										.areYouReady {
											font-family: 'Austin-LightItalic', serif;
											font-size: calc(170px * var(--scale));
											font-weight: 100;
										}

										.sayHello {
											display: flex;
											justify-content: center;
										}

										.sayHello a {
										}
									</style>
								</lume-element3d>
								<lume-element3d class="fadeIn" opacity="0" slot="shoes" size-mode="p p" size="1 1">
									<div class="onlyTheBeginning">
										<span class="original">Copyright © 2022 <span class="avp">Anastasiia.V.Pea</span></span>
									</div>
									<style>
										.onlyTheBeginning {
											height: 100%;
											background: black;
											padding: calc(71px * var(--scale)) calc(165px * var(--scale));
										}

										.avp {
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

			css = /*css*/ `
				#headerbody {
					/* Flattens 3D CSS rendering */
					/* overflow: hidden; */
				}

				.bodyContent {
					background: #0a131f;
				}
			`
		},
	)
}

const {Element3D} = LUME

// Use only on element with literal size of 0,0,0 (imply this when we add natural size mode).
function naturalSize(element) {
	let minSizeX = 0
	let minSizeY = 0

	createEffect(() => {
		for (const child of Array.from(element.children)) {
			if (child instanceof Element3D) {
				// if (child)
			}
		}
	})
}
