// @ts-check
import 'lume'
import {render} from 'preact'
import {useEffect, useState} from 'preact/hooks'
import './style.css'
import {XYZNumberValues} from 'lume'
/** @import {GltfModel} from 'lume' */
/** @import {} from "./types.d.ts" */

const modelUrl = 'https://docs.lume.io/examples/disco-helmet/DamagedHelmet.glb'
// Image from https://blog.kuula.co/360-images-ruben-frosali
const envUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/luna-station.jpg'

function Container(props) {
	return <div style="width: 100%; height: 100%;">{props.children}</div>
}

const App = () => {
	const [rotation, setRotation] = useState(0)

	useEffect(() => {
		requestAnimationFrame(function loop() {
			setRotation(rotation => rotation + 0.4)
			requestAnimationFrame(loop)
		})
	}, [])

	return (
		<Container>
			<h1 onClick={() => setRotation(45)}>Here's a Lume scene:</h1>
			<div style="width: 600px; height: 400px; background: #ddd">
				<lume-scene
					id="scene"
					webgl
					perspective="800"
					class="hidden"
					environment={envUrl}
					background={envUrl}
					equirectangularBackground
				>
					<lume-camera-rig id="cam" distance="300" minDistance="50" maxDistance="1000"></lume-camera-rig>

					<lume-gltf-model
						src={modelUrl}
						rotation={new XYZNumberValues([0, rotation, 0])}
						size="2 2 2"
						scale="50 50 50"
						id="box"
						onLoad={event => console.log('model loaded', /**@type {GltfModel}*/ (event.target).three)}
					></lume-gltf-model>
				</lume-scene>
			</div>
		</Container>
	)
}

render(<App />, document.getElementById('app'))
