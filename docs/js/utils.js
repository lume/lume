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

const buttonsWithShadowExample = stripIndent(/*html*/ `
	<script src="${location.origin + location.pathname}global.js"></script>
	<script src="${location.origin + location.pathname}node_modules/vue/dist/vue.js"></script>
	<!-- Tween.js is a lib for animating numbers based on "easing curves". -->
	<script src="${location.origin + location.pathname}node_modules/tween.js/src/Tween.js"></script>
	<!-- pep.js provides the pointer events (pointermove, pointerdown, etc) -->
	<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>

	<style>
		body, html {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			overflow: hidden;
			font-family: sans-serif;
			touch-action: none;
		}
		lume-node {
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
			shadowmap-type="pcfsoft" NOTE="one of basic, pcf, pcfsoft"
			touch-action="none"
		>
			<lume-ambient-light color="#ffffff" intensity="0"></lume-ambient-light>
			<lume-mixed-plane ref="plane" id="bg" size-mode="proportional proportional" size="1 1 0" color="#444">
				<lume-node
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
				</lume-node>
				<lume-node id="lightContainer" size="0 0 0" position="0 0 300">
					<lume-point-light
						id="light"
						color="white"
						size="0 0 0"
						cast-shadow="true"
						intensity="0.8"
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
				</lume-node>
			</lume-mixed-plane>
		</lume-scene>
	</template>

	<div id="buttonsRoot"></div>

	<script>
		LUME.defineElements()

		new Vue({
			el: '#buttonsRoot',
			template: document.querySelector('[vue]').innerHTML,
			mounted: function() {
				const {Motor, Events} = LUME
				const scene = document.querySelector('#scene')
				const lightContainer = document.querySelector('#lightContainer')
				const light = document.querySelector('#light')

				scene.on(Events.GL_LOAD, async () => {
					// TODO fix order of events. Promise.resolve() should not be needed here.
					await Promise.resolve()
					light.three.shadow.radius = 2
					light.three.distance = 800
					light.three.shadow.bias = -0.001

					// The following is a temporary hack because opacity isn't
					// exposed through the HTML API yet. work-in-progress...
					// TODO this stuff should be doable via the HTML
					Array.from( document.querySelectorAll('lume-mixed-plane') ).forEach(function(n) {
						n.three.material.opacity = 0.3
					})

					document.querySelector('#bg').three.material.opacity = 0.3
					document.querySelector('#bg').three.material.dithering = true

					scene.needsUpdate()
				})

				const targetPosition = {x: window.innerWidth / 2, y: window.innerHeight / 2}

				document.addEventListener('pointermove', function(e) {
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
				document.addEventListener('pointerdown', function(e) {
					if ( is( e.target, 'button' ) ) {
						pressedButton = e.target

						if (upTween) {
							upTween.stop()
							upTween = null
						}

						downTween = new TWEEN.Tween(e.target.parentNode.position)
							.to({z: -20}, 75)
							.start()
							.onComplete(function () { downTween = null })

						Motor.addRenderTask(function(time) {
							if (!downTween) return false
							downTween.update(time)
						})
					}
				})

				// On mouse up animate the button upward
				document.addEventListener('pointerup', function(e) {
					if ( pressedButton ) {
						if (downTween) {
							downTween.stop()
							downTween = null
						}

						upTween = new TWEEN.Tween(pressedButton.parentNode.position)
							.to({z: 0}, 75)
							.start()
							.onComplete(function() { upTween = null })

						Motor.addRenderTask(function(time) {
							if (!upTween) return false
							upTween.update(time)
						})
					}
				})

				function is( el, selector ) {
					if ( [].includes.call(
						document.querySelectorAll( selector ),
						el
					) ) return true
					return false
				}
			},
		})
	</script>
`)

