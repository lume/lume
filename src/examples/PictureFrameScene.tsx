// import {defineElements} from '../index.js'
// import {Index, mergeProps} from 'solid-js'
// // import aoMap from './assets/ConcretePanels/AO_2K.jpg';

// defineElements()

// const host = location.origin + '/'

// export function PictureFrameScene(_props: {
// 	picture: string
// 	frameTexture?: string
// 	frameShape: string
// 	frameWidth?: number
// 	frameHeight?: number
// 	frameColor?: string
// 	wallTexture: string
// 	wallNormalMap?: string
// 	wallNormalScale?: number
// 	wallRoughnessMap?: string
// 	wallMetalnessMap?: string
// 	wallDisplacementMap?: string
// 	wallDisplacementScale?: number
// 	wallDisplacementBias?: number
// 	wallReflectivity?: number
// 	debug?: boolean
// }) {
// 	const props = mergeProps(
// 		{
// 			frameWidth: 160,
// 			frameHeight: 200,
// 			frameColor: 'skyblue',
// 			wallNormalScale: 1,
// 			wallReflectivity: 0.5,
// 			wallDisplacementScale: 1,
// 			wallDisplacementBias: 0,
// 			debug: false,
// 		},
// 		_props,
// 	)

// 	const frameCrossSection = 15

// 	return (
// 		<div class="picture-frame-scene">
// 			<lume-scene
// 				perspective="800"
// 				webgl
// 				shadowmap-type="pcfsoft"
// 				// environment={host + 'examples/nasa-astrobee-robot/luna-station.jpg'}
// 				// physically-correct-lights
// 			>
// 				<lume-ambient-light color="white" intensity="0.4"></lume-ambient-light>

// 				<lume-plane
// 					class="debug"
// 					visible={props.debug}
// 					has="basic-material"
// 					wireframe
// 					size-mode="proportional proportional"
// 					size="1 1"
// 					color="limegreen"
// 					style="border: 5px solid limegreen;"
// 				></lume-plane>

// 				<lume-cube-layout size="1000 1000 1000" position="0 0 0" mount-point="0.5 0.5" align-point="0.5 0.5">
// 					{/* the light is not assigned to a slot, so it goes to the default slot like a regular child of the cube layout. */}
// 					<lume-point-light
// 						intensity="0.5"
// 						color="white"
// 						shadow-bias="0"
// 						shadow-map-width="1024"
// 						shadow-map-height="1024"
// 						align-point="0.5 0.2 0.5"
// 					></lume-point-light>

// 					{/* Walls --------------------------------------------------------- */}
// 					<Index each={['front', 'back', 'left', 'right', 'top', 'bottom']}>
// 						{side => (
// 							<lume-plane
// 								slot={side()}
// 								size-mode="proportional proportional"
// 								size="1 1"
// 								rotation="0 180 0"
// 								align-point="0.5 0.5"
// 								mount-point="0.5 0.5"
// 								color="white"
// 								texture={props.wallTexture}
// 								width-segments={props.wallDisplacementMap ? 1000 : 1}
// 								height-segments={props.wallDisplacementMap ? 1000 : 1}
// 								// ------
// 								has="physical-material"
// 								// ao-map={aoMap}
// 								metalness-map={props.wallMetalnessMap}
// 								roughness-map={props.wallRoughnessMap}
// 								normal-map={props.wallNormalMap}
// 								normal-scale={props.wallNormalScale}
// 								displacement-map={props.wallDisplacementMap}
// 								displacement-scale={props.wallDisplacementScale}
// 								displacement-bias={props.wallDisplacementBias}
// 								reflectivity={props.wallReflectivity}
// 								roughness={1}
// 								// clearcoat={0.05}
// 							></lume-plane>
// 						)}
// 					</Index>
// 				</lume-cube-layout>

// 				{/* picture frame container -------------------------------- */}
// 				<lume-element3d
// 					size={[props.frameWidth, props.frameHeight, frameCrossSection]}
// 					mount-point="0.5 0.5"
// 					align-point="0.5 0.5"
// 				>
// 					<lume-camera-rig
// 						active="false"
// 						initial-polar-angle="30"
// 						min-polar-angle={props.debug ? -90 : -20}
// 						max-polar-angle={props.debug ? 90 : 20}
// 						min-horizontal-angle={props.debug ? -Infinity : -35}
// 						max-horizontal-angle={props.debug ? Infinity : 35}
// 						initial-distance="500"
// 						max-distance={props.debug ? Infinity : 900}
// 						min-distance={props.debug ? 0 : 200}
// 						align-point="0.5 0.5"
// 					>
// 						<lume-perspective-camera
// 							active
// 							slot="camera-child"
// 							near="80"
// 							xfar="1700"
// 							far="10000"
// 						></lume-perspective-camera>
// 					</lume-camera-rig>

// 					{/* <lume-perspective-camera active slot="camera-child" far="100000"></lume-perspective-camera> */}

// 					{/* picture -------------------------------- */}
// 					<lume-plane
// 						id="box"
// 						shininess="100"
// 						color="white"
// 						texture={props.picture}
// 						size-mode="proportional proportional"
// 						size="1 1 1"
// 						note="align point needs to be determined. Will it be a percentage or absolute value from the back of the frame? Or?"
// 						align-point="0 0 0.4"
// 					></lume-plane>

