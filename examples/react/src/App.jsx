import 'lume'

import * as React from 'react'
import {Component, createRef} from 'react'

const bodyModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/body.dae'
const pmcModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/pmc.dae'
const pmcSkinModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/pmc_skin_.dae'
const pmcBumperModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/pmc_bumper.dae'

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

	astrobee = createRef()
	rig = createRef()
	cam = createRef()

	render = () => (
		<>
			<lume-scene webgl environment={lunaStation} physically-correct-lights>
				<lume-camera-rig
					ref={this.rig}
					active={this.state.view === 'free'}
					vertical-angle="30"
					min-distance="0.4"
					max-distance="2"
					dolly-speed="0.002"
					distance="1"
				/>
				<lume-element3d rotation={[this.state.view === 'top' ? -90 : 0, 0, 0].toString()}>
					<lume-perspective-camera ref={this.cam} active={this.state.view !== 'free'} position="0 0 0.7" />
				</lume-element3d>

				<lume-point-light intensity="20" color="#a3ffff" position="0 9 0" />
				<lume-point-light intensity="20" color="#a3ffff" position="0 -9 0" />
				<lume-point-light intensity="20" color="#a3ffff" position="0 0 9" />
				<lume-point-light intensity="20" color="#a3ffff" position="0 0 -9" />
				<lume-point-light intensity="20" color="#a3ffff" position="9 8 0" />
				<lume-point-light intensity="20" color="#a3ffff" position="9 -8 0" />
				<lume-point-light intensity="20" color="#a3ffff" position="-9 8 0" />
				<lume-point-light intensity="20" color="#a3ffff" position="-9 -8 0" />

				<lume-element3d ref={this.astrobee}>
					<lume-collada-model src={bodyModelUrl} onload={this.#onModelLoaded} />
					<lume-collada-model src={pmcModelUrl} />
					<lume-collada-model src={pmcSkinModelUrl} />
					<lume-collada-model src={pmcBumperModelUrl} />

					{/* The other side. */}
					<lume-element3d scale="1 1 -1">
						<lume-collada-model src={pmcModelUrl} />
						<lume-collada-model src={pmcSkinModelUrl} />
						<lume-collada-model src={pmcBumperModelUrl} />
					</lume-element3d>
				</lume-element3d>

				<lume-sphere
					has="basic-material"
					texture={lunaStation}
					color="white"
					mount-point="0.5 0.5 0.5"
					size="100 100 100"
					sidedness="double"
					cast-shadow="false"
					receive-shadow="false"
				/>
			</lume-scene>

			<div style={styles.ui}>
				<fieldset style={styles.fieldset}>
					<legend style={styles.legend}>Rotation</legend>
					<label>
						<input type="checkbox" checked={this.state.rotationEnabled} onChange={this.toggleRotation} /> Enable
						rotation.
					</label>
					<br />
					<label>
						<input type="checkbox" checked={this.state.rotationDirection < 0} onChange={this.toggleRotationDirection} />{' '}
						Clockwise rotation.
					</label>
				</fieldset>
				<fieldset style={styles.fieldset2}>
					<legend style={styles.legend2}>View</legend>
					<label>
						<input type="radio" name="side" checked={this.state.view === 'side'} onChange={this.changeView} /> Side
						view.
					</label>
					<br />
					<label>
						<input type="radio" name="top" checked={this.state.view === 'top'} onChange={this.changeView} /> Top view
					</label>
					<br />
					<label>
						<input type="radio" name="free" checked={this.state.view === 'free'} onChange={this.changeView} /> Free view
					</label>
				</fieldset>
			</div>
		</>
	)

	#onModelLoaded = event => {
		const el = event.target
		el.three.traverse(n => {
			// Disable the model's own lights, they are in the wrong
			// position, and too bright.
			if (n.type.includes('Light')) n.intensity = 0
		})
		el.needsUpdate()
	}

	componentDidMount() {
		this.astrobee.current.rotation = this.astrobeeRotation

		// defer so that the rig's shadowRoot is ready when this code runs
		queueMicrotask(() => {
			const rigCam = this.rig.current.shadowRoot.querySelector('lume-perspective-camera')
			rigCam.near = this.cam.current.near = 0.1
			rigCam.far = this.cam.current.far = 110
		})
	}

	astrobeeRotation = (x, y, z, _time) => [x, y + this.state.rotationAmount * this.state.rotationDirection, z]

	toggleRotation = () => {
		const rotationEnabled = !this.state.rotationEnabled
		this.setState({rotationEnabled})

		if (rotationEnabled) this.astrobee.current.rotation = this.astrobeeRotation
		else this.astrobee.current.rotation = () => false // stops rotation
	}

	toggleRotationDirection = () => {
		this.setState({rotationDirection: (this.state.rotationDirection *= -1)})
	}

	changeView = event => {
		const input = event.target

		if (input.checked) this.setState({view: input.name})
	}
}

const styles = {
	ui: {
		position: 'absolute',
		margin: 15,
		padding: 10,
		top: 0,
		left: 0,
		color: 'white',
		fontFamily: 'sans-serif',
		background: 'rgba(0, 0, 0, 0.6)',
		borderRadius: 7,
	},
	legend: {
		color: '#75c7c7',
	},
	fieldset: {
		borderColor: '#75c7c7',
		borderRadius: 4,
	},
	legend2: {
		color: '#c595c9',
	},
	fieldset2: {
		borderColor: '#c595c9',
		borderRadius: 4,
	},
}
