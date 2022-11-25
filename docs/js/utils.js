// Adapted from http://npmjs.com/min-indent
function minIndent(string) {
	const match = string.match(/^[ \t]*(?=\S)/gm)
	if (!match) return 0
	return match.reduce((r, a) => Math.min(r, a.length), Infinity)
}

// Adapted from http://npmjs.com/strip-indent
function stripIndent(string) {
	const indent = minIndent(string)
	if (indent === 0) return string
	const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm')
	return string.replace(regex, '')
}

/** no-op template tag */
function noop(strings, ...keys) {
	const lastIndex = strings.length - 1
	return strings.slice(0, lastIndex).reduce((p, s, i) => p + s + keys[i], '') + strings[lastIndex]
}

const html = noop // useful for syntax highlight and auto-formatting

const host = location.origin + '/'

const projectedTextureExample = stripIndent(html`
	<title>&lt;lume-texture-projector&gt;</title>

	<style>
		html,
		body {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			background: #333;
			touch-action: none;
		}
		#ui {
			position: absolute !important;
			top: 0;
			left: 0;
			color: white;
		}
		#ui,
		#ui lume-element3d {
			pointer-events: none;
		}
		#ui label {
			pointer-events: auto;
		}
		lume-element3d {
			padding: 15px;
		}
	</style>

	<script src="${host}global.js"></script>

	<script>
		LUME.defineElements()
	</script>

	<lume-scene id="scene" perspective="800" webgl shadowmap-type="pcfsoft">
		<lume-ambient-light color="white" intensity="0.4"></lume-ambient-light>

		<lume-camera-rig active initial-polar-angle="30" initial-distance="400" max-distance="7000" min-distance="100">
			<lume-point-light
				position="200 -200 200"
				intensity="0.6"
				color="white"
				shadow-bias="-0.001"
				shadow-map-width="2048"
				shadow-map-height="2048"
				slot="camera-child"
			></lume-point-light>
		</lume-camera-rig>

		<lume-box
			id="box"
			has="projected-material"
			projected-textures="#projectedTexture"
			sidedness="double"
			cast-shadow="true"
			receive-shadow="true"
			opacity="1"
			color="deeppink"
			dithering
			mount-point="0.5 0.5 0.5"
			rotation="0 45 0"
			size="100 100 100"
			scale="1 1 1"
		></lume-box>

		<lume-element3d id="textureRotator" rotation="0 45 0">
			<lume-element3d rotation="45 0 0">
				<lume-texture-projector
					id="projectedTexture"
					size="150 150"
					mount-point="0.5 0.5 0.5"
					src="${host}/images/monalisa-2.jpg"
					fitment="contain"
					visible="true"
					position="0 0 150"
					rotation="0 180 0"
				>
					<lume-box
						id="visual"
						opacity="0.5"
						color="yellow"
						size="1 1 500"
						size-mode="proportional proportional"
						cast-shadow="false"
						receive-shadow="false"
						visible="false"
					>
						<lume-sphere size="5" color="yellow" align-point="0.5 0.5"></lume-sphere>
					</lume-box>
				</lume-texture-projector>
			</lume-element3d>
		</lume-element3d>

		<lume-plane
			has="projected-material"
			projected-textures="#projectedTexture"
			size="800 800"
			color="cyan"
			rotation="90"
			position="0 150"
			mount-point="0.5 0.5"
		></lume-plane>
	</lume-scene>

	<lume-scene id="ui">
		<lume-element3d size-mode="proportional literal" size="1 80">
			<label>
				Projected texture enabled on box:
				<input
					type="checkbox"
					checked
					onchange="box.getAttribute('projected-textures') === 'none' ? box.setAttribute('projected-textures', '#projectedTexture') : box.setAttribute('projected-textures', 'none')"
				/>
			</label>
			<br />
			<label>
				Fitment "cover" instead of "contain"
				<input
					type="checkbox"
					onchange="projectedTexture.getAttribute('fitment') === 'contain' ? projectedTexture.setAttribute('fitment', 'cover') : projectedTexture.setAttribute('fitment', 'contain')"
				/>
			</label>
			<br />
			<label>
				Visualize texture projector:
				<input type="checkbox" onchange="visual.visible = !visual.visible" />
			</label>
		</lume-element3d>
	</lume-scene>

	<script>
		// LUME.defineElements()

		box.rotation = (x, y, z) => [x + 0.3, y + 0.3, z]
		textureRotator.rotation = (x, y, z) => [x, y + 0.1, z]
	</script>
`)

const buttonsWithShadowExample = stripIndent(html`
	<script src="${host}global.js"></script>
	<script src="${host}node_modules/vue/dist/vue.js"></script>
	<!-- Tween.js is a lib for animating numbers based on "easing curves". -->
	<script src="${host}node_modules/tween.js/src/Tween.js"></script>
	<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
	<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>

	<script>
		LUME.defineElements()
	</script>

	<style>
		body,
		html {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			overflow: hidden;
			font-family: sans-serif;
			touch-action: none;
		}
		lume-element3d {
			text-align: center;
		}
		#bg {
			background: #62b997;
		}
		button {
			width: 100%;
			height: 100%;
			white-space: nowrap;
			border-radius: 0px;
			border: 1px solid #494455;
			background: #e96699;
			color: #494455;
			outline: none;
		}
		button:focus,
		button:hover {
			background: #eb4b89;
			color: #0a3359;
			border-color: #0a3359;
		}
	</style>

	<template vue>
		<!-- Lights and shadows are powered by WebGL, but written with HTML: -->
		<lume-scene
			webgl="true"
			id="scene"
			background-color="black"
			background-opacity="0"
			perspective="800"
			shadowmap-type="pcfsoft"
			NOTE="one of basic, pcf, pcfsoft"
			touch-action="none"
		>
			<lume-ambient-light color="#ffffff" intensity="0"></lume-ambient-light>
			<lume-mixed-plane ref="plane" id="bg" size-mode="proportional proportional" size="1 1 0" color="#444" dithering>
				<lume-element3d
					id="button-container"
					position="0 0 20"
					size="600 31 0"
					align-point="0.5 0.5 0"
					mount-point="0.5 0.5 0"
				>
					<lume-mixed-plane
						v-for="n in [0,1,2,3,4]"
						ref="btn"
						:key="n"
						size-mode="literal proportional"
						size="100 1 0"
						:align-point="\`\${n*0.25} 0 0\`"
						:mount-point="\`\${n*0.25} 0 0\`"
						color="#444"
					>
						<button>button {{n+1}}</button>
					</lume-mixed-plane>
				</lume-element3d>
				<lume-element3d id="lightContainer" size="0 0 0" position="0 0 300">
					<lume-point-light
						id="light"
						color="white"
						size="0 0 0"
						cast-shadow="true"
						intensity="0.8"
						shadow-map-width="2048"
						shadow-map-height="2048"
						shadow-radius="2"
						distance="800"
						shadow-bias="-0.001"
					>
						<lume-mesh
							has="sphere-geometry basic-material"
							size="10 10 10"
							align-point="0.5 0.5 0.5"
							mount-point="0.5 0.5 0.5"
							color="white"
							receive-shadow="false"
							cast-shadow="false"
							style="pointer-events: none"
						>
						</lume-mesh>
					</lume-point-light>
				</lume-element3d>
			</lume-mixed-plane>
		</lume-scene>
	</template>

	<div id="buttonsRoot"></div>

	<script>
		new Vue({
			el: '#buttonsRoot',
			template: document.querySelector('[vue]').innerHTML,
			mounted() {
				const {Motor, Events} = LUME
				const scene = document.querySelector('#scene')
				const lightContainer = document.querySelector('#lightContainer')
				const light = document.querySelector('#light')
				const targetPosition = {x: window.innerWidth / 2, y: window.innerHeight / 2}

				document.addEventListener('pointermove', e => {
					e.preventDefault()
					targetPosition.x = e.clientX
					targetPosition.y = e.clientY
				})

				Motor.addRenderTask(time => {
					lightContainer.position.x += (targetPosition.x - lightContainer.position.x) * 0.05
					lightContainer.position.y += (targetPosition.y - lightContainer.position.y) * 0.05
				})

				let downTween, upTween, pressedButton

				// On mouse down animate the button downward
				document.addEventListener('pointerdown', e => {
					if (is(e.target, 'button')) {
						pressedButton = e.target

						if (upTween) {
							upTween.stop()
							upTween = null
						}

						downTween = new TWEEN.Tween(e.target.parentNode.position)
							.to({z: -20}, 75)
							.start()
							.onComplete(() => (downTween = null))

						Motor.addRenderTask(time => {
							if (!downTween) return false
							downTween.update(time)
						})
					}
				})

				// On mouse up animate the button upward
				document.addEventListener('pointerup', e => {
					if (pressedButton) {
						if (downTween) {
							downTween.stop()
							downTween = null
						}

						upTween = new TWEEN.Tween(pressedButton.parentNode.position)
							.to({z: 0}, 75)
							.start()
							.onComplete(() => (upTween = null))

						Motor.addRenderTask(time => {
							if (!upTween) return false
							upTween.update(time)
						})
					}
				})

				function is(el, selector) {
					if ([].includes.call(document.querySelectorAll(selector), el)) return true
					return false
				}
			},
		})
	</script>
`)

