import '../global.js'

LUME.defineElements()
const {html, Element, element, attribute} = LUME

const host = location.origin + '/'
// const host = location.origin + '/examples/'

export const PictureFrameScene = element('picture-frame-scene')(
	class PictureFrameScene extends Element {
		static observedAttributes = {
			picture: attribute.string(),
			frameTexture: attribute.string(),
			frameShape: attribute.string(),
			debug: attribute.boolean(),
		}

		picture = ''
		frameTexture = ''
		frameShape = ''

		// hasShadow = false // FIXME lume-scene element doesn't load in this case.
		hasShadow = true

		css = /*css*/ `
			:host, div {width: 100%; height: 100%}
			/*TODO: lume-scene sizing when parent is display:content */
			/*:host {display: contents}*/
		`

		debug = false

		template = () => html`
			<lume-scene
				perspective="800"
				webgl
				shadowmap-type="pcfsoft"
				xenvironment=${host + 'examples/nasa-astrobee-robot/luna-station.jpg'}
				physically-correct-lights
			>
				<lume-ambient-light color="white" intensity="0.4"></lume-ambient-light>

				<lume-plane
					class="debug"
					visible=${() => this.debug}
					has="basic-material"
					wireframe
					size-mode="proportional proportional"
					size="1 1"
					color="limegreen"
					style="border: 5px solid limegreen;"
				></lume-plane>

				<lume-cube-layout size="1000 1000 1000" position="0 0 0" mount-point="0.5 0.5" align-point="0.5 0.5">
					<!-- the light is not assigned to a slot, so it goes to the default slot like a regular child of the cube layout. -->
					<lume-point-light
						decay="0.45"
						xdistance="0"
						xintensity="1"
						power="800"
						color="#999"
						shadow-bias="-0.005"
						shadow-map-width="1024"
						shadow-map-height="1024"
						xalign-point="0.5 0.2 0.82"
						align-point="0.5 0.2 0.5"
					></lume-point-light>

					${/*<!-- Walls --------------------------------------------------------->*/ ''}
					${['front', 'back', 'left', 'right', 'top', 'bottom'].map((side, i) => {
						return html`
							<lume-plane
								slot=${side}
								size-mode="proportional proportional"
								size="1 1"
								rotation="0 180 0"
								align-point="0.5 0.5"
								mount-point="0.5 0.5"
								color="white"
								note="free texture from https://polyhaven.com/a/stone_brick_wall_001"
								texture=${host + 'textures/stone-brick-wall/diff_2k.jpg'}
								------
								has="phong-material"
								shininess="100"
								bump-map=${host + 'textures/stone-brick-wall/disp_2k.png'}
								bump-scale="8"
								------
								xhas="physical-material"
								xshininess="100"
								xao-map=${host + 'textures/WoodFloor_2K/AmbientOcclusion.jpg'}
								xmetalness-map=${host + 'textures/WoodFloor_2K/Metalness.jpg'}
								xroughness-map=${host + 'textures/WoodFloor_2K/Roughness.jpg'}
								xxbump-map=${host + 'textures/WoodFloor_2K/Displacement.jpg'}
								xxbump-scale="8"
							></lume-plane>
						`
					})}
				</lume-cube-layout>

				${/*<!-- picture frame container -------------------------------->*/ ''}
				<lume-element3d size="160 200 15" mount-point="0.5 0.5" align-point="0.5 0.5">
					${/* */ ''}
					<lume-camera-rig
						active="false"
						initial-polar-angle="30"
						min-polar-angle=${() => (this.debug ? -90 : -20)}
						max-polar-angle=${() => (this.debug ? 90 : 20)}
						min-horizontal-angle=${() => (this.debug ? -Infinity : -35)}
						max-horizontal-angle=${() => (this.debug ? Infinity : 35)}
						initial-distance="500"
						max-distance=${() => (this.debug ? Infinity : 900)}
						min-distance=${() => (this.debug ? 0 : 200)}
						align-point="0.5 0.5"
					>
						<lume-perspective-camera
							active
							slot="camera-child"
							near="80"
							xfar="1700"
							far="10000"
						></lume-perspective-camera>
					</lume-camera-rig>
					${/*<lume-perspective-camera active slot="camera-child" far="100000"></lume-perspective-camera>*/ ''}
					${/*<!-- picture -------------------------------->*/ ''}
					<lume-plane
						id="box"
						shininess="100"
						color="white"
						texture=${() => this.picture}
						size-mode="proportional proportional"
						size="1 1 1"
						note="align point needs to be determined. Will it be a percentage or absolute value from the back of the frame? Or?"
						align-point="0 0 0.4"
					></lume-plane>

					${/*<!-- frame edges -------------------------->*/ ''}
					<lume-element3d size-mode="proportional proportional" size="1 1">
						${[
							{
								alignPoint: '0 0.5',
								clipPlanes: '#clipPlane1, #clipPlane3',
								rotation: '-90 0 0',
								mountPoint: '1 0.5 0.5',
								flipClip: false,
							},
							{
								alignPoint: '1 0.5',
								clipPlanes: '#clipPlane2, #clipPlane4',
								rotation: '-90 180 0',
								mountPoint: '0 0.5 0.5',
								flipClip: false,
							},
							{
								alignPoint: '0.5 0',
								clipPlanes: '#clipPlane1, #clipPlane2',
								rotation: '-90 -90 0',
								mountPoint: '0.5 1 0.5',
								flipClip: true,
							},
							{
								alignPoint: '0.5 1',
								clipPlanes: '#clipPlane3, #clipPlane4',
								rotation: '-90 90 0',
								mountPoint: '0.5 0 0.5',
								flipClip: true,
							},
						].map((frame, i) => {
							return html`<lume-element3d size="0 0 15" align-point=${frame.alignPoint}>
								<lume-shape
									id=${'shape' + i}
									has="clip-planes projected-material"
									projected-textures=${'#tex' + i}
									clip-planes=${frame.clipPlanes}
									rotation=${frame.rotation}
									mount-point=${frame.mountPoint}
									----
									color="#ddd"
									xmetalness="0.8"
									roughness="0.3"
									clearcoat="1"
									shape=${this.frameShape}
									curve-segments="60"
									size="15 15 240"
									align-point="0 0 0.5"
									receive-shadow="false"
									fitment="contain"
									flip-clip=${frame.flipClip}
								></lume-shape>
								<lume-texture-projector
									id=${'tex' + i}
									size="15 240"
									src=${this.frameTexture}
									position="0 0 100"
									mount-point="0.5 0.5"
									rotation=${i >= 2 ? '0 0 90' : '0 0 0'}
								>
									<lume-plane
										visible=${() => this.debug}
										has="basic-material"
										wireframe
										size="1 1"
										size-mode="proportional proportional"
									></lume-plane>
								</lume-texture-projector>
							</lume-element3d>`
						})}
					</lume-element3d>

					${/*<!-- corner clips -------------------------->*/ ''}
					<lume-element3d size-mode="proportional proportional" size="1 1">
						${[
							{alignPoint: '0 0', rotation: '90 45 0'},
							{alignPoint: '1 0', rotation: '90 -45 0'},
							{alignPoint: '0 1 0.5', rotation: '90 -225 0'},
							{alignPoint: '1 1 0.5', rotation: '90 225 0'},
						].map((n, i) => {
							return html`
								<lume-clip-plane
									id=${'clipPlane' + (i + 1)}
									size="250 250"
									mount-point="0.5 0.5 0.5"
									align-point=${n.alignPoint}
									rotation=${n.rotation}
								>
									<lume-plane
										visible=${() => this.debug}
										has="basic-material"
										wireframe
										size="1 1"
										size-mode="proportional proportional"
									></lume-plane>
								</lume-clip-plane>
							`
						})}
					</lume-element3d>
				</lume-element3d>
			</lume-scene>
		`
	},
)
