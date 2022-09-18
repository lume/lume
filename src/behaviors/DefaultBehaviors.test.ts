import {defineElements} from '../defineElements.js'

defineElements()

describe('DefaultBehaviors', () => {
	// This test re-creates the same test as in element-behaviors, but ensures
	// that it continues to work with our DefaultBehaviors feture in place.
	it('does not interfere with default has="" attribute functionality', async () => {
		const container = document.createElement('div')
		document.body.append(container)

		class FooBar {}
		elementBehaviors.define('foo-bar', FooBar)

		container.innerHTML = /*html*/ `
			<lume-scene webgl>
				<lume-box id="box" has="foo-bar" size="10 10 10"></lume-box>

				<lume-element3d position="10 10 10">
					<lume-box id="box2" has="foo-bar" size="10 10 10"></lume-box>
				</lume-element3d>
			</lume-scene>
		`

		const box = document.getElementById('box')
		const box2 = document.getElementById('box2')

		// Defer so that MutationObserver has a chance to fire first.
		await new Promise(r => setTimeout(r))

		// They have 3 behaviors because two are added by default.
		expect(box!.behaviors.size).toBe(3)
		expect(box2!.behaviors.size).toBe(3)

		box!.setAttribute('has', 'foo-bar phong-material')

		// Defer so that MutationObserver has a chance to fire first.
		await new Promise(r => setTimeout(r))

		expect(box!.behaviors.size).toBe(2)
		expect(box!.behaviors.has('foo-bar')).toBeTrue()
		expect(box!.behaviors.has('box-geometry')).toBeFalse()
		expect(box!.behaviors.has('phong-material')).toBeTrue()

		container.innerHTML = ''
		container.remove()
	})
})