function meshExample({geometry = 'box', material = 'phong', color = ''} = {}) {
	return stripIndent(html`
		<script src="${host}global.js"></script>
		${
			'' /*
			TODO: The behaviors don't load if the global script is loaded after the
			scene markup instead of before and there is more than one behavior specified with has="".
			*/
		}
		<style>
			html,
			body {
				width: 100%;
				height: 100%;
				margin: 0;
				padding: 0;
				background: #222;
				touch-action: none;
			}
		</style>

		<lume-scene id="scene" perspective="800" webgl>
			<lume-point-light position="200 -200 200" intensity="0.6" color="white"></lume-point-light>
			<lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>
			<lume-camera-rig active initial-distance="400" max-distance="700" min-distance="100"></lume-camera-rig>

			<lume-mesh
				id="mesh"
				has="${geometry}-geometry ${material}-material"
				color="${color}"
				rotation="90 0 0"
				size="100 100 100"
				mount-point="0.5 0.5 0.5"
			></lume-mesh>
		</lume-scene>

		<script>
			LUME.defineElements()

			mesh.rotation = (x, y, z) => [++x, ++y, z]
		</script>
	`)
}

function miniGalaxyDemo() {
	return stripIndent(html`
		<script src="${host}global.js"></script>

		<lume-scene id="scene">
			<lume-element3d id="container" size="78 78" align-point="0.5 0.5" mount-point="0.5 0.5">
				<lume-element3d
					class="sun"
					size-mode="proportional proportional"
					size="0.8 0.8"
					position="0 0 10"
					align-point="0.5 0.5"
					mount-point="0.5 0.5"
				>
					<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
				</lume-element3d>
				<lume-element3d class="rotator A" size="60 60" align-point="1 1">
					<lume-element3d
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-element3d>
					<lume-element3d class="rotator" size="45 45" align-point="1 1">
						<lume-element3d
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-element3d>
						<lume-element3d class="rotator" size="28 28" align-point="1 1">
							<lume-element3d
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-element3d>
						</lume-element3d>
					</lume-element3d>
				</lume-element3d>
				<lume-element3d class="rotator A" size="60 60" mount-point="1 1">
					<lume-element3d
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-element3d>
					<lume-element3d class="rotator" size="45 45" mount-point="1 1">
						<lume-element3d
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-element3d>
						<lume-element3d class="rotator" size="28 28" mount-point="1 1">
							<lume-element3d
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-element3d>
						</lume-element3d>
					</lume-element3d>
				</lume-element3d>
				<lume-element3d class="rotator B" size="60 60" align-point="0 1" mount-point="1 0">
					<lume-element3d
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-element3d>
					<lume-element3d class="rotator" size="45 45" align-point="0 1" mount-point="1 0">
						<lume-element3d
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-element3d>
						<lume-element3d class="rotator" size="28 28" align-point="0 1" mount-point="1 0">
							<lume-element3d
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-element3d>
						</lume-element3d>
					</lume-element3d>
				</lume-element3d>
				<lume-element3d class="B" size="60 60" align-point="1 0" mount-point="0 1">
					<lume-element3d
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-element3d>
					<lume-element3d class="rotator" size="45 45" align-point="1 0" mount-point="0 1">
						<lume-element3d
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-element3d>
						<lume-element3d class="rotator" size="28 28" align-point="1 0" mount-point="0 1">
							<lume-element3d
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-element3d>
						</lume-element3d>
					</lume-element3d>
				</lume-element3d>
			</lume-element3d>
		</lume-scene>

		<style>
			html,
			body {
				margin: 0;
				padding: 0;
				height: 100%;
				width: 100%;
			}
			lume-scene {
				background: black;
				touch-action: none;
			}
			lume-element3d {
				border-radius: 100%;
				color: white;
				font-family: sans-serif;
				font-weight: bold;
			}
			lume-element3d:not(.sun) {
				background: rgba(255, 255, 0, 0.2);
			}
			img {
				width: 100%;
				height: 100%;
				display: block;
			}
		</style>

		<script>
			LUME.defineElements()

			document.querySelectorAll('.A, .A .rotator').forEach(n => {
				n.rotation = (x, y, z, t) => [-65 * Math.sin(t * 0.0005), y, -65 * Math.sin(t * 0.0005)]
			})

			document.querySelectorAll('.B, .B .rotator').forEach(n => {
				n.rotation = (x, y, z, t) => [65 * Math.sin(t * 0.0005), 65 * Math.sin(t * 0.0005), z]
			})

			const rotationAmount = 35

			// Add some interaction so we can see the shine from the light!
			scene.addEventListener('pointermove', event => {
				// Rotate the image a little bit too.
				container.rotation.y = (event.clientX / scene.calculatedSize.x) * (rotationAmount * 2) - rotationAmount
				container.rotation.x = -((event.clientY / scene.calculatedSize.y) * (rotationAmount * 2) - rotationAmount)
			})
		</script>
	`)
}

