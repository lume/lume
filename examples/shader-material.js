import * as LUME from 'lume'

const shaderMat = document.querySelector('shader-material')

const outerCubes = true
const outerCubeGlows = true

let animOffset = 0

for (const i of Array(8).keys()) {
	const {html} = LUME

	if (outerCubes) {
		const box = html`
			<lume-sphere
				align-point="0.5 0.5 0.5"
				mount-point="0.5 0.5 0.5"
				position=${[i % 4 < 2 ? 400 : -400, i < 4 ? 400 : -400, (i + 1) % 2 ? -400 : 400]}
				has="physical-material"
				receive-shadow="false"
				size="400 400 400"
				sidedness="double"
				opacity="1"
				color="white"
				clearcoat="1"
				transmission="1"
				metalness="0.0"
				roughness="0.55"
			></lume-sphere>
		`

		centerBox.append(box)
	}

	if (outerCubeGlows) {
		const box2 = html`
			<lume-sphere
				id=${'outer' + i}
				align-point="0.5 0.5 0.5"
				mount-point="0.5 0.5 0.5"
				position=${[i % 4 < 2 ? 400 : -400, i < 4 ? 400 : -400, (i + 1) % 2 ? -400 : 400]}
				receive-shadow="false"
				size="200 200 200"
			>
				<shader-material
					sidedness="double"
					uniforms=${
						// use the attribute string instead of the JS prop so we don't share the same uniforms object
						shaderMat.getAttribute('uniforms')
					}
					vertex-shader=${shaderMat.vertexShader}
					fragment-shader=${shaderMat.fragmentShader}
				></shader-material>
			</lume-sphere>
		`

		centerBox.append(box2)

		animateShader(box2)
	}
}

animateShader(centerBox)

async function animateShader(targetBox) {
	const mat = targetBox.children[0]

	LUME.createEffect(() => {
		if (!mat.meshComponent) return

		mat.uniforms.iResolution.value.x = targetBox.calculatedSize.x
		mat.uniforms.iResolution.value.y = targetBox.calculatedSize.y

		targetBox.needsUpdate()
	})

	const offset = animOffset
	animOffset += 30

	LUME.Motor.addRenderTask(t => {
		if (!mat.meshComponent) return

		mat.uniforms.iTime.value = t * 0.001 + offset
		targetBox.needsUpdate()
	})
}

function tiltOnPointerMove(pointerContext, rotationTarget, rotationAmount = 5) {
	// Add some interaction!
	pointerContext.addEventListener('pointermove', event => {
		// Rotate the image a little bit too.
		rotationTarget.rotation.y = -((event.clientX / pointerContext.offsetWidth) * (rotationAmount * 2) - rotationAmount)
		rotationTarget.rotation.x = (event.clientY / pointerContext.offsetHeight) * (rotationAmount * 2) - rotationAmount
	})
}

tiltOnPointerMove(scene, centerBox)
