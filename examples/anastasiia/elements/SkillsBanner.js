{
	const {Node, element, html, createEffect, Motor, reactify, autorun, TextureLoadEvent} = LUME

	const numberOfRepeatingItems = 2

	element('av-skills-banner')(
		class SkillsBanner extends Node {
			// static observedAttribute = {
			// 	textImageUrl: attribute.string,
			// }

			hasShadow = true

			textImageUrl = ''

			#skills
			#magicCircle
			#magicCircleContainer

			constructor() {
				super()
				reactify(this, ['textImageUrl'])
			}

			connectedCallback() {
				super.connectedCallback()

				this.marquee()
				// this.applyShader(this.#magicCircle, 0.001)
				this.sphereAnim()

				this.html2canvas()

				this.#magicCircle.rotation = (x, y, z) => [++x, ++y, ++z]
			}

			async html2canvas() {
				const s = document.createElement('script')
				// https://github.com/niklasvh/html2canvas
				s.src = 'https://html2canvas.hertzen.com/dist/html2canvas.js'
				document.head.append(s)
				await new Promise(resolve => (s.onload = resolve))

				const wrapper = this.#skills.querySelector('#textWrapper')
				const text = this.#skills.querySelector('#text')
				const spans = Array.from(text.querySelectorAll('span'))
				const firstSpan = text.children[0]
				const glTexts = Array.from(wrapper.querySelectorAll('.glText'))
				const start = performance.now()
				const canvas = await html2canvas(firstSpan, {
					backgroundColor: 'rgba(0, 0, 0, 0)',
					// backgroundColor: '#221d3f',
				})
				console.log('html2canvas time:', performance.now() - start)

				this.textImageUrl = canvas.toDataURL()

				text.style.visibility = 'hidden'

				glTexts.forEach(el => {
					el.addEventListener(TextureLoadEvent.type, () => {
						console.log('text texture loaded')
					})
				})
			}

			sphereAnim() {
				// Add some interaction!
				const maxDisplacement = 60
				let targetX = 0
				let targetY = 0

				createEffect(() => {
					if (!this.scene) return

					this.scene.addEventListener('pointermove', event => {
						// get a value between -maxDisplacement and maxDisplacement
						targetX = (event.clientX / this.scene.calculatedSize.x) * (maxDisplacement * 2) - maxDisplacement
						targetY = (event.clientY / this.scene.calculatedSize.y) * (maxDisplacement * 2) - maxDisplacement
					})
				})

				Motor.addRenderTask(() => {
					this.#magicCircleContainer.position.x += 0.05 * (targetX - this.#magicCircleContainer.position.x)
					this.#magicCircleContainer.position.y += 0.05 * (targetY - this.#magicCircleContainer.position.y)
				})

				// magicCircle.children[0].rotation = (x, y) => [x, y + 1]

				// this.#magicCircle.rotation = (x, y, z) => [x + 0.5, y + 0.5, z + 0.5]
				// Motor.addRenderTask(() => {
				// 	this.#magicCircle.rotation.x += 0.5
				// 	this.#magicCircle.rotation.y += 0.5
				// 	this.#magicCircle.rotation.z += 0.5
				// })
			}

			async applyShader(el, timeFactor) {
				const {uniforms, fragmentShader, vertexShader} = await import('../shaders/fluid-marble.js')

				el.fragmentShader = fragmentShader
				el.vertexShader = vertexShader

				createEffect(() => {
					const shaderMaterial = el.behaviors.get('shader-material')
					if (!shaderMaterial?.meshComponent) return

					el.uniforms = uniforms

					createEffect(() => {
						shaderMaterial.uniforms.iResolution.value.x = el.calculatedSize.x
						shaderMaterial.uniforms.iResolution.value.y = el.calculatedSize.y
						el.needsUpdate()
					})

					Motor.addRenderTask(t => {
						shaderMaterial.uniforms.iTime.value = t * timeFactor
						el.needsUpdate()
					})
				})
			}

			marquee() {
				const wrapper = this.#skills.querySelector('#textWrapper')
				const text = this.#skills.querySelector('#text')
				const firstSpan = text.children[0]
				const glTexts = Array.from(this.#skills.querySelectorAll('.glText'))
				let translate = 0
				Motor.addRenderTask(() => {
					translate += 1.5
					if (translate >= text.offsetWidth / numberOfRepeatingItems) translate = 0
					text.style.transform = `translate3d(${-translate}px, 0%, 0.001px)`

					wrapper.sizeMode.x = 'literal'
					wrapper.size.x = text.offsetWidth
					wrapper.size.y = text.offsetHeight
					glTexts.forEach((el, i) => {
						// el.size.x = text.offsetWidth / numberOfRepeatingItems
						// el.size.y = text.offsetHeight
						// el.position.x = i * (text.offsetWidth / numberOfRepeatingItems)
						el.size.x = firstSpan.offsetWidth
						el.size.y = firstSpan.offsetHeight

						el.position.x = -translate + i * firstSpan.offsetWidth
					})
				})
			}

			template = () => html`
				<link rel="stylesheet" href="./global.css" />

				<lume-element3d
					ref=${e => (this.#skills = e)}
					id="skills"
					size-mode="p l"
					size=${[1, scale * 324]}
					align-point="0 0.5"
					mount-point="0 0.5"
					class="centerContent"
				>
					<lume-element3d size-mode="p p" size="1 2" align-point="0 0.5" mount-point="0 0.5">
						<div
							id="sceneBoundary"
							comment="force a boundary between the higher lume scene and this inner one, to keep the rendering objects separate"
						>
							<lume-scene
								id="glassScene"
								webgl
								perspective="1400"
								xenvironment="https://assets.codepen.io/191583/airplane-hanger-env-map.jpg"
								environment="./empty-warehouse-equirect.jpg"
							>
								<lume-ambient-light color="white" intensity="1"></lume-ambient-light>

								<!-- <lume-camera-rig></lume-camera-rig> -->

								<lume-point-light position="200 -200 200" intensity="0.6" color="white"></lume-point-light>

								<lume-plane
									size-mode="p l"
									size=${[1, scale * 324]}
									color="#8145bf"
									opacity=${51 / 255}
									align-point="0 0.5"
									mount-point="0 0.5"
								></lume-plane>

								<lume-directional-light
									visible="true"
									fixme="point light not working here for some reason"
									color="white"
									intensity="0.8"
									align-point="0.5 0.5"
									distance="800"
									position="300 0 300"
									cast-shadow="false"
								></lume-directional-light>

								<lume-element3d
									id="textWrapper"
									align-point="0 0.5"
									mount-point="0 0.5"
									size-mode="p l"
									size="1 0"
									position="0 0 0"
								>
									<div id="text">
										${Array(numberOfRepeatingItems)
											.fill(0)
											.map(
												() => html`
													<span comment="repeated multiple times for marquee effect">
														| A MULTIDISCIPLINARY CREATIVE AND ART DIRECTOR AND DESIGNER | WORK IN BRAND EXPERIENCE AND
														CREATES DIGITAL AND IN-PERSON EXPERIENCES | BRING THE ESSENCE OF THE BRAND THROUGH STORIES
														AND IMPACTFUL VISUAL EXPRESSION | A WIDE VARIETY OF SKILLS FROM VISUAL AND 2D CREATION TO
														SKETCHING AND 3D MODELING PLUS PROJECT MANAGEMENT AND STORYTELLING
													</span>
												`,
											)}
									</div>
									${Array(numberOfRepeatingItems)
										.fill(0)
										.map(
											() => html`
												<lume-plane
													class="glText"
													xalign-point="0 0.5"
													texture=${() => this.textImageUrl}
													has="phong-material"
													color="white"
													opacity="0.9999"
													xenv-map="https://assets.codepen.io/191583/airplane-hanger-env-map.jpg"
												></lume-plane>
											`,
										)}
								</lume-element3d>

								<lume-element3d
									ref=${e => (this.#magicCircleContainer = e)}
									id="magicCircleContainer"
									size="312 312"
									align-point="0.1 0.5"
									mount-point="0.1 0.5"
									position="0 0 20"
								>
									<lume-sphere
										ref=${e => (this.#magicCircle = e)}
										id="magicCircle"
										size="150 150 150"
										align-point="0.5 0.5"
										mount-point="0.5 0.5"
										xxxxxxxxxxxxxxxxxxxx
										xhas="physical-material"
										xmetalness="0"
										xreflectivity="1"
										xroughness="0"
										xtransmission="1"
										xclearcoat="1"
										xthickness="75"
										xxxxxxxxxxxxxxxxxxxxxx
										has="transmission-material"
										xmetalness="0"
										reflectivity="1"
										clearcoat="1"
										transmission="1"
										roughness="0"
										thickness="40"
										chromatic-aberration="0.06"
										anisotropy="0"
										distortion="0"
										distortion-scale="100"
										xbackside="not working?"
									></lume-sphere>
								</lume-element3d>
							</lume-scene>
						</div>
					</lume-element3d>
				</lume-element3d>
			`

			css = /*css*/ `
				#glassScene {
					filter: saturate(1.5) brightness(0.6) blur(0px);
					/* opacity: 0.95 !important; */
				}
				#sceneBoundary {
					width: 100%; height: 100%;
				}

				#skills {
					padding: 0 82px;

					/* background disabled, replaced with gl plane */
					/*background: #8145bf33;*/ /* purple */

					font-size: 20px;
				}

				#text {
					font-family: 'Austin-Bold', serif;
					font-size: 41px;
					position: absolute;
					white-space: nowrap;
					left: 0;
				}
			`
		},
	)
}