function sceneExample() {
	return stripIndent(html`
		<script src="${host}global.js"></script>

		<lume-scene id="scene">
			<lume-element3d size="100 100" align-point="0.5 0.5" mount-point="0.5 0.5" rotation="0 30 0">
				I am centered in the scene, and I am rotated a bit.
			</lume-element3d>
		</lume-scene>

		<style>
			html,
			body {
				margin: 0;
				padding: 0;
				height: 100%;
				width: 100%;
			}
			lume-element3d {
				padding: 5px;
				border: 1px solid skyblue;
			}
		</style>

		<script>
			LUME.defineElements()
		</script>
	`)
}

function pointLightExample() {
	return stripIndent(html`
		<script src="${host}global.js"></script>

		<lume-scene webgl shadowmap-type="soft">
			<lume-ambient-light color="white" intensity="0.7"></lume-ambient-light>

			<!-- We need a plane onto which shadows will land (the "floor"). -->
			<lume-element3d align-point="0.5 0.5" mount-point="0.5 0.5" rotation="60 0 0" size="1000 1000">
				<lume-plane color="white" size="1500 1500" align-point="0.5 0.5" mount-point="0.5 0.5" rotation="0 0 30">
					<!-- For simplicity, let's position the light, and a cube, relative to (as children of) the "floor". -->

					<!-- A point in space where light emanates from. -->
					<lume-point-light
						color="white"
						position="500 -500 500"
						intensity="1"
						shadow-map-width="1024"
						shadow-map-height="1024"
					></lume-point-light>

					<!-- A box that will cast a shadow onto the floor. -->
					<lume-box
						id="box"
						color="skyblue"
						size="50 50 50"
						align-point="0.5 0.5 0.5"
						mount-point="0.5 0.5 0"
						rotation="0 0 10"
					></lume-box>
				</lume-plane>
			</lume-element3d>
		</lume-scene>

		<style>
			html,
			body {
				margin: 0;
				height: 100%;
				width: 100%;
				background: white;
			}
		</style>

		<script>
			LUME.defineElements()

			box.rotation = (x, y, z) => [x, y, ++z]
		</script>
	`)
}

function directionalLightExample() {
	return stripIndent(html`
		<script src="${host}global.js"></script>

		<lume-scene webgl shadowmap-type="soft">
			<lume-ambient-light color="white" intensity="0.7"></lume-ambient-light>

			<!-- We need a plane onto which shadows will land (the "floor"). -->
			<lume-element3d align-point="0.5 0.5" mount-point="0.5 0.5" rotation="60 0 0" size="1000 1000">
				<lume-plane color="white" size="1500 1500" align-point="0.5 0.5" mount-point="0.5 0.5" rotation="0 0 30">
					<!-- For simplicity, let's position the light, and a cube, relative to (as children of) the "floor". -->

					<!-- A point in space that determines direction of an infinitely-far source of light. -->
					<lume-directional-light
						color="white"
						position="500 -500 500"
						intensity="1"
						shadow-map-width="1024"
						shadow-map-height="1024"
					></lume-directional-light>

					<!-- A box that will cast a shadow onto the floor. -->
					<lume-box
						id="box"
						color="skyblue"
						size="50 50 50"
						align-point="0.5 0.5 0.5"
						mount-point="0.5 0.5 0"
						rotation="0 0 10"
					></lume-box>

					<!-- Add an interactive camera viewpoint. -->
					<lume-element3d align-point="0.5 0.5" rotation="-90 0 0">
						<lume-camera-rig initial-polar-angle="30" min-polar-angle="5" initial-distance="500"></lume-camera-rig>
					</lume-element3d>
				</lume-plane>
			</lume-element3d>
		</lume-scene>

		<style>
			html,
			body {
				margin: 0;
				height: 100%;
				width: 100%;
				background: white;
				touch-action: none;
			}
		</style>

		<script>
			LUME.defineElements()

			box.rotation = (x, y, z) => [x, y, ++z]
		</script>
	`)
}

function spotLightExample() {
	return stripIndent(html`
		<script src="${host}global.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/tweakpane@3.1.0/dist/tweakpane.js"></script>

		<lume-scene webgl shadowmap-type="soft">
			<lume-ambient-light color="white" intensity="0.7"></lume-ambient-light>

			<!-- A sphere to visualize the world origin -->
			<lume-sphere
				size="20"
				position="0 0 20"
				align-point="0.5 0.5"
				mount-point="0.5 0.5"
				color="yellow"
				has="basic-material"
			>
				<lume-mixed-plane size="220 50" rotation="-90 0 0" position="0 0 40" align-point="0 1" mount-point="0 1">
					world origin
				</lume-mixed-plane>
			</lume-sphere>

			<lume-plane color="white" size="20000 20000" mount-point="0.5 0.5" rotation="0 0 30" position="600 600">
				<!-- For simplicity, let's position the light, and a cube,
				relative to (as children of) the "floor". -->

				<!-- A point in space that determines direction of a cone-shaped
				light emission. It will be pointed at (targetted at) the
				#object1. -->
				<lume-spot-light
					id="light1"
					align-point="0.5 0.5"
					color="deeppink"
					position="0 0 400"
					distance="0"
					intensity="0.3"
					angle="30"
					penumbra="0.2"
					shadow-map-width="1024"
					shadow-map-height="1024"
					target="#object1"
				>
					<lume-sphere
						size="10"
						color="deeppink"
						has="basic-material"
						mount-point="0.5 0.5 0.5"
						cast-shadow="false"
						receive-shadow="false"
					></lume-sphere>
				</lume-spot-light>

				<!-- A second such light pointed at (targetted at) the #object2. -->
				<lume-spot-light
					id="light2"
					align-point="0.5 0.5"
					color="royalblue"
					position="0 0 400"
					distance="0"
					intensity="0.4"
					angle="30"
					penumbra="0.2"
					shadow-map-width="1024"
					shadow-map-height="1024"
				>
					<lume-sphere
						size="10"
						color="royalblue"
						has="basic-material"
						mount-point="0.5 0.5 0.5"
						cast-shadow="false"
						receive-shadow="false"
					></lume-sphere>
				</lume-spot-light>

				<!-- A box that will cast a shadow onto the floor. -->
				<lume-element3d id="object1" align-point="0.5 0.5" mount-point="0.5 0.5" position="100 100 60">
					<lume-gltf-model
						id="model"
						src="${host}examples/disco-helmet/DamagedHelmet.glb"
						color="skyblue"
						scale="50 50 50"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
						rotation="-90 0 0"
					></lume-gltf-model>
				</lume-element3d>

				<!-- A second such box. -->
				<lume-box
					id="object2"
					color="skyblue"
					size="50 50 50"
					align-point="0.5 0.5"
					mount-point="0.5 0.5"
					position="-100 -100 20"
					rotation="0 0 10"
				></lume-box>

				<!-- Add an interactive camera viewpoint. -->
				<lume-element3d align-point="0.5 0.5" rotation="-90 0 0" position="0 0 60">
					<lume-camera-rig initial-polar-angle="30" min-polar-angle="5" initial-distance="500"></lume-camera-rig>
				</lume-element3d>
			</lume-plane>
		</lume-scene>

		<style>
			html,
			body {
				margin: 0;
				height: 100%;
				width: 100%;
				background: #b2b2b2;
				touch-action: none;
			}

			lume-mixed-plane {
				font-size: 40px;
				padding: 0 10px;
				background: black;
				color: skyblue;
			}
		</style>

		<script>
			LUME.defineElements()

			const pane = new Tweakpane.Pane()
			const folder = pane.addFolder({title: 'play with options', expanded: false})

			folder.addInput(light1, 'debug')
			folder.addInput(light1, 'penumbra', {min: 0, max: 1})
			folder.addInput(light1, 'angle', {min: 10, max: 32})

			folder
				.addInput({target: '#object1'}, 'target', {
					label: 'light1 target',
					options: {'none (world origin)': '', '#object1': '#object1', '#object2': '#object2'},
				})
				.on('change', event => (light1.target = event.value))

			folder
				.addInput({target: '#object2'}, 'target', {
					label: 'light2 target',
					options: {'none (world origin)': '', '#object1': '#object1', '#object2': '#object2'},
				})
				.on('change', event => (light2.target = event.value))

			LUME.autorun(() => {
				light2.debug = light1.debug
				light2.penumbra = light1.penumbra
				light2.angle = light1.angle
			})

			light2.target = [object2]

			object1.rotation = (x, y, z) => [x, y, ++z]
			object2.rotation = (x, y, z) => [x, y, ++z]
			light1.position = (x, y, z, t) => [x, Math.sin(t * 0.001) * 400, z]
			light2.position = (x, y, z, t) => [Math.sin(t * 0.001) * 400, y, z]

			model.on('MODEL_LOAD', () => {
				model.three.traverse(node => {
					node.castShadow = true
					console.log('shadow', node, node.castShadow)
				})
			})
		</script>
	`)
}

