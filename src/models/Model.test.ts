import {element} from '@lume/element'
import {Model} from './Model.js'
import {LoadEvent} from './LoadEvent.js'

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
})
