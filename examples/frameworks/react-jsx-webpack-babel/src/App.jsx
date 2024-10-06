import 'lume'
import * as React from 'react'
import {Component} from 'react'

const modelUrl = 'https://docs.lume.io/examples/disco-helmet/DamagedHelmet.glb'
// Image from https://blog.kuula.co/360-images-ruben-frosali
const lunaStation = 'https://docs.lume.io/examples/nasa-astrobee-robot/luna-station.jpg'

// Long live class components!
export class App extends Component {
	state = {
		rotationDirection: 1, // clockwise
		rotationAmount: 0.2,
		rotationEnabled: true,
		view: 'free',
	}

	render = () => (
		<>
			<lume-scene
				id="scene"
				webgl
				perspective="800"
				class="hidden"
				environment={lunaStation}
				background={lunaStation}
				equirectangular-background
			>
				<lume-camera-rig id="cam" distance="301" min-distance="50" max-distance="1000"></lume-camera-rig>

				<lume-ambient-light intensity="0.3"></lume-ambient-light>

				<lume-gltf-model
					src={modelUrl}
					rotation="0 0 0"
					mount-point="0.5 0.5 0.5"
					size="2 2 2"
					scale="50 50 50"
					id="box"
				></lume-gltf-model>
			</lume-scene>
		</>
	)
}

const styles = {}