function perspectiveLayeredImage({bg, fg, bgPosition = {x: 0, y: 0}, fgPosition = {}}) {
	return stripIndent(html`
		<script src="${host}global.js"></script>

		<lume-scene id="scene" touch-action="none" webgl>
			<lume-point-light
				align-point="0.5 0.5"
				position="0 0 500"
				distance="800"
				shadow-radius="2"
				shadow-bias="-0.001"
			></lume-point-light>

			<lume-element3d
				id="container"
				align-point="0.5 0.5"
				mount-point="0.5 0.5"
				size-mode="proportional proportional"
				size="1 1"
				scale="1.2 1.2 1.2"
			>
				<lume-mixed-plane
					size-mode="proportional proportional"
					size="1 1"
					position="${bgPosition.x || 0} ${bgPosition.y || 0} -50"
					color="#444"
				>
					<img src="${host}${bg}" />
				</lume-mixed-plane>
				<lume-mixed-plane size-mode="proportional proportional" size="1 1" position="0 0 50" color="#444">
					<img src="${host}${fg}" />
				</lume-mixed-plane>
			</lume-element3d>
		</lume-scene>

		<style>
			html,
			body {
				margin: 0;
				padding: 0;
				height: 100%;
				width: 100%;
			}
			lume-scene {
				background: #fefefe;
				touch-action: none;
			}
			img {
				width: 100%;
				height: 100%;
				display: block;
			}
		</style>

		<script>
			LUME.defineElements()

			const rotationAmount = 10
			const targetRotation = {
				x: 0,
				y: 0,
			}

			const setTargetRotation = event => {
				targetRotation.y = (event.clientX / scene.calculatedSize.x) * (rotationAmount * 2) - rotationAmount
				targetRotation.x = -((event.clientY / scene.calculatedSize.y) * (rotationAmount * 2) - rotationAmount)
			}

			// Rotate the image a little bit based on pointer position.
			scene.addEventListener('pointermove', setTargetRotation)
			scene.addEventListener('pointerdown', setTargetRotation)

			// Rotate the container towards the targetRotation over time to make it smooth.
			LUME.Motor.addRenderTask(() => {
				container.rotation.x += (targetRotation.x - container.rotation.x) * 0.05
				container.rotation.y += (targetRotation.y - container.rotation.y) * 0.05
			})
		</script>
	`)
}

// Make SVG path strings at https://yqnn.github.io/svg-path-editor/
const starPath =
	'M5.605 12.784c-.294-.052-.556-.222-.718-.466-.098-.147-.08-.095-.455-1.303-.077-.247-.188-.603-.246-.79-.058-.187-.168-.54-.244-.785l-.138-.444-.12-.037c-.137-.043-.721-.224-1.059-.329-.126-.04-.3-.094-.385-.12-1.613-.501-1.572-.487-1.679-.548-.393-.221-.611-.658-.55-1.098.034-.249.148-.468.335-.644.055-.052.488-.363 1.397-1.005l1.318-.93-.006-.255c-.01-.461-.027-2.045-.029-2.58-.001-.552-.001-.55.046-.7.031-.1.111-.246.181-.335.313-.396.86-.525 1.312-.311.117.055.101.044.64.446.248.185.822.613 1.277.953l.826.617.179-.061c.098-.034.324-.11.503-.171.516-.175.807-.273 1.395-.473.94-.319 1.012-.343 1.107-.359.515-.089 1.026.211 1.202.705.064.179.081.368.05.55-.011.064-.074.264-.196.624-.195.574-.322.95-.477 1.407-.054.161-.165.486-.245.721l-.145.429.616.826c.34.455.779 1.043.976 1.307.299.4.367.498.413.59.183.372.14.81-.112 1.141-.155.204-.371.339-.644.406-.043.01-.175.013-.595.012-.53-.002-2.032-.019-2.555-.029l-.265-.005-.93 1.316c-.511.724-.951 1.34-.977 1.37-.25.286-.636.423-1.003.358z'

