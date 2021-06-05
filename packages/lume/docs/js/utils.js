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
		LUME.useDefaultNames()

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
			// Define all the LUME elements with their default names.
			LUME.useDefaultNames()

			mesh.rotation = (x, y, z) => [++x, ++y, z]
		</script>
	`)
}
