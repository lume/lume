import 'lume'
import {type ColladaModel, type CameraRig, type Element3D, type PerspectiveCamera} from 'lume'
import type {XYZNumberValuesPropertyFunction} from 'lume/dist/core/PropertyAnimator'
import {Light} from 'three/src/lights/Light'

// For React TypeScript users, import the React JSX type defs.
import type {} from 'lume/dist/index.react-jsx'

import * as React from 'react'
import {Component, createRef, CSSProperties, ChangeEvent} from 'react'

const bodyModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/body.dae'
const pmcModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/pmc.dae'
const pmcSkinModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/pmc_skin_.dae'
const pmcBumperModelUrl = 'https://docs.lume.io/examples/nasa-astrobee-robot/astrobee/pmc_bumper.dae'

// Image from https://blog.kuula.co/360-images-ruben-frosali
const lunaStation = 'https://docs.lume.io/examples/nasa-astrobee-robot/luna-station.jpg'

type View = 'top' | 'side' | 'free'

interface State {
	rotationDirection: -1 | 1
	rotationAmount: number // degrees
	rotationEnabled: boolean
	view: View
}

// Long live class components!
export class App extends Component<{}, State> {
	readonly state = {
		rotationDirection: 1 as -1 | 1, // clockwise
		rotationAmount: 0.2,
		rotationEnabled: true,
		view: 'free' as View,
	}

	astrobee = createRef<Element3D>()
	rig = createRef<CameraRig>()
	cam = createRef<PerspectiveCamera>()

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
				<lume-element3d rotation={String([this.state.view === 'top' ? -90 : 0, 0, 0])}>
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
					<lume-collada-model
						src={bodyModelUrl}
						// @ts-expect-error onload prop type in JSX is not working
						onLoad={this.#onModelLoaded}
						onProgress={() => console.log()}
					/>
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

	#onModelLoaded = (event: Event) => {
		const el = event.target as ColladaModel
		el.three.traverse(n => {
			// Disable the model's own lights, they are in the wrong
			// position, and too bright.
			if (n.type.includes('Light')) (n as Light).intensity = 0
		})
		el.needsUpdate()
	}

	componentDidMount() {
		this.astrobee.current!.rotation = this.astrobeeRotation

		// defer so that the rig's shadowRoot is ready when this code runs
		queueMicrotask(() => {
			const rigCam = this.rig.current!.shadowRoot!.querySelector('lume-perspective-camera')!
			rigCam.near = this.cam.current!.near = 0.1
			rigCam.far = this.cam.current!.far = 110
		})
	}

	private astrobeeRotation: XYZNumberValuesPropertyFunction = (x, y, z, _time) => [
		x,
		y + this.state.rotationAmount * this.state.rotationDirection,
		z,
	]

	private toggleRotation = () => {
		const rotationEnabled = !this.state.rotationEnabled
		this.setState({rotationEnabled})

		if (rotationEnabled) this.astrobee.current!.rotation = this.astrobeeRotation
		else this.astrobee.current!.rotation = () => false // stops rotation
	}

	private toggleRotationDirection = () => {
		this.setState({rotationDirection: (this.state.rotationDirection *= -1) as -1 | 1})
	}

	private changeView = (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.target

		if (input.checked) this.setState({view: input.name as View})
		if (input.checked) this.setState({view: input.name as View})
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
	} as CSSProperties,
	legend: {
		color: '#75c7c7',
	} as CSSProperties,
	fieldset: {
		borderColor: '#75c7c7',
		borderRadius: 4,
	} as CSSProperties,
	legend2: {
		color: '#c595c9',
	} as CSSProperties,
	fieldset2: {
		borderColor: '#c595c9',
		borderRadius: 4,
	} as CSSProperties,
}
