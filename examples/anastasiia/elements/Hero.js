{
	const {Node, element, html, createEffect, onCleanup, Motor} = LUME

	element('av-hero')(
		class MenuBtn extends Node {
			hasShadow = true

			#titlename

			connectedCallback() {
				super.connectedCallback()

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
						this.#titlename.rotation.y += 0.05 * (-targetX - this.#titlename.rotation.y)
						this.#titlename.rotation.x += 0.05 * (targetY - this.#titlename.rotation.x)
					})

					onCleanup(() => {
						eventAborter.abort()
						Motor.removeRenderTask(task)
					})
				})
			}

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

					<lume-element3d
						ref=${e => (this.#titlename = e)}
						id="titlename"
						size="400 300"
						align-point="0 1"
						mount-point="0 1"
						position="30 -30 0.01"
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
					font-weight: 100;
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
