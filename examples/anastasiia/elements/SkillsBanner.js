{
	const {Node, element, html, Motor, reactify, autorun, TextureLoadEvent, MeshTransmissionMaterial} = LUME

	const numberOfRepeatingItems = 2

	element('av-skills-banner')(
		class SkillsBanner extends Node {
			// static observedAttribute = {
			// 	textImageUrl: attribute.string,
			// }

			hasShadow = true

			textImageUrl = ''

			#skills
			#gltfGem
			#gem
			#gemBack
			#gemWire
			#gemContainer

			constructor() {
				super()
				reactify(this, ['textImageUrl'])
			}

			connectedCallback() {
				super.connectedCallback()

				this.marquee()
				this.#mouseFollow()

				this.html2canvas()

				this.#handleGlftGem()

				this.#rotateGem()

				this.#applyShader(this.#gemWire, 0.001)
			}

			#handleGlftGem() {
				let model = this.#gltfGem.behaviors.get('gltf-model')?.model

				const onGemLoad = () => {
					model = this.#gltfGem.behaviors.get('gltf-model')?.model
					model.scene.traverse(n => {
						if (n.isMesh) {
							n.geometry.scale(100, 100, 100)

							// TODO make it officially easy to provide custom
							// geometries via LUME interface
							this.#gem.three.geometry.dispose()
							this.#gem.three.geometry = n.geometry
							this.#gemBack.three.geometry.dispose()
							this.#gemBack.three.geometry = n.geometry
							this.#gemWire.three.geometry.dispose()
							this.#gemWire.three.geometry = n.geometry
						}
					})
				}

				if (!model) this.#gltfGem.on('MODEL_LOAD', onGemLoad)
				else onGemLoad()
			}

			#rotateGem() {
				this.#gem.rotation = (x, y, z) => [x, y + 0.3, z]
				this.#gemBack.rotation = (x, y, z) => [x, y + 0.3, z]
				this.#gemWire.rotation = (x, y, z) => [x, y + 0.3, z]
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

			#mouseFollow() {
				// Add some interaction!
				const maxDisplacement = 60
				let targetX = 0
				let targetY = 0

				autorun(() => {
					if (!this.scene) return

					this.scene.addEventListener('pointermove', event => {
						// get a value between -maxDisplacement and maxDisplacement
						targetX = (event.clientX / this.scene.calculatedSize.x) * (maxDisplacement * 2) - maxDisplacement
						targetY = (event.clientY / this.scene.calculatedSize.y) * (maxDisplacement * 2) - maxDisplacement
					})
				})

				Motor.addRenderTask(() => {
					this.#gemContainer.position.x += 0.05 * (targetX - this.#gemContainer.position.x)
					this.#gemContainer.position.y += 0.05 * (targetY - this.#gemContainer.position.y)
				})
			}

			async #applyShader(el, timeFactor) {
				const {uniforms, fragmentShader, vertexShader} = await import('../shaders/fluid-marble.js')

				el.fragmentShader = fragmentShader
				el.vertexShader = vertexShader

				autorun(() => {
					const shaderMaterial = el.behaviors.get('shader-material')
					if (!shaderMaterial?.meshComponent) return

					el.uniforms = uniforms

					autorun(() => {
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
								xenvironment="./empty-warehouse-equirect.jpg"
								environment="./luna-station-equirect.jpg"
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
									position="0 0 1"
								>
									<div id="text">
										${Array.from({length: numberOfRepeatingItems}).map(
											() => html`
												<span comment="repeated multiple times for marquee effect">
													| A MULTIDISCIPLINARY CREATIVE AND ART DIRECTOR AND DESIGNER | WORK IN BRAND EXPERIENCE AND
													CREATES DIGITAL AND IN-PERSON EXPERIENCES | BRING THE ESSENCE OF THE BRAND THROUGH STORIES AND
													IMPACTFUL VISUAL EXPRESSION | A WIDE VARIETY OF SKILLS FROM VISUAL AND 2D CREATION TO
													SKETCHING AND 3D MODELING PLUS PROJECT MANAGEMENT AND STORYTELLING
												</span>
											`,
										)}
									</div>
									${Array.from({length: numberOfRepeatingItems}).map(
										() => html`
											<lume-plane
												class="glText"
												xalign-point="0 0.5"
												texture=${() => this.textImageUrl}
												xhas="phong-material"
												has="basic-material"
												color="white"
												opacity="0.9999"
												xenv-map="https://assets.codepen.io/191583/airplane-hanger-env-map.jpg"
											></lume-plane>
										`,
									)}
								</lume-element3d>

								<lume-element3d
									ref=${e => (this.#gemContainer = e)}
									id="gemContainer"
									size="312 312"
									align-point="0.1 0.5"
									mount-point="0.1 0.5"
									position="0 0 20"
								>
									<lume-gltf-model
										visible="false"
										ref=${e => (this.#gltfGem = e)}
										src="./gem/scene.gltf"
										align-point="0.5 0.5"
										scale="100 100 100"
									></lume-gltf-model>
									<lume-mesh
										visible="false"
										ref=${e => (this.#gem = e)}
										id="gem"
										size="150 150 150"
										align-point="0.5 0.5"
										mount-point="0.5 0.5"
										rotation="-10 0 0"
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
										transmission="0.8"
										roughness="0"
										thickness="100"
										refractive-index="1.5"
										chromatic-aberration="0.10"
										anisotropy="0"
										distortion="0"
										distortion-scale="100"
										xbackside="not working well at all"
									></lume-mesh>
									<lume-mesh
										visible="false"
										ref=${e => (this.#gemBack = e)}
										id="gemBack"
										size="150 150 150"
										align-point="0.5 0.5"
										mount-point="0.5 0.5"
										rotation="-10 0 0"
										xxxxxxxxxxxxxxxxxxxx
										has="transmission-material"
										xmetalness="0"
										reflectivity="1"
										clearcoat="1"
										transmission="0.8"
										roughness="0"
										thickness="100"
										refractive-index="1.5"
										chromatic-aberration="0.10"
										anisotropy="0"
										distortion="0"
										distortion-scale="100"
										xbackside="not working well at all"
										sidedness="back"
									></lume-mesh>

									<lume-mesh
										visible="false"
										ref=${e => (this.#gemWire = e)}
										id="gemWire"
										size="150 150 150"
										align-point="0.5 0.5"
										mount-point="0.5 0.5"
										rotation="-10 0 0"
										wireframe
										xxxxxxxxxxxxxxxxxxxx
										has="shader-material"
										color="deeppink"
									></lume-mesh>

									<lume-sphere
										visible="true"
										id="ball"
										size="150 150 150"
										align-point="0.5 0.5"
										mount-point="0.5 0.5"
										rotation="-10 0 0"
										xxxxxxxxxxxxxxxxxxxx
										has="transmission-material"
										xmetalness="0"
										reflectivity="1"
										clearcoat="1"
										transmission="0.8"
										roughness="0"
										thickness="50"
										refractive-index="1.5"
										chromatic-aberration="0.10"
										anisotropy="0"
										distortion="0"
										distortion-scale="100"
										xbackside="not working well at all"
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