const shapesExample = stripIndent(html`
	<script src="${host}global.js"></script>

	<style>
		html,
		body {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			background: white;
			touch-action: none;
		}
	</style>

	<script src="global.js"></script>

	<lume-scene id="scene" perspective="800" webgl fog-mode="none" fog-near="100" fog-far="500" fog-color="white">
		<lume-ambient-light color="white" intensity="0.4"></lume-ambient-light>

		<lume-camera-rig id="cam" active initial-distance="200" max-distance="70000" min-distance="100">
			<lume-point-light position="200 0 200" intensity="0.7" color="white" slot="camera-child"></lume-point-light>
			<lume-perspective-camera
				align-point="0.5 0.5 0.5"
				far="200000"
				active
				slot="camera-child"
			></lume-perspective-camera>
		</lume-camera-rig>

		<lume-shape
			size="30 60 15"
			color="red"
			position="30 0 0"
			rotation="0 -30 0"
			mount-point="0.5 0.5"
			sidedness="double"
			receive-shadow="false"
			fitment="cover"
		>
			<lume-box
				visible="false"
				has="basic-material"
				opacity="0.9"
				size-mode="proportional proportional proportional"
				size="1 1 1"
				color="black"
				wireframe
			></lume-box>
		</lume-shape>
		<lume-shape
			size="40 25 15"
			color="red"
			scale="1.2 1.2 1.2"
			position="-30 0 0"
			rotation="0 30 0"
			mount-point="0.5 0.5"
			sidedness="double"
			receive-shadow="false"
			fitment="cover"
		>
			<lume-box
				visible="false"
				has="basic-material"
				opacity="0.9"
				size-mode="proportional proportional proportional"
				size="1 1 1"
				color="black"
				wireframe
			></lume-box>
		</lume-shape>

		<lume-element3d rotation="0 10 0">
			<!--
			FIXME mesh with manual behaviors not working initially. Change the has
			attribute to something else and back, then it works. Code load order
			issue.
			-->
			<!-- <lume-mesh has="shape-geometry phong-material" size="0 0 5" color="white" position="30 0 0" sidedness="double" receive-shadow="false"> -->
			<lume-shape
				size="30 60 5"
				color="red"
				position="-10 40"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="none"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="30 60 10"
				color="red"
				scale="0.75 0.75 0.75"
				position="30 -60 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="contain"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="30 60 15"
				color="red"
				position="50 50 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="scale-down"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="10 60 5"
				color="red"
				position="-50 -50 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="scale-down"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="30 10 5"
				color="red"
				position="40 -40 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="scale-down"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>
		</lume-element3d>

		<lume-element3d position="0 0 0">
			<lume-shape
				size="40 25 5"
				color="red"
				position="-20 50 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="none"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="40 25 10"
				color="red"
				scale="0.75 0.75 0.75"
				position="50 -50 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="contain"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="40 25 15"
				color="red"
				position="-20 -40 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="scale-down"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="40 10 5"
				color="red"
				position="80 0 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="scale-down"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>

			<lume-shape
				size="10 25 5"
				color="red"
				position="-70 0 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
				fitment="scale-down"
			>
				<lume-box
					visible="false"
					has="basic-material"
					opacity="0.9"
					size-mode="proportional proportional proportional"
					size="1 1 1"
					color="black"
					wireframe
				></lume-box>
			</lume-shape>
		</lume-element3d>
	</lume-scene>

	<script>
		// Define all the LUME elements with their default names.
		LUME.defineElements()

		// Dolly the camera towards the hearts for intro animation.

		const camTargetDistance = 0
		let camDistance = 700

		LUME.Motor.addRenderTask((t, dt) => {
			if (camDistance <= 1) {
				return false
			}

			camDistance -= 0.03 * (camDistance - camTargetDistance)

			cam.position.z = camDistance
		})
	</script>

	<div class="ui">
		<fieldset>
			<legend>Options</legend>
			<label> <input type="checkbox" onchange="updateSize()" />&nbsp; Show size boundaries </label>
			<br />
			<label> <input type="checkbox" onchange="updateBevel()" />&nbsp; Bevel </label>
			<fieldset>
				<legend>Shape</legend>
				<label>
					<input type="radio" name="shape" value="hearts" checked onchange="updateShape(event)" />&nbsp; Hearts
				</label>
				<br />
				<label>
					<input type="radio" name="shape" value="triangles" onchange="updateShape(event)" />&nbsp; Triangles
				</label>
				<br />
				<label>
					<input type="radio" name="shape" value="trapezoids" onchange="updateShape(event)" />&nbsp; Trapezoids
				</label>
				<br />
				<label> <input type="radio" name="shape" value="stars" onchange="updateShape(event)" />&nbsp; Stars </label>
			</fieldset>
		</fieldset>
	</div>

	<script>
		let showSize = false
		const boxes = Array.from(document.querySelectorAll('lume-box'))

		function updateSize() {
			showSize = !showSize
			for (const box of boxes) box.visible = showSize
		}

		const shapes = Array.from(document.querySelectorAll('lume-shape'))

		let bevel = false

		function updateBevel() {
			bevel = !bevel
			for (const shape of shapes) {
				shape.bevel = bevel
			}
		}

		function updateShape(event) {
			const input = event.target

			// react only to the newly checked radio
			if (!input.checked) return

			for (const shape of shapes) {
				if (input.value === 'triangles') {
					// Set a Shape instance
					// TODO convert to global THREE.* API after finishing externalization in the externalize-THREE branch.
					//shape.shape = new LUME.THREE.Shape([
					//new LUME.THREE.Vector2(-12, 0),
					//new LUME.THREE.Vector2(12, 0),
					//new LUME.THREE.Vector2(0, 12),
					//new LUME.THREE.Vector2(-12, 0),
					//])
					shape.shape = '-12, 0 12, 0 0, 12 -12, 0'
				} else if (input.value === 'trapezoids') {
					// Set the 'shape' attribute with a list of points
					shape.setAttribute('shape', '-5 0, 2 -13,  13 -13,  20 0,  0 0')
				} else if (input.value === 'stars') {
					// Set an SVG path string (same as the value you'd find in a <path> element's d="" attribute).
					// Make SVG path strings at https://yqnn.github.io/svg-path-editor/
					shape.shape = '${starPath}'
				} else {
					// Revert back to the default shape
					shape.shape = null
				}
			}
		}
	</script>

	<style>
		.ui {
			position: absolute;
			margin: 15px;
			padding: 10px;
			top: 0;
			left: 0;
			color: white;
			color: red;
			font-family: sans-serif;
			background: rgba(255, 0, 0, 0.8);
			background: rgba(255, 255, 255, 0.8);
			border-radius: 7px;
		}

		fieldset legend {
			color: white;
			color: red;
		}
		fieldset {
			border-color: white;
			border-color: black;
			border-radius: 4px;
			border-style: dashed;
		}
	</style>
`)

const instancedMeshExample = stripIndent(html`
	<style>
		html,
		body {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			background: #222;
			touch-action: none;
		}
	</style>

	<lume-scene id="scene" perspective="800" webgl>
		<lume-point-light position="200 -200 200" intensity="0.6" color="white"></lume-point-light>
		<lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>

		<lume-element3d size-mode="proportional proportional" size="1 1" style="border: 5px solid teal"></lume-element3d>

		<lume-camera-rig
			active
			initial-distance="1000"
			max-distance="2500"
			min-distance="100"
			position="500 500 500"
		></lume-camera-rig>

		<!-- FIXME: this works: -->
		<!-- <lume-mesh has="sphere-geometry" size="30 30 30"></lume-mesh> -->
		<!-- this doesn't: -->
		<!-- <lume-mesh has="sphere-geometry phong-material" size="30 30 30"></lume-mesh> -->
	</lume-scene>

	<script src="${host}global.js"></script>
	<script>
		// Define all the LUME elements with their default names.
		LUME.defineElements()

		const numberOfObjects = 10000

		scene.append(LUME.html\`
			<lume-instanced-mesh id="mesh" color="white" count=\${numberOfObjects} size="30 30 30">
			</lume-instanced-mesh>
		\`)

		mesh.rotations = Array.from({length: numberOfObjects * 3}).map(() => Math.random())
		mesh.positions = Array.from({length: numberOfObjects * 3}).map(() => 1000 * Math.random())
		mesh.scales = Array.from({length: numberOfObjects * 3}).map(() => Math.random())
		mesh.colors = Array.from({length: numberOfObjects * 3}).map(() => Math.random())

		LUME.Motor.addRenderTask(() => {
			let i = 0
			const a = mesh.rotations

			for (const rot of a) {
				a[i] += 0.01
				i++
			}

			// Modifying the array in place does not trigger reactivity (arrays
			// are currently not reactive) so we need to notify that the mesh
			// needs to be re-rendered.
			mesh.needsUpdate()

			// If you wish to trigger reactivity for mesh.rotations in a case
			// like this one, then do this:
			// mesh.rotations = mesh.rotations
		})
	</script>
`)