// 					{/* frame edges -------------------------- */}
// 					<lume-element3d size-mode="proportional proportional" size="1 1">
// 						<Index
// 							each={[
// 								// left
// 								{
// 									alignPoint: '0 0.5',
// 									clipPlanes: '#clipPlane1, #clipPlane3',
// 									rotation: '-90 0 0',
// 									mountPoint: '1 0.5 0.5',
// 									flipClip: false,
// 									framePieceLength: props.frameHeight + frameCrossSection * 2,
// 								},
// 								// right
// 								{
// 									alignPoint: '1 0.5',
// 									clipPlanes: '#clipPlane2, #clipPlane4',
// 									rotation: '-90 180 0',
// 									mountPoint: '0 0.5 0.5',
// 									flipClip: false,
// 									framePieceLength: props.frameHeight + frameCrossSection * 2,
// 								},
// 								// top
// 								{
// 									alignPoint: '0.5 0',
// 									clipPlanes: '#clipPlane1, #clipPlane2',
// 									rotation: '-90 -90 0',
// 									mountPoint: '0.5 1 0.5',
// 									flipClip: true,
// 									framePieceLength: props.frameWidth + frameCrossSection * 2,
// 								},
// 								// bottom
// 								{
// 									alignPoint: '0.5 1',
// 									clipPlanes: '#clipPlane3, #clipPlane4',
// 									rotation: '-90 90 0',
// 									mountPoint: '0.5 0 0.5',
// 									flipClip: true,
// 									framePieceLength: props.frameWidth + frameCrossSection * 2,
// 								},
// 							]}
// 						>
// 							{(frame, i) => (
// 								<lume-element3d size={[0, 0, frameCrossSection]} align-point={frame().alignPoint}>
// 									<lume-shape
// 										id={'shape' + i}
// 										has="clip-planes projected-material"
// 										projected-textures={'#tex' + i}
// 										clip-planes={frame().clipPlanes}
// 										rotation={frame().rotation}
// 										mount-point={frame().mountPoint}
// 										// ----
// 										color={props.frameColor}
// 										xmetalness="0.8"
// 										roughness="0.3"
// 										clearcoat="1"
// 										shape={props.frameShape}
// 										curve-segments="60"
// 										size={[frameCrossSection, frameCrossSection, frame().framePieceLength]}
// 										align-point="0 0 0.5"
// 										receive-shadow="false"
// 										fitment="contain"
// 										flip-clip={frame().flipClip}
// 									>
// 										{/* <Show when={props.frameTexture}> */}
// 										<lume-texture-projector
// 											id={'tex' + i}
// 											size={[frameCrossSection, frame().framePieceLength]}
// 											src={props.frameTexture}
// 											position="0 -100 0"
// 											mount-point="0.5 0.5"
// 											align-point="0.5 0 0.5"
// 											receive-shadow="false"
// 											rotation="90 0 0"
// 										>
// 											<lume-plane
// 												visible={props.debug}
// 												has="basic-material"
// 												wireframe
// 												size="1 1"
// 												size-mode="proportional proportional"
// 											>
// 												<lume-box
// 													has="basic-material"
// 													color="limegreen"
// 													size="1 1 400"
// 													align-point="0.5, 0.5"
// 													mount-point="0.5, 0.5, 1"
// 												></lume-box>
// 											</lume-plane>
// 										</lume-texture-projector>
// 										{/* </Show> */}
// 									</lume-shape>
// 								</lume-element3d>
// 							)}
// 						</Index>
// 					</lume-element3d>

// 					{/* corner clips -------------------------- */}
// 					<lume-element3d size-mode="proportional proportional" size="1 1">
// 						<Index
// 							each={[
// 								// TODO LUME bug discovered: if all align point values are zero,
// 								// updates of parent size do not trigger update for child.
// 								// Workaround: 0.00000001 is close enough to zero but not zero.
// 								// {alignPoint: '0 0', rotation: '90 45 0'},
// 								{alignPoint: '0.0000001 0', rotation: '90 45 0'},

// 								{alignPoint: '1 0', rotation: '90 -45 0'},
// 								{alignPoint: '0 1 0.5', rotation: '90 -225 0'},
// 								{alignPoint: '1 1 0.5', rotation: '90 225 0'},
// 							]}
// 						>
// 							{(n, i) => (
// 								<lume-clip-plane
// 									id={'clipPlane' + (i + 1)}
// 									size="250 250"
// 									mount-point="0.5 0.5 0.5"
// 									align-point={n().alignPoint}
// 									rotation={n().rotation}
// 								>
// 									<lume-plane
// 										visible={props.debug}
// 										has="basic-material"
// 										wireframe
// 										size="1 1"
// 										size-mode="proportional proportional"
// 									></lume-plane>
// 								</lume-clip-plane>
// 							)}
// 						</Index>
// 					</lume-element3d>
// 				</lume-element3d>
// 			</lume-scene>

// 			<style jsx>{
// 				/*css*/ `
// 					.picture-frame-scene {
// 						width: 100%;
// 						height: 100%;
// 					}
// 				`
// 			}</style>
// 		</div>
// 	)
// }
