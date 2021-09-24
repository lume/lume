import {useDefaultNames, html} from '../index.js'
import {hasShadow} from './DeclarativeBase.js'
import type {Node} from './Node.js'
import type {Scene} from './Scene.js'

useDefaultNames()

describe('Scene', () => {
	describe('ShadowDOM support', () => {
		let container: HTMLDivElement = document.createElement('div')
		const body = document.createElement('div')
		document.body.append(body)

		beforeEach(() => {
			body.append((container = document.createElement('div')))
		})

		afterEach(() => {
			body.innerHTML = ''
		})

		describe('hasShadow', () => {
			it('detects if an element has a ShadowRoot even if the root is closed', () => {
				container.attachShadow({mode: 'closed'})
				expect(hasShadow(container)).toBeTruthy()
			})
		})

		it('composes outer tree Nodes to a ShadowRoot Scene via slotted slot', async () => {
			const node = html`<lume-node slot="scene">hello</lume-node>` as Node
			container.append(node)

			const scene = html`
				<lume-scene webgl>
					<slot name="scene"></slot>
				</lume-scene>
			` as Scene

			const root = container.attachShadow({mode: 'open'})
			root.append(scene)

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.parentElement).toBe(container)
			expect(node.lumeParent).toBe(null)
			expect(node.assignedSlot).toBe(scene.querySelector('slot'))
			expect(node._composedParent).toBe(scene)
			expect(node.composedLumeParent).toBe(scene)
			expect(node.three.parent).toBe(scene.three)
			expect(node.threeCSS.parent).toBe(scene.threeCSS)

			expect(scene.composedLumeChildren.length).toBe(1)
			expect(scene.composedLumeChildren[0]).toBe(node)
			expect(scene.three.children.length).toBe(1)
			expect(scene.three.children[0]).toBe(node.three)
			expect(scene.threeCSS.children.length).toBe(1)
			expect(scene.threeCSS.children[0]).toBe(node.threeCSS)

			expect(scene.parentNode).toBe(root)
			expect(scene._composedParent).toBe(container)
			expect(scene.composedLumeParent).toBe(null)
			expect(scene.three.parent).toBe(null)
			expect(scene.threeCSS.parent).toBe(null)
		})

		it('composes Nodes that are children of a ShadowRoot to the ShadowRoot host', async () => {
			container.append(
				html`
					<lume-scene webgl>
						<lume-node></lume-node>
					</lume-scene>
				` as Scene,
			)

			const node = container.querySelector('lume-node') as Node

			const root = node.attachShadow({mode: 'open'})
			const node2 = html`<lume-node></lume-node>` as Node
			root.append(node2)

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node2.parentNode).toBe(root)
			expect(node2.lumeParent).toBe(null)
			expect(node2._composedParent).toBe(node)
			expect(node2.composedLumeParent).toBe(node)
			expect(node2.three.parent).toBe(node.three)
			expect(node2.threeCSS.parent).toBe(node.threeCSS)

			expect(node.composedLumeChildren.length).toBe(1)
			expect(node.composedLumeChildren[0]).toBe(node2)
			expect(node.three.children.length).toBe(1)
			expect(node.three.children[0]).toBe(node2.three)
			expect(node.threeCSS.children.length).toBe(1)
			expect(node.threeCSS.children[0]).toBe(node2.threeCSS)
		})

		it('does not compose Nodes that are not distributed to a slot of a Node in a ShadowRoot', async () => {
			const node = html`<lume-node></lume-node>` as Node
			container.append(node)

			const scene = html`
				<lume-scene id="3" webgl>
					<lume-node>
						<slot name="foo"> </slot>
					</lume-node>
				</lume-scene>
			` as Scene

			const node2 = scene.querySelector('lume-node') as Node

			const root = container.attachShadow({mode: 'open'})
			root.append(scene)

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.parentNode).toBe(container)
			expect(node.lumeParent).withContext('no lume parent').toBe(null)
			expect(node.assignedSlot).toBe(null)
			expect(node._composedParent).withContext('no composed parent').toBe(null)
			expect(node.composedLumeParent).withContext('no composed LUME parent').toBe(null)
			expect(node.three.parent).toBe(null)
			expect(node.threeCSS.parent).toBe(null)

			expect(node2._composedChildren.length).withContext('no composed children').toBe(0)
			expect(node2.composedLumeChildren.length).withContext('no composed LUME children').toBe(0)
			expect(node2.three.children.length).toBe(0)
			expect(node2.threeCSS.children.length).toBe(0)
		})

		it('composes outer tree Nodes to a ShadowRoot Scene via slotted slot', async () => {
			const node = html`<lume-node slot="middle">hello</lume-node>` as Node
			container.append(node)

			const middle = html`
				<div>
					<slot slot="scene" name="middle"></slot>
				</div>
			` as HTMLDivElement

			const root = container.attachShadow({mode: 'open'})
			root.append(middle)

			const deeper = html`
				<div>
					<lume-scene webgl id="4">
						<slot name="scene"></slot>
					</lume-scene>
				</div>
			` as HTMLDivElement

			const root2 = middle.attachShadow({mode: 'open'})
			root2.append(deeper)

			const scene = root2.querySelector('lume-scene')!

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.parentElement).toBe(container)
			expect(node.lumeParent).toBe(null)
			expect(node.assignedSlot).toBe(middle.querySelector('slot'))
			expect(node._composedParent).toBe(scene)
			expect(node.composedLumeParent).toBe(scene)
			expect(node.three.parent).toBe(scene.three)
			expect(node.threeCSS.parent).toBe(scene.threeCSS)

			expect(scene.children.length).toBe(1)
			expect(scene.children[0].tagName).toBe('SLOT')
			expect(scene.composedLumeChildren.length).toBe(1)
			expect(scene.composedLumeChildren[0]).toBe(node)
			expect(scene.three.children.length).toBe(1)
			expect(scene.three.children[0]).toBe(node.three)
			expect(scene.threeCSS.children.length).toBe(1)
			expect(scene.threeCSS.children[0]).toBe(node.threeCSS)

			expect(scene.parentNode).toBe(deeper)
			expect(scene._composedParent).toBe(deeper)
			expect(scene.composedLumeParent).toBe(null)
			expect(scene.three.parent).toBe(null)
			expect(scene.threeCSS.parent).toBe(null)
		})

		it("composes default content of a slot to the slot's parent if the slot has no nodes distributed to it", async () => {
			const node = html`<lume-node slot="none">hello</lume-node>` as Node
			container.append(node)

			const middle = html`
				<div>
					<slot slot="none" name="middle"></slot>
				</div>
			` as HTMLDivElement

			const root = container.attachShadow({mode: 'open'})
			root.append(middle)

			const deeper = html`
				<div>
					<lume-scene webgl id="5">
						<slot name="scene">
							<lume-sphere></lume-sphere>
						</slot>
					</lume-scene>
				</div>
			` as HTMLDivElement

			const root2 = middle.attachShadow({mode: 'open'})
			root2.append(deeper)

			const scene = root2.querySelector('lume-scene')!
			const slot = root2.querySelector('slot')!
			const sphere = root2.querySelector('lume-sphere')!

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.parentElement).toBe(container)
			expect(node.lumeParent).toBe(null)
			expect(node.assignedSlot).toBe(null)
			expect(node._composedParent).toBe(null)
			expect(node.composedLumeParent).toBe(null)
			expect(node.three.parent).toBe(null)
			expect(node.threeCSS.parent).toBe(null)

			expect(sphere.parentElement).toBe(slot)
			expect(sphere.lumeParent).toBe(null)
			expect(sphere.assignedSlot).toBe(null)
			expect(sphere._composedParent).withContext('composed parent').toBe(scene)
			expect(sphere.composedLumeParent).withContext('composed lume parent').toBe(scene)
			expect(sphere.three.parent).withContext('three parent').toBe(scene.three)
			expect(sphere.threeCSS.parent).withContext('threeCSS parent').toBe(scene.threeCSS)

			expect(scene.children.length).toBe(1)
			expect(scene.children[0]).toBe(slot)
			expect(scene.composedLumeChildren.length).withContext('sphere composed children').toBe(1)
			expect(scene.composedLumeChildren[0]).withContext('scene composed child').toBe(sphere)
			expect(scene.three.children.length).withContext('scene three children').toBe(1)
			expect(scene.three.children[0]).withContext('scene three child').toBe(sphere.three)
			expect(scene.threeCSS.children.length).withContext('scene threeCSS children').toBe(1)
			expect(scene.threeCSS.children[0]).withContext('scene threeCSS child').toBe(sphere.threeCSS)
		})

		it("prevents a slot's default content from being composed if the slot has distributed nodes", async () => {
			const node = html`<lume-node slot="middle">hello</lume-node>` as Node
			container.append(node)

			const middle = html`
				<div>
					<slot slot="scene" name="middle"></slot>
				</div>
			` as HTMLDivElement

			const root = container.attachShadow({mode: 'open'})
			root.append(middle)

			const deeper = html`
				<div>
					<lume-scene webgl id="6">
						<slot name="scene">
							<lume-sphere></lume-sphere>
						</slot>
					</lume-scene>
				</div>
			` as HTMLDivElement

			const root2 = middle.attachShadow({mode: 'open'})
			root2.append(deeper)

			const scene = root2.querySelector('lume-scene')!
			const slot = root2.querySelector('slot')!
			const sphere = root2.querySelector('lume-sphere')!

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.parentElement).toBe(container)
			expect(node.lumeParent).toBe(null)
			expect(node.assignedSlot).toBe(middle.querySelector('slot'))
			expect(node._composedParent).toBe(scene)
			expect(node.composedLumeParent).toBe(scene)
			expect(node.three.parent).toBe(scene.three)
			expect(node.threeCSS.parent).toBe(scene.threeCSS)

			expect(sphere.parentElement).toBe(slot)
			expect(sphere.lumeParent).toBe(null)
			expect(sphere.assignedSlot).toBe(null)
			expect(sphere._composedParent).withContext('composed parent').toBe(null)
			expect(sphere.composedLumeParent).withContext('composed lume parent').toBe(null)
			expect(sphere.three.parent).withContext('three parent').toBe(null)
			expect(sphere.threeCSS.parent).withContext('threeCSS parent').toBe(null)

			expect(scene.children.length).toBe(1)
			expect(scene.children[0]).toBe(slot)
			expect(scene.composedLumeChildren.length).withContext('scene composed children').toBe(1)
			expect(scene.composedLumeChildren[0]).withContext('scene composed child').toBe(node)
			expect(scene.three.children.length).withContext('scene three children').toBe(1)
			expect(scene.three.children[0]).withContext('scene three child').toBe(node.three)
			expect(scene.threeCSS.children.length).withContext('scene threeCSS children').toBe(1)
			expect(scene.threeCSS.children[0]).withContext('scene threeCSS child').toBe(node.threeCSS)
		})

		it('composes a distributed node of a ShadowRoot child slot to the shadow host', async () => {
			const scene = html`
				<lume-scene webgl id="7">
					<lume-node>
						<lume-box slot="root">hello</lume-box>
						<lume-sphere>hello</lume-sphere>
					</lume-node>
				</lume-scene>
			` as Scene

			container.append(scene)

			const node = scene.querySelector('lume-node')!
			if (!node.isNode) debugger
			const box = scene.querySelector('lume-box')!
			const sphere = scene.querySelector('lume-sphere')!

			const slot = html`<slot name="root"></slot>` as HTMLSlotElement
			const root = node.attachShadow({mode: 'open'})
			root.append(slot)

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(box.parentElement).toBe(node)
			expect(box.lumeParent).toBe(node)
			expect(box.assignedSlot).toBe(slot)
			expect(box._composedParent).toBe(node)
			expect(box.composedLumeParent).toBe(node)
			expect(box.three.parent).withContext('box three parent').toBe(node.three)
			expect(box.threeCSS.parent).withContext('box threeCSS parent').toBe(node.threeCSS)

			// The sphere is not composed because it is not slotted into the ShadowRoot
			expect(sphere.parentElement).toBe(node)
			expect(sphere.lumeParent).toBe(node)
			expect(sphere.assignedSlot).toBe(null)
			expect(sphere._composedParent).toBe(null)
			expect(sphere.composedLumeParent).toBe(null)
			expect(sphere.three.parent).withContext('sphere three parent').toBe(null)
			expect(sphere.threeCSS.parent).withContext('sphere threeCSS parent').toBe(null)

			expect(node.composedLumeChildren.length).withContext('node composed children').toBe(1)
			expect(node.composedLumeChildren[0]).withContext('node composed child').toBe(box)
			expect(node.three.children.length).withContext('node three children').toBe(1)
			expect(node.three.children[0]).withContext('node three child').toBe(box.three)
			expect(node.threeCSS.children.length).withContext('node threeCSS children').toBe(1)
			expect(node.threeCSS.children[0]).withContext('node threeCSS child').toBe(box.threeCSS)
		})

		it('composes a distributed node of a ShadowRoot child slot to the shadow host when the shadow host has a slot assigned to the ShadowRoot child slot', async () => {
			const node = html`<lume-node slot="node">hello</lume-node>` as Node
			container.append(node)

			const middle = html`
				<lume-scene id="8" webgl>
					<lume-node>
						<slot name="node" slot="deeper"></slot>
					</lume-node>
				</lume-scene>
			` as HTMLDivElement

			const root = container.attachShadow({mode: 'open'})
			root.append(middle)

			const middleNode = middle.querySelector('lume-node')!
			const middleSlot = middle.querySelector('slot')!

			const deeper = html`<slot name="deeper"></slot>` as HTMLSlotElement

			const root2 = middleNode.attachShadow({mode: 'open'})
			root2.append(deeper)

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.parentElement).toBe(container)
			expect(node.lumeParent).toBe(null)
			expect(node.assignedSlot).toBe(middleSlot)
			expect(node._composedParent).toBe(middleNode)
			expect(node.composedLumeParent).toBe(middleNode)
			expect(node.three.parent).toBe(middleNode.three)
			expect(node.threeCSS.parent).toBe(middleNode.threeCSS)

			expect(middleNode.children.length).toBe(1)
			expect(middleNode.children[0]).toBe(middleSlot)
			expect(middleNode.composedLumeChildren.length).withContext('middleNode composed children').toBe(1)
			expect(middleNode.composedLumeChildren[0]).withContext('middleNode composed child').toBe(node)
			expect(middleNode.three.children.length).withContext('middleNode three children').toBe(1)
			expect(middleNode.three.children[0]).withContext('middleNode three child').toBe(node.three)
			expect(middleNode.threeCSS.children.length).withContext('middleNode threeCSS children').toBe(1)
			expect(middleNode.threeCSS.children[0]).withContext('middleNode threeCSS child').toBe(node.threeCSS)
		})

		////// TODO /////////////////////////////////////////////////////////////////////////////
		////// TODO /////////////////////////////////////////////////////////////////////////////
		////// TODO /////////////////////////////////////////////////////////////////////////////
		////// TODO /////////////////////////////////////////////////////////////////////////////
		////// TODO /////////////////////////////////////////////////////////////////////////////
		////// VVVV /////////////////////////////////////////////////////////////////////////////

		// TODO slotting of scenes is not currently supported.
		xit('supports Scenes slotted to a slot child of a ShadowRoot', async () => {
			const root = container.attachShadow({mode: 'open'})

			container.append(
				html`
					<lume-scene id="9">
						<lume-node slot="scene">hello</lume-node>
					</lume-scene>
				` as Scene,
			)

			const scene = container.querySelector('lume-scene')!
			const node = container.querySelector('lume-node')!

			root.append(html`<slot></slot>` as HTMLSlotElement)

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.lumeParent).toBe(scene)
			expect(node._composedParent).toBe(scene)
			expect(node.composedLumeParent).toBe(scene)
			expect(scene.composedLumeChildren.length).toBe(1)
			expect(scene.composedLumeChildren[0]).toBe(node)
			expect(scene._composedParent).toBe(container)
			expect(scene.composedLumeParent).toBe(null)
		})

		// TODO slotting of scenes is not currently supported.
		xit('supports Scenes slotted to a slot child of a div in a ShadowRoot', async () => {
			const root = container.attachShadow({mode: 'open'})

			container.append(
				html`
					<lume-scene id="10">
						<lume-node slot="scene">hello</lume-node>
					</lume-scene>
				` as Scene,
			)

			const scene = container.querySelector('lume-scene')!
			const node = container.querySelector('lume-node')!

			const distributedParent = html`
				<div>
					<slot></slot>
				</div>
			` as HTMLDivElement

			root.append(distributedParent)

			// TODO get it work without a timeout (ths is difficult considering
			// that the implementation currently relies on MutationObserver
			// which triggers reactions deferred).
			await new Promise(r => setTimeout(r, 10))

			expect(node.lumeParent).toBe(scene)
			expect(node._composedParent).toBe(scene)
			expect(node.composedLumeParent).toBe(scene)
			expect(scene.composedLumeChildren.length).toBe(1)
			expect(scene.composedLumeChildren[0]).toBe(node)
			expect(scene._composedParent).toBe(distributedParent)
			expect(scene.composedLumeParent).toBe(null)
		})
	})
})
