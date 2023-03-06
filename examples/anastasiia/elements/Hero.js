{
	const {Node, element, html, createEffect, onCleanup, Motor, untrack} = LUME

	element('av-hero')(
		class MenuBtn extends Node {
			hasShadow = true

			#titlename
			#titlenameEvents

			connectedCallback() {
				super.connectedCallback()

				createEffect(() => {
					if (!this.scene) return

					const maxDisplacement = 10
					let targetX = 0
					let targetY = 0

					const eventAborter = new AbortController()
					this.#titlenameEvents.addEventListener(
						'pointermove',
						event => {
							// if (event.currentTarget !== this.#titlenameEvents) return
							console.log('target:', event.target)
							console.log('currentTarget:', event.currentTarget)

							// get a value between -maxDisplacement and maxDisplacement
							targetX =
								(event.offsetX / this.#titlenameEvents.calculatedSize.x) * (maxDisplacement * 2) - maxDisplacement
							targetY =
								(event.offsetY / this.#titlenameEvents.calculatedSize.y) * (maxDisplacement * 2) - maxDisplacement
						},
						{signal: eventAborter.signal},
					)

					this.#titlenameEvents.addEventListener('pointerleave', event => {
						targetX = 0
						targetY = 0
					})

					const task = Motor.addRenderTask(() => {
						// Every frame, move the value closer to target by 5%.
						this.#titlename.rotation.y += 0.05 * (targetX - this.#titlename.rotation.y)
						this.#titlename.rotation.x += 0.05 * (-targetY - this.#titlename.rotation.x)
					})

					onCleanup(() => {
						eventAborter.abort()
						Motor.removeRenderTask(task)
					})
				})

				createEffect(() => {
					if (!this.scene) return

					untrack(() => this.#bg.size).x =
						((this.scene.perspective + Math.abs(this.#bg.position.z)) / this.scene.perspective) * 1

					untrack(() => this.#bg.size).y =
						((this.scene.perspective + Math.abs(this.#bg.position.z)) / this.scene.perspective) * 1
				})
			}

			#bg

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
					<lume-element3d
						ref=${e => (this.#bg = e)}
						size-mode="p p"
						size="1 1"
						position=${[0, 0, -250 * scale]}
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<lume-element3d size-mode="p p" size="1 1" opacity="0.5" style="background: black"></lume-element3d>

						${'' /* fadeIn is handled by the parent */}
						<lume-element3d class="fadeIn" opacity="0" size="1 1" size-mode="p p" position="0 0 -1">
							<img src="./dreamforce-tree.jpg" />
						</lume-element3d>
					</lume-element3d>

					<lume-element3d
						ref=${e => (this.#titlenameEvents = e)}
						size="400 300"
						align-point="0 1"
						mount-point="0 1"
						position=${[200 * scale, -60 * scale, 0]}
					>
						<lume-element3d
							ref=${e => (this.#titlename = e)}
							id="titlename"
							class="fadeIn"
							opacity="0"
							size-mode="p p"
							size="1 1"
						>
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
					pointer-events: none;
				}
				#hero h1 {
					margin: 0;
				}
				#hero .title {
					font-size: calc(30px * var(--scale));
					letter-spacing: calc(0.45px * var(--scale));
					font-weight: 300;
					line-height: 2.8;
					transform: translateZ(0px);
				}
				#hero .first {
					font-family: 'Austin-LightItalic', serif;
					font-weight: 100;
					font-size: calc(180px * var(--scale));
					letter-spacing: calc(0px * var(--scale));
					transform: translate3d(0, -5px, 20px);
				}
				#hero .middlelast {
					font-size: calc(180px * var(--scale));
					letter-spacing: calc(5.4px * var(--scale));
					font-weight: 700;
					transform: translate3d(24px, 0, 0);
				}
			`
		},
	)
}
