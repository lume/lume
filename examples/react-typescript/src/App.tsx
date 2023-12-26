import {Node, XYZNumberValuesPropertyFunction, defineElements} from 'lume'

// For React TypeScript users, import the React JSX type defs.
import type {} from 'lume/dist/index.react-jsx'

import * as React from 'react'
import {Component, createRef, CSSProperties, ChangeEvent} from 'react'

import bodyModelUrl from '../../../apps/docs/examples/nasa-astrobee-robot/astrobee/body.dae'
import pmcModelUrl from '../../../apps/docs/examples/nasa-astrobee-robot/astrobee/pmc.dae'
import pmcSkinModelUrl from '../../../apps/docs/examples/nasa-astrobee-robot/astrobee/pmc_skin_.dae'
import pmcBumperModelUrl from '../../../apps/docs/examples/nasa-astrobee-robot/astrobee/pmc_bumper.dae'

// Image from https://blog.kuula.co/360-images-ruben-frosali
import lunaStation from '../../../apps/docs/examples/nasa-astrobee-robot/luna-station.jpg'

defineElements()

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

	astrobee = createRef<Node>()

	render = () => (
		<>
			<lume-scene webgl environment={lunaStation}>
				<lume-element3d align-point="0.5 0.5 0.5">
					<lume-camera-rig
						active={this.state.view === 'free'}
						vertical-angle="30"
						min-distance="0.4"
						max-distance="2"
						dolly-speed="0.002"
						distance="1"
					/>
					<lume-element3d rotation={[this.state.view === 'top' ? -90 : 0, 0, 0].toString()}>
						<lume-perspective-camera active={this.state.view !== 'free'} position="0 0 0.7" />
					</lume-element3d>
				</lume-element3d>

				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 90 0" />
				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 -90 0" />
				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 0 90" />
				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 0 -90" />
				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="90 80 0" />
				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="90 -80 0" />
				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="-90 80 0" />
				<lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="-90 -80 0" />

				<lume-element3d ref={this.astrobee} align-point="0.5 0.5 0.5">
					<lume-collada-model src={bodyModelUrl} />
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
					align-point="0.5 0.5 0.5"
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

	componentDidMount() {
		this.astrobee.current!.rotation = this.astrobeeRotation
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