const originExample = stripIndent(html`
	<body touch-action="none">
		<script src="${host}global.js"></script>

		<style>
			html,
			body {
				width: 100%;
				height: 100%;
				margin: 0;
				padding: 0;
				background: #333;
				touch-action: none; /* prevent touch drag from scrolling */
				color: #ccc;
			}
			lume-scene {
				position: absolute !important;
				top: 0;
				left: 0;
			}
			lume-element3d {
				padding: 15px;
				pointer-events: all;
			}
			#scene2 {
				pointer-events: none;
			}
			#scene2 lume-element3d {
				pointer-events: auto;
			}
		</style>

		<!-- Use the enable-css attribute to disable CSS rendering so that only
		WebGL rendering is enabled (this saves CPU/Memory if you don't need CSS
		rendering, and are not debugging in devtools).
		-->
		<lume-scene webgl enable-css="false">
			<lume-ambient-light intensity="0.3"></lume-ambient-light>
			<lume-point-light
				align-point="0.5 0.5 0.5"
				position="-200 -200 400"
				intensity="0.5"
				shadow-map-width="1024"
				shadow-map-height="1024"
			></lume-point-light>

			<lume-camera-rig
				align-point="0.5 0.5"
				active
				initial-distance="400"
				max-distance="700"
				min-distance="100"
			></lume-camera-rig>
		</lume-scene>

		<lume-scene id="scene2">
			<lume-element3d size-mode="proportional literal" size="1 80">
				<label>
					X rotation <code id="xRotationVal"></code>:
					<input id="xRotation" type="range" min="0" max="360" value="0" />
				</label>
				<br />
				<label>
					Y rotation <code id="yRotationVal"></code>:
					<input id="yRotation" type="range" min="0" max="360" value="0" />
				</label>
				<br />
				<label>
					Z rotation <code id="zRotationVal"></code>:
					<input id="zRotation" type="range" min="0" max="360" value="0" />
				</label>
			</lume-element3d>
		</lume-scene>

		<script>
			LUME.defineElements()

			const {html} = LUME

			// the following values of origin allow the boxes to rotate around one of
			// their corners.
			const origins = [
				'0 0 0', // left/top/back
				'1 0 0', // right/top/back
				'0 1 0', // left/bottom/back
				'0 0 1', // left/top/front
				'1 1 0', // right/bottom/back
				'1 0 1', // right/top/front
				'0 1 1', // left/bottom/front
				'1 1 1', // right/bottom/front
			]

			const makeBox = (origin, i) => html\`
				${/* Lays the boxes out in a two-row grid, four boxes per row. */ ''}
				<lume-box
					origin=\${origin}
					align-point=\${[0.2 + (i % 4) * 0.2, i < 4 ? 0.4 : 0.6, 0]}
					size="100 100 100"
					mount-point="0.5 0.5 0.5"
					color="skyblue"
					opacity="0.5"
				>
					<lume-sphere align-point=\${origin} size="10 10 10" mount-point="0.5 0.5 0.5" color="deeppink"></lume-sphere>
				</lume-box>
			\`

			const scene = document.querySelector('lume-scene')
			const boxes = []

			let i = 0

			for (const origin of origins) {
				const box = makeBox(origin, i)
				boxes.push(box)
				scene.append(box)
				i += 1
			}

			const updateValues = () => {
				xRotationVal.innerHTML = '(' + xRotation.value.padStart(3).replace(' ', '&nbsp;') + ' deg)'
				yRotationVal.innerHTML = '(' + yRotation.value.padStart(3).replace(' ', '&nbsp;') + ' deg)'
				zRotationVal.innerHTML = '(' + zRotation.value.padStart(3).replace(' ', '&nbsp;') + ' deg)'
			}

			updateValues()

			const onChangeXRotation = () => {
				for (const box of boxes) box.rotation = [xRotation.value, yRotation.value, zRotation.value]

				updateValues()
			}

			xRotation.addEventListener('change', onChangeXRotation)
			xRotation.addEventListener('input', onChangeXRotation)
			yRotation.addEventListener('change', onChangeXRotation)
			yRotation.addEventListener('input', onChangeXRotation)
			zRotation.addEventListener('change', onChangeXRotation)
			zRotation.addEventListener('input', onChangeXRotation)
		</script>
	</body>
`)

const morphingSpiralExample = stripIndent(html`
	<script src="${host}global.js"></script>
	<script src="${host}node_modules/vue/dist/vue.js"></script>

	<body>
		<template>
			<lume-scene id="scene" webgl="true" enable-css="false">
				<lume-element3d
					ref="rotator"
					TODO-calculate-minimum-size-based-on-viewport-size
					size="1630 1630"
					align-point="0.5 0.5"
					mount-point="0.5 0.5"
					rotation="0 0 0"
				>
					<lume-element3d
						v-for="(n, i) of Array(400)"
						:key="i"
						size="0 0 0"
						align-point="0.5 0.5"
						:rotation="[0, 0, i * 10]"
					>
						<lume-rounded-rectangle
							has="basic-material"
							:corner-radius="i % 50 > (50 - (i % 50)) / 2 ? (50 - (i % 50)) / 2 : i % 50"
							thickness="1"
							quadratic-corners="false"
							:size="[50 - i % 50, 50 - i % 50, 0]"
							mount-point="0.5 0.5"
							:position="[0, i * 2, 0]"
							:color="'hsl(' + ((i * 2) % 360) + ', 90%, 78%)'"
							:style="{
								background: 'hsl(' + ((i * 2) % 360) + ', 90%, 78%)',
								borderRadius: (i % 50) + 'px',
							}"
						></lume-rounded-rectangle>
					</lume-element3d>
				</lume-element3d>
			</lume-scene>
		</template>

		<div class="ui">
			<fieldset>
				<legend>Render mode</legend>
				<!-- prettier-ignore -->
				<label>
					<input type="radio" name="webgl" onchange="scene.enableCss = !(scene.webgl = this.checked)" checked />
					WebGL (higher fps, longer initialization)
				</label>
				<br />
				<!-- prettier-ignore -->
				<label>
					<input type="radio" name="webgl" onchange="scene.enableCss = !(scene.webgl = !this.checked)" />
					CSS (lower fps, shorter initialization)
				</label>
			</fieldset>
		</div>

		<style>
			lume-scene {
				background: #333;
			}
			html,
			body {
				width: 100%;
				height: 100%;
				padding: 0;
				margin: 0;
			}

			.ui {
				position: absolute;
				margin: 15px;
				padding: 10px;
				top: 0;
				left: 0;
				color: white;
				font-family: sans-serif;
				background: rgba(0, 0, 0, 0.6);
				border-radius: 7px;
			}

			fieldset {
				--fieldsetOutline: hsl(320, 90%, 78%);
				--fieldsetText: hsl(100, 90%, 78%);

				color: var(--fieldsetText);
				border-color: var(--fieldsetOutline);
				border-radius: 4px;
			}
			fieldset legend {
				color: var(--fieldsetOutline);
			}
		</style>

		<script>
			LUME.defineElements()
			var template = document.querySelector('template')

			new Vue({
				el: template,
				template: template.innerHTML,
				mounted() {
					const rotator = this.$refs.rotator
					rotator.rotation = (x, y, z) => [x, y, z - 9.8]
				},
			})
		</script>
	</body>
`)

