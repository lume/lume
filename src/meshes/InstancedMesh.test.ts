import {createEffect} from 'solid-js'
import type {Scene} from '../core/Scene.js'
import {html} from '../index.js'
import type {InstancedMesh} from './InstancedMesh.js'

describe('InstancedMesh', () => {
	let style: HTMLStyleElement

	beforeAll(() => {
		style = html`
			<style>
				html,
				body {
					height: 100%;
					margin: 0;
					background: black;
				}
			</style>
		` as HTMLStyleElement

		document.body.append(style)
	})

	afterAll(() => {
		style.remove()
	})

	const instanceCount = 500

	const rotations = Array.from({length: instanceCount * 3}).map(() => Math.random())
	const positions = Array.from({length: instanceCount * 3}).map(() => 2000 * Math.random())
	const scales = Array.from({length: instanceCount * 3}).map(() => Math.random())
	// const colorPhases = Array.from({length: instanceCount * 3}).map(() => 2 * Math.random())
	const colors = Array.from({length: instanceCount * 3}).map(() => Math.random())

	let mesh: InstancedMesh = null!
	let scene: Scene = null!

	beforeEach(() => {
		makeScene()
	})

	afterEach(() => {
		scene.remove()
	})

	function makeScene() {
		scene = html`
			<lume-scene id="scene" perspective="800" webgl>
				<lume-point-light position="2500 -2500 2500" intensity="0.6" color="white"></lume-point-light>
				<lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>

				<lume-camera-rig
					active
					initial-distance="2000"
					max-distance="3000"
					min-distance="100"
					position="1000 1000 1000"
				></lume-camera-rig>

				<lume-instanced-mesh
					ref=${(el: InstancedMesh) => (mesh = el)}
					color="white"
					count=${instanceCount}
					rotations=${rotations}
					positions=${positions}
					scales=${scales}
					colors=${colors}
					size="30 30 30"
				></lume-instanced-mesh>
			</lume-scene>
		` as Scene

		document.body.append(scene)
	}

	it('allows setting instanced components directly', async () => {
		expect(mesh.three.count).toBe(instanceCount)
		expect(mesh.colors.length).toBe(instanceCount * 3)
		// Updated in the next animation frame after setting the colors
		expect(mesh.three.instanceColor?.array.length).toBe(undefined)

		await verify(colors)

		await new Promise(r => requestAnimationFrame(r))

		const colors2: number[] = Array.from<number>({length: colors.length}).fill(0.5)
		mesh.colors = colors2

		await verify(colors2)

		let runs = 0

		createEffect(() => {
			runs++
			mesh.count
		})

		expect(runs).toBe(1)

		mesh.count = 0 // effect runs again
		mesh.count = instanceCount // effect runs again

		expect(runs).toBe(3)

		await verify(colors2)

		async function verify(colors: number[]) {
			await new Promise(r => requestAnimationFrame(r))

			expect(mesh.three.count).toBe(instanceCount)
			expect(mesh.colors.length).toBe(instanceCount * 3)
			expect(mesh.three.instanceColor?.array.length).toBe(instanceCount * 3)

			expect(mesh.three.instanceColor?.array).toEqual(Float32Array.from(colors))
		}
	})

	describe('individual instance setters', () => {
		it('does not ruin reactivity', async () => {
			let runs = 0
			let runs2 = 0

			createEffect(() => {
				runs++

				// These were previously causing an infinite reactivity loop.
				mesh.setInstancePosition(0, 0, 0.5, 1)
				mesh.setInstanceRotation(0, 0, 0.5, 1)
				mesh.setInstanceScale(0, 0, 0.5, 1)
				mesh.setInstanceColor(0, 0, 0.5, 1)
			})

			createEffect(() => {
				runs2++
				mesh.positions
				mesh.rotations
				mesh.scales
				mesh.colors
			})

			expect(runs).toBe(1)
			expect(runs2).toBe(1)

			mesh.setInstanceRotation(10, 0, 0.5, 1)
			mesh.setInstancePosition(10, 0, 0.5, 1)
			mesh.setInstanceScale(10, 0, 0.5, 1)
			mesh.setInstanceColor(10, 0, 0.5, 1)

			await new Promise<void>(r => queueMicrotask(r))
			expect(runs).toBe(1)
			expect(runs2).toBe(5)

			mesh.setInstanceRotation(15, 0, 0.5, 1)
			mesh.setInstancePosition(15, 0, 0.5, 1)
			mesh.setInstanceScale(15, 0, 0.5, 1)
			mesh.setInstanceColor(15, 0, 0.5, 1)

			await new Promise<void>(r => queueMicrotask(r))
			expect(runs).toBe(1)
			expect(runs2).toBe(9)
		})
	})
})
