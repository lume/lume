import {element} from '@lume/element'
import {Model} from './Model.js'
import {LoadEvent} from './LoadEvent.js'
import './GltfModel.js'
import type {GltfModel} from './GltfModel.js'
import '../core/Scene.js'
import html from 'solid-js/html'
import {ErrorEvent} from './ErrorEvent.js'

let rand = Math.random()
@element('test-el-' + rand)
class TestModel extends Model {
	foo = 123
}

describe('Model', () => {
	it('dispatches a load event', () => {
		const el = new TestModel()

		// Type check (ensure these types are still present)
		el.addEventListener('click', function (event) {
			event.target
		})

		// Type check (ensure these types are still present)
		el.addEventListener('pointerdown', function (event) {
			event.target
		})

		let loadEvent: LoadEvent | null = null

		el.addEventListener('load', function (event) {
			event.target
			this.position
			this.rotation
			this.foo
			loadEvent = event
		})

		const event = new LoadEvent()
		el.dispatchEvent(event)

		expect(loadEvent).toBe(event)
	})

	it('does not change type of other load events', () => {
		// Type check
		const img = document.createElement('img')

		img.addEventListener('load', function (event) {
			event.target
			// @ts-expect-error not a Model element
			this.position
		})
	})

	it('allows observing events with Solid html attributes', async () => {
		let loadDispatched = false
		let errorDispatched = false
		let progressDispatched = false

		const model = html`
			<lume-gltf-model
				onload=${() => (loadDispatched = true)}
				onerror=${() => (errorDispatched = true)}
				onprogress=${() => (progressDispatched = true)}
			></lume-gltf-model>
		` as GltfModel

		const event = new LoadEvent()
		model.dispatchEvent(event)
		expect(loadDispatched).toBe(true)

		const err = new ErrorEvent()
		model.dispatchEvent(err)
		expect(errorDispatched).toBe(true)

		const progress = new ProgressEvent('progress', {})
		model.dispatchEvent(progress)
		expect(progressDispatched).toBe(true)

		let error2Dispatched = false

		let model2: GltfModel
		const scene = html`
			<lume-scene webgl>
				<lume-gltf-model
					ref=${(e: GltfModel) => (model2 = e)}
					onerror=${() => (error2Dispatched = true)}
					src="foo://invalid-url"
				></lume-gltf-model>
			</lume-scene>
		` as GltfModel

		document.body.append(scene)
		await new Promise(resolve => model2.addEventListener('error', resolve))
		scene.remove()
		expect(error2Dispatched).toBe(true)
	})
})