const perspectiveCameraExample = stripIndent(html`
	<body touch-action="none">
		<script src="${host}global.js"></script>
		<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
		<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>

		<style>
			body,
			html {
				width: 100%;
				height: 100%;
				margin: 0;
				padding: 0;
				overflow: hidden;
				background: #191919;
				touch-action: none; /* prevent touch drag from scrolling */
				color: #ccc;
			}
			lume-scene {
				position: absolute !important;
				top: 0;
				left: 0;
			}
			lume-scene:nth-of-type(2),
			lume-scene:nth-of-type(2) lume-element3d {
				pointer-events: none;
			}
			lume-scene:nth-of-type(2) label {
				pointer-events: auto;
			}
			lume-element3d {
				padding: 15px;
			}
			label {
				padding-right: 10px;
			}
		</style>

		<!-- FIXME: Move this script tag below the UI, and initial values stop working, so the UI is squished. -->
		<script>
			// defines the default names for the HTML elements
			LUME.defineElements()
		</script>

		<lume-scene id="scene" webgl perspective="800" touch-action="none">
			<!-- This node visualizes the size of the default viewing area. -->
			<lume-element3d
				size-mode="proportional proportional"
				size="1 1"
				style="border: 5px solid royalblue;"
			></lume-element3d>

			<lume-perspective-camera id="cam" position="0 0 1000" align-point="0.5 0.5"></lume-perspective-camera>

			<lume-ambient-light intensity="0.3"></lume-ambient-light>
			<lume-point-light id="light" color="white" cast-shadow="true" intensity="0.8" position="0 0 300">
				<lume-mesh
					has="sphere-geometry basic-material"
					cast-shadow="false"
					size="10 10 10"
					mount-point="0.5 0.5"
					color="#eee"
				></lume-mesh>
			</lume-point-light>

			<!-- Specify a color otherwise the material will be tinted deeppink by default -->
			<lume-mesh
				id="model"
				has="box-geometry phong-material"
				rotation="40 40 0"
				align-point="0.5 0.5 0.5"
				mount-point="0.5 0.5 0.5"
				size="100 100 100"
				color="white"
				texture="${host}textures/cement.jpg"
			>
			</lume-mesh>
		</lume-scene>

		<lume-scene id="scene2">
			<lume-element3d size-mode="proportional literal" size="1 80">
				<label>
					Camera active:
					<input id="active" type="checkbox" onchange="cam.active = !cam.active" />
				</label>
				<br />
				<label>
					Field of view <code>(50)</code>:
					<input
						id="fov"
						type="range"
						min="1"
						max="75"
						value="50"
						onchange="onFovChange(this)"
						oninput="onFovChange(this)"
					/>
				</label>
				<br />
				<script>
					const onFovChange = el => {
						cam.fov = el.value
						el.previousElementSibling.textContent = '(' + el.value.padStart(2, '0') + ')'
					}
				</script>
				<label>
					Camera Y rotation <code>(0)</code>:
					<input
						type="range"
						min="-45"
						max="45"
						value="0"
						onchange="onRotationChange(this)"
						oninput="onRotationChange(this)"
					/>
				</label>
				<br />
				<script>
					const onRotationChange = el => {
						cam.rotation.y = el.value
						el.previousElementSibling.textContent = '(' + el.value.padStart(2, '0') + ')'
					}
				</script>
				<label>
					Camera Y position <code>(0)</code>:
					<input
						type="range"
						min="-150"
						max="150"
						value="0"
						onchange="onPositionChange(this)"
						oninput="onPositionChange(this)"
					/>
				</label>
				<script>
					const onPositionChange = el => {
						window.debug = true
						cam.position.y = el.value
						window.debug = false
						el.previousElementSibling.textContent = '(' + el.value.padStart(2, '0') + ')'
					}
				</script>
			</lume-element3d>
		</lume-scene>

		<script>
			document.addEventListener('pointermove', event => {
				event.preventDefault()
				light.position.x = event.clientX
				light.position.y = event.clientY
			})

			const rotate = t => 180 * Math.sin(0.0005 * t)

			model.rotation = (x, y, z, t) => [rotate(t / 1.4), rotate(t / 2.1), rotate(t / 2.5)]
		</script>
	</body>
`)

const cameraRigExample = stripIndent(html`
	<body touch-action="none">
		<script src="${host}global.js"></script>
		<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
		<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>

		<style>
			body,
			html {
				width: 100%;
				height: 100%;
				margin: 0;
				padding: 0;
				overflow: hidden;
				background: #191919;
				touch-action: none; /* prevent touch drag from scrolling */
				color: #ccc;
			}
			lume-scene {
				position: absolute !important;
				top: 0;
				left: 0;
			}
			#ui,
			#ui lume-element3d {
				pointer-events: none;
			}
			#ui label {
				pointer-events: auto;
			}
			lume-element3d {
				padding: 15px;
			}
		</style>

		<!-- FIXME: Move this script tag below the UI, and initial values stop working, so the UI is squished. -->
		<script>
			// defines the default names for the HTML elements
			LUME.defineElements()
		</script>

		<lume-scene id="scene" webgl perspective="800" touch-action="none">
			<!-- This node visualizes the size of the default viewing area. -->
			<lume-element3d
				size-mode="proportional proportional"
				size="1 1"
				style="border: 5px solid royalblue;"
			></lume-element3d>

			<!-- <lume-perspective-camera id="cam" position="0 0 1000" align-point="0.5 0.5"></lume-perspective-camera> -->
			<lume-camera-rig
				id="cam"
				initial-distance="400"
				min-distance="50"
				max-distance="1000"
				align-point="0.5 0.5"
			></lume-camera-rig>

			<lume-ambient-light intensity="0.3"></lume-ambient-light>
			<lume-point-light id="light" color="white" cast-shadow="true" intensity="0.8" position="0 0 300">
				<lume-mesh
					has="sphere-geometry basic-material"
					cast-shadow="false"
					size="10 10 10"
					mount-point="0.5 0.5"
					color="#eee"
				></lume-mesh>
			</lume-point-light>

			<lume-box
				id="model"
				rotation="40 40 0"
				align-point="0.5 0.5 0.5"
				mount-point="0.5 0.5 0.5"
				size="100 100 100"
				color="white"
				texture="${host}textures/cement.jpg"
			></lume-box>
		</lume-scene>

		<lume-scene id="ui">
			<lume-element3d size-mode="proportional literal" size="1 80">
				<label>
					Camera rig active:
					<input id="active" type="checkbox" checked onchange="cam.active = !cam.active" />
				</label>
			</lume-element3d>
		</lume-scene>

		<script>
			document.addEventListener('pointermove', event => {
				event.preventDefault()
				light.position.x = event.clientX
				light.position.y = event.clientY
			})

			const rotate = t => 180 * Math.sin(0.0005 * t)

			model.rotation = (x, y, z, t) => [rotate(t / 1.4), rotate(t / 2.1), rotate(t / 2.5)]
		</script>
	</body>
`)