function meshExample({geometry = 'box', material = 'phong', color = ''} = {}) {
	return stripIndent(/*html*/ `
		<script src="${location.origin + location.pathname}global.js"></script>
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
	return stripIndent(/*html*/ `
		<script src="${location.origin + location.pathname}global.js"></script>

		<lume-scene id="scene">
			<lume-node id="container" size="78 78" align-point="0.5 0.5" mount-point="0.5 0.5">
				<lume-node
					class="sun"
					size-mode="proportional proportional"
					size="0.8 0.8"
					position="0 0 10"
					align-point="0.5 0.5"
					mount-point="0.5 0.5"
				>
					<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
				</lume-node>
				<lume-node class="rotator A" size="60 60" align-point="1 1">
					<lume-node
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-node>
					<lume-node class="rotator" size="45 45" align-point="1 1">
						<lume-node
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-node>
						<lume-node class="rotator" size="28 28" align-point="1 1">
							<lume-node
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-node>
						</lume-node>
					</lume-node>
				</lume-node>
				<lume-node class="rotator A" size="60 60" mount-point="1 1">
					<lume-node
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-node>
					<lume-node class="rotator" size="45 45" mount-point="1 1">
						<lume-node
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-node>
						<lume-node class="rotator" size="28 28" mount-point="1 1">
							<lume-node
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-node>
						</lume-node>
					</lume-node>
				</lume-node>
				<lume-node class="rotator B" size="60 60" align-point="0 1" mount-point="1 0">
					<lume-node
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-node>
					<lume-node class="rotator" size="45 45" align-point="0 1" mount-point="1 0">
						<lume-node
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-node>
						<lume-node class="rotator" size="28 28" align-point="0 1" mount-point="1 0">
							<lume-node
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-node>
						</lume-node>
					</lume-node>
				</lume-node>
				<lume-node class="B" size="60 60" align-point="1 0" mount-point="0 1">
					<lume-node
						class="sun"
						size-mode="proportional proportional"
						size="0.8 0.8"
						position="0 0 10"
						align-point="0.5 0.5"
						mount-point="0.5 0.5"
					>
						<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
					</lume-node>
					<lume-node class="rotator" size="45 45" align-point="1 0" mount-point="0 1">
						<lume-node
							class="sun"
							size-mode="proportional proportional"
							size="0.8 0.8"
							position="0 0 10"
							align-point="0.5 0.5"
							mount-point="0.5 0.5"
						>
							<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
						</lume-node>
						<lume-node class="rotator" size="28 28" align-point="1 0" mount-point="0 1">
							<lume-node
								class="sun"
								size-mode="proportional proportional"
								size="0.8 0.8"
								position="0 0 10"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
							>
								<img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
							</lume-node>
						</lume-node>
					</lume-node>
				</lume-node>
			</lume-node>
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
			lume-node {
				border-radius: 100%;
				color: white;
				font-family: sans-serif;
				font-weight: bold;
			}
			lume-node:not(.sun) {
				background: rgba(0, 0, 0, 0.1);
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
	return stripIndent(/*html*/ `
		<script src="${location.origin + location.pathname}global.js"></script>

		<lume-scene id="scene">
			<lume-node size="100 100" align-point="0.5 0.5" mount-point="0.5 0.5" rotation="0 30 0">
				I am centered in the scene, and I am rotated a bit.
			</lume-node>
		</lume-scene>

		<style>
			html,
			body {
				margin: 0;
				padding: 0;
				height: 100%;
				width: 100%;
			}
			lume-node {
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
	return stripIndent(/*html*/ `
		<script src="${location.origin + location.pathname}global.js"></script>

		<lume-scene webgl shadowmap-type="soft">
			<lume-ambient-light color="white" intensity="0.7"></lume-ambient-light>

			<!-- We need a plane onto which shadows will land (the "floor"). -->
			<lume-node align-point="0.5 0.5" mount-point="0.5 0.5" rotation="60 0 0" size="1000 1000">
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
					<lume-box id="box" color="skyblue" size="50 50 50" align-point="0.5 0.5 0.5" mount-point="0.5 0.5 0" rotation="0 0 10"></lume-box>

				</lume-plane>

			</lume-node>
		</lume-scene>

		<style>
			html, body { margin: 0; height: 100%; width: 100%; background: white; }
		</style>

		<script>
			LUME.defineElements()

			box.rotation = (x, y, z) => [x, y, ++z]
		</script>
	`)
}

function directionalLightExample() {
	return stripIndent(/*html*/ `
		<script src="${location.origin + location.pathname}global.js"></script>

		<lume-scene webgl shadowmap-type="soft">
			<lume-ambient-light color="white" intensity="0.7"></lume-ambient-light>

			<!-- We need a plane onto which shadows will land (the "floor"). -->
			<lume-node align-point="0.5 0.5" mount-point="0.5 0.5" rotation="60 0 0" size="1000 1000">
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
					<lume-box id="box" color="skyblue" size="50 50 50" align-point="0.5 0.5 0.5" mount-point="0.5 0.5 0" rotation="0 0 10"></lume-box>

					<!-- Add an interactive camera viewpoint. -->
					<lume-node align-point="0.5 0.5" rotation="-90 0 0">
						<lume-camera-rig initial-polar-angle="30" min-polar-angle="5" initial-distance="500"></lume-camera-rig>
					</lume-node>

				</lume-plane>

			</lume-node>
		</lume-scene>

		<style>
			html, body { margin: 0; height: 100%; width: 100%; background: white; touch-action: none;}
		</style>

		<script>
			LUME.defineElements()

			box.rotation = (x, y, z) => [x, y, ++z]
		</script>
	`)
}

function perspectiveLayeredImage({bg, fg, bgPosition = {}, fgPosition = {}}) {
	return stripIndent(/*html*/ `
		<script src="${location.origin + location.pathname}global.js"></script>

		<lume-scene id="scene" touch-action="none" webgl>
			<lume-point-light
				align-point="0.5 0.5"
				position="0 0 500"
				distance="800"
				shadow-radius="2"
				shadow-bias="-0.001"
			></lume-point-light>

			<lume-node
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
					TODO-material-opacity="0.3"
				>
					<img src="${location.origin + location.pathname}${bg}" />
				</lume-mixed-plane>
				<lume-mixed-plane
					size-mode="proportional proportional"
					size="1 1"
					position="0 0 50"
					color="#444"
					TODO-material-opacity="0.3"
				>
					<img src="${location.origin + location.pathname}${fg}" />
				</lume-mixed-plane>
			</lume-node>
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

			scene.on('GL_LOAD', () => {
				Array.from(document.querySelectorAll('lume-mixed-plane')).forEach(n => {
					n.three.material.opacity = 0.3
				})
			})
		</script>
	`)
}

const shapesExample = stripIndent(/*html*/ `
	<script src="${location.origin + location.pathname}global.js"></script>

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

	<lume-scene id="scene" perspective="800" webgl fog-mode="linear" fog-near="100" fog-far="500" fog-color="white">
		<lume-ambient-light color="white" intensity="0.4"></lume-ambient-light>

		<lume-camera-rig id="cam" active initial-distance="200" max-distance="700" min-distance="100">
			<lume-point-light position="200 0 200" intensity="0.7" color="white" slot="camera-child"></lume-point-light>
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

		<lume-node rotation="0 10 0">
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
		</lume-node>

		<lume-node position="0 0 0">
			<lume-shape
				size="40 25 5"
				color="red"
				position="-20 50 0"
				mount-point="0.5 0.5"
				sidedness="double"
				receive-shadow="false"
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
		</lume-node>
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
					<input type="radio" name="shape" value="hearts" checked onchange="updateShape(event)" />&nbsp;
					Hearts
				</label>
				<br />
				<label>
					<input type="radio" name="shape" value="triangles" onchange="updateShape(event)" />&nbsp; Triangles
				</label>
				<br />
				<label>
					<input type="radio" name="shape" value="trapezoids" onchange="updateShape(event)" />&nbsp;
					Trapezoids
				</label>
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
					shape.shape = new LUME.THREE.Shape([
						new LUME.THREE.Vector2(-12, 0),
						new LUME.THREE.Vector2(12, 0),
						new LUME.THREE.Vector2(0, 12),
						new LUME.THREE.Vector2(-12, 0),
					])
				} else if (input.value === 'trapezoids') {
					// Set the 'shape' attribute with a list of points
					shape.setAttribute('shape', '-5 0, 2 -13,  13 -13,  20 0,  0 0')
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

const instancedMeshExample = stripIndent(/*html*/ `
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

		<lume-node size-mode="proportional proportional" size="1 1" style="border: 5px solid teal"></lume-node>

		<lume-camera-rig active initial-distance="1000" max-distance="2500" min-distance="100" position="500 500 500"></lume-camera-rig>

		<!-- FIXME: this works: -->
		<!-- <lume-mesh has="sphere-geometry" size="30 30 30"></lume-mesh> -->
		<!-- this doesn't: -->
		<!-- <lume-mesh has="sphere-geometry phong-material" size="30 30 30"></lume-mesh> -->
	</lume-scene>

	<script src="${location.origin + location.pathname}global.js"></script>
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