const cameraRigVerticalRotationExample = stripIndent(html`
	<script src="${host}global.js"></script>
	<script>
		LUME.defineElements()
	</script>

	<lume-scene webgl style="background: #444">
		<lume-box size="100 100 100" color="pink">
			<lume-camera-rig
				align-point="0.5 0.5 0.5"
				initial-polar-angle="20"
				min-polar-angle="-45"
				max-polar-angle="45"
				initial-distance="500"
			>
				<lume-point-light slot="camera-child" color="white" intensity="0.9" position="120 120 120"></lume-point-light>
			</lume-camera-rig>
		</lume-box>
	</lume-scene>
`)

const clipPlaneExample = stripIndent(html`
	<title>&lt;lume-clip-plane&gt;</title>

	<style>
		html,
		body {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			background: #333;
			touch-action: none;
		}
		#ui {
			position: absolute !important;
			top: 0;
			left: 0;
			color: white;
		}
		#ui,
		#ui lume-element3d {
			pointer-events: none;
		}
		#ui label {
			pointer-events: auto;
		}
		lume-element3d {
			padding: 15px;
		}
	</style>

	<script src="${host}global.js"></script>

	<script>
		LUME.defineElements()
	</script>

	<lume-scene id="scene" perspective="800" webgl shadowmap-type="pcfsoft">
		<lume-ambient-light color="white" intensity="0.4"></lume-ambient-light>

		<lume-camera-rig active initial-polar-angle="30" initial-distance="400" max-distance="7000" min-distance="100">
			<lume-point-light
				position="200 -200 200"
				intensity="0.6"
				color="white"
				shadow-bias="-0.001"
				shadow-map-width="2048"
				shadow-map-height="2048"
				slot="camera-child"
			></lume-point-light>
		</lume-camera-rig>

		<lume-box
			id="box"
			has="clip-planes"
			clip-planes="#clipPlane"
			flip-clip="false"
			clip-disabled="false"
			sidedness="double"
			cast-shadow="true"
			receive-shadow="true"
			opacity="1"
			color="skyblue"
			dithering
			mount-point="0.5 0.5 0.5"
			rotation="0 45 0"
			size="100 100 100"
			scale="1 1 1"
		>
			<lume-sphere size="20 20 20" color="pink" mount-point="0.5 0.5 0.5" align-point="0.5 0.5 0.5"></lume-sphere>

			<lume-clip-plane id="clipPlane" size="175 175" mount-point="0.5 0.5 0.5" align-point="0.5 0.5 0.5">
				<lume-plane
					id="plane"
					opacity="0.5"
					visible="false"
					sidedness="double"
					color="orange"
					size="1 1"
					size-mode="proportional proportional"
					cast-shadow="false"
					receive-shadow="false"
				></lume-plane>
			</lume-clip-plane>
		</lume-box>

		<lume-plane size="800 800" color="pink" rotation="90" position="0 150" mount-point="0.5 0.5"></lume-plane>
	</lume-scene>

	<lume-scene id="ui">
		<lume-element3d size-mode="proportional literal" size="1 80">
			<label>
				Clipping enabled:
				<input type="checkbox" checked onchange="box.clipDisabled = !box.clipDisabled" />
			</label>
			<br />
			<label>
				Flip clip:
				<input
					type="checkbox"
					onchange="box.behaviors.get('clip-planes').flipClip = !box.behaviors.get('clip-planes').flipClip"
				/>
			</label>
			<br />
			<label>
				Clip shadows:
				<input
					type="checkbox"
					checked
					onchange="box.behaviors.get('clip-planes').clipShadows = !box.behaviors.get('clip-planes').clipShadows"
				/>
			</label>
			<br />
			<label>
				Visualize plane:
				<input type="checkbox" onchange="plane.visible = !plane.visible" />
			</label>
		</lume-element3d>
	</lume-scene>

	<script>
		// LUME.defineElements()

		// Other ways to set the clip planes:
		// box.setAttribute('clip-planes', '#clipPlane')
		// box.clipPlanes = [clipPlane]

		clipPlane.rotation = (x, y, z, t) => [x, (y += 0.1), z]
	</script>
`)

const pictureFrameExample = stripIndent(html`
	<style>
		html,
		body {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			background: #333;
			touch-action: none;
		}
	</style>

	<script>
		// Make sure a global LUME object is in place before importing global.js as an ES module.
		// TODO this shouldn't be necessary.
		var LUME = {}

		import('${host}js/PictureFrameScene.js')
	</script>

	<picture-frame-scene
		picture="${host}images/monalisa-2.jpg"
		frame-texture="${host}images/wood.jpg"
		frame-shape="m16.1 345c217.1-.3 328.7-.3 335 0 6.3-.3 10-6.3 11-18 3.6-50.8 5.3-78.8 5-84 .3-5.2 1.9-7.9 5-8 27.3.8 42.6 1.2 46 1 3.2.2 5.5-2.5 7.1-8v-23l-27-1c-23.2-22.7-28.2-15.4-28-22-.1-4.9-1.1-9.3-3-13h-31c.1 6.1-1.6 10.4-5 13-5.2 2.7-27.8 3.6-53 0-28.2-5-54.6-21.7-60-24-37.7-18.6-78.3-65.9-106-137-1.2-2.8-3.9-5.1-8-7-3.3-.2-4.9-.9-5-2 .1-.9-.4-8.5-1-9-.7-1.3-2.3-2.3-5-3h-56c.2 10 .2 14.7 0 14 .2-1.1-5.4-1.1-17 0 .2 9 .2 16 0 21-.8 10.4-.4 33.3 2 37 20.5 30.1 24.2 84.5 15 132-4.2 20.1-15.9 48.4-35 85-2.6 20.8-3 34.8-1.1 42 1.6 7.5 6.6 12.2 15 14z"
	></picture-frame-scene>
`)
