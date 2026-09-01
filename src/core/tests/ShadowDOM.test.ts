import html from 'solid-js/html'
import '../../index.js'
import {hasShadow} from '../CompositionTracker.js'
import type {Element3D} from '../Element3D.js'
import type {Scene} from '../Scene.js'

describe('ShadowDOM support', () => {
	let container: HTMLDivElement = document.createElement('div')
	const root = document.createElement('div')
	document.body.append(root)

	beforeEach(() => {
		container = document.createElement('div')
		root.append(container)
	})

	afterEach(() => {
		root.innerHTML = ''
	})

	describe('hasShadow', () => {
		it('detects if an element has a ShadowRoot even if the root is closed', () => {
			container.attachShadow({mode: 'closed'})
			expect(hasShadow(container)).toBeTruthy()
		})
	})

	it("always treats children of a Scene as composed children, disregarding a Scene's special ShadowDOM", async () => {
		const scene = html`
			<lume-scene webgl>
				<lume-element3d></lume-element3d>
			</lume-scene>
		` as Scene

		const node = scene.querySelector('lume-element3d') as Element3D

		container.append(scene)

		// TODO get it work without a timeout (ths is difficult considering
		// that the implementation currently relies on MutationObserver
		// which triggers reactions deferred).
		await new Promise(r => setTimeout(r, 10))

		expect(node.parentNode).toBe(scene)
		expect(node.parentLumeElement).toBe(scene)

		// Although a Scene has ShadowDOM, child Nodes are considered
		// composed to the Scene instead of the ShadowDOM for our 3D
		// rendering purposes.
		expect(node.composedSceneGraphParent).toBe(scene)

		expect(node.three.parent).toBe(scene.three)
		expect(node.threeCSS.parent).toBe(scene.threeCSS)
	})

	it('composes outer tree Nodes to a ShadowRoot Scene via slotted slot', async () => {
		const node = html`<lume-element3d slot="scene">hello</lume-element3d>` as Element3D
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
		expect(node.parentLumeElement).toBe(null)
		expect(node.assignedSlot).toBe(scene.querySelector('slot'))
		expect(node.composedSceneGraphParent).toBe(scene)
		expect(node.three.parent).toBe(scene.three)
		expect(node.threeCSS.parent).toBe(scene.threeCSS)

		expect(scene.composedSceneGraphChildren.length).toBe(1)
		expect(scene.composedSceneGraphChildren[0]).toBe(node)
		expect(scene.three.children.length).toBe(1)
		expect(scene.three.children[0]).toBe(node.three)
		expect(scene.threeCSS.children.length).toBe(1)
		expect(scene.threeCSS.children[0]).toBe(node.threeCSS)

		expect(scene.parentNode).toBe(root)
		expect(scene.composedParent).toBe(container)
		expect(scene.composedSceneGraphParent).toBe(null)
		expect(scene.three.parent).toBe(null)
		expect(scene.threeCSS.parent).toBe(null)
	})

	it('composes Nodes that are children of a ShadowRoot to the ShadowRoot host', async () => {
		container.append(
			html`
				<lume-scene webgl>
					<lume-element3d></lume-element3d>
				</lume-scene>
			` as Scene,
		)

		const node = container.querySelector('lume-element3d') as Element3D

		const shadow = node.attachShadow({mode: 'open'})
		const node2 = html`<lume-element3d></lume-element3d>` as Element3D
		shadow.append(node2)

		// TODO get it work without a timeout (ths is difficult considering
		// that the implementation currently relies on MutationObserver
		// which triggers reactions deferred).
		await new Promise(r => setTimeout(r, 10))

		expect(node2.parentNode).toBe(shadow)
		expect(node2.parentLumeElement).toBe(null)
		expect(node2.composedParent).toBe(node)
		expect(node2.composedSceneGraphParent).toBe(node)
		expect(node2.three.parent).toBe(node.three)
		expect(node2.threeCSS.parent).toBe(node.threeCSS)

		expect(node.composedSceneGraphChildren.length).toBe(1)
		expect(node.composedSceneGraphChildren[0]).toBe(node2)
		expect(node.three.children.length).toBe(1)
		expect(node.three.children[0]).toBe(node2.three)
		expect(node.threeCSS.children.length).toBe(1)
		expect(node.threeCSS.children[0]).toBe(node2.threeCSS)
	})

	it('does not compose Nodes that are not distributed to a slot of a Node in a ShadowRoot', async () => {
		const node = html`<lume-element3d></lume-element3d>` as Element3D
		container.append(node)

		const scene = html`
			<lume-scene id="3" webgl>
				<lume-element3d>
					<slot name="foo"> </slot>
				</lume-element3d>
			</lume-scene>
		` as Scene

		const node2 = scene.querySelector('lume-element3d') as Element3D

		const root = container.attachShadow({mode: 'open'})
		root.append(scene)

		// TODO get it work without a timeout (this is difficult considering
		// that the implementation currently relies on MutationObserver
		// which triggers reactions deferred).
		await new Promise(r => setTimeout(r, 10))

		expect(node.parentNode).toBe(container)
		expect(node.parentLumeElement).toBe(null)
		expect(node.assignedSlot).toBe(null)
		expect(node.composedParent).toBe(null)
		expect(node.composedSceneGraphParent).toBe(null)
		expect(node.three.parent).toBe(null)
		expect(node.threeCSS.parent).toBe(null)

		expect(node2.composedChildren.length).toBe(0)
		expect(node2.composedSceneGraphChildren.length).toBe(0)
		expect(node2.three.children.length).toBe(0)
		expect(node2.threeCSS.children.length).toBe(0)
	})

	it('composes outer tree Nodes to a ShadowRoot Scene via slotted slot', async () => {
		const node = html`<lume-element3d slot="middle">hello</lume-element3d>` as Element3D
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
		expect(node.parentLumeElement).toBe(null)
		expect(node.assignedSlot).toBe(middle.querySelector('slot'))
		expect(node.composedSceneGraphParent).toBe(scene)
		expect(node.three.parent).toBe(scene.three)
		expect(node.threeCSS.parent).toBe(scene.threeCSS)

		expect(scene.children.length).toBe(1)
		expect(scene.children[0]!.tagName).toBe('SLOT')
		expect(scene.composedSceneGraphChildren.length).toBe(1)
		expect(scene.composedSceneGraphChildren[0]).toBe(node)
		expect(scene.three.children.length).toBe(1)
		expect(scene.three.children[0]).toBe(node.three)
		expect(scene.threeCSS.children.length).toBe(1)
		expect(scene.threeCSS.children[0]).toBe(node.threeCSS)

		expect(scene.parentNode).toBe(deeper)
		expect(scene.composedParent).toBe(deeper)
		expect(scene.composedSceneGraphParent).toBe(null)
		expect(scene.three.parent).toBe(null)
		expect(scene.threeCSS.parent).toBe(null)
	})

	it("composes default content of a slot to the slot's parent if the slot has no nodes distributed to it", async () => {
		const node = html`<lume-element3d slot="none">hello</lume-element3d>` as Element3D
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
		expect(node.parentLumeElement).toBe(null)
		expect(node.assignedSlot).toBe(null)
		expect(node.composedParent).toBe(null)
		expect(node.composedSceneGraphParent).toBe(null)
		expect(node.three.parent).toBe(null)
		expect(node.threeCSS.parent).toBe(null)

		expect(sphere.parentElement).toBe(slot)
		expect(sphere.parentLumeElement).toBe(null)
		expect(sphere.assignedSlot).toBe(null)
		expect(sphere.composedSceneGraphParent).toBe(scene)
		expect(sphere.three.parent).toBe(scene.three)
		expect(sphere.threeCSS.parent).toBe(scene.threeCSS)

		expect(scene.children.length).toBe(1)
		expect(scene.children[0]).toBe(slot)
		expect(scene.composedSceneGraphChildren.length).toBe(1)
		expect(scene.composedSceneGraphChildren[0]).toBe(sphere)
		expect(scene.three.children.length).toBe(1)
		expect(scene.three.children[0]).toBe(sphere.three)
		expect(scene.threeCSS.children.length).toBe(1)
		expect(scene.threeCSS.children[0]).toBe(sphere.threeCSS)
	})

	it("prevents a slot's default content from being composed if the slot has distributed nodes", async () => {
		const node = html`<lume-element3d slot="middle">hello</lume-element3d>` as Element3D
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
		expect(node.parentLumeElement).toBe(null)
		expect(node.assignedSlot).toBe(middle.querySelector('slot'))
		expect(node.composedSceneGraphParent).toBe(scene)
		expect(node.three.parent).toBe(scene.three)
		expect(node.threeCSS.parent).toBe(scene.threeCSS)

		expect(sphere.parentElement).toBe(slot)
		expect(sphere.parentLumeElement).toBe(null)
		expect(sphere.assignedSlot).toBe(null)
		expect(sphere.composedParent).toBe(null)
		expect(sphere.composedSceneGraphParent).toBe(null)
		expect(sphere.three.parent).toBe(null)
		expect(sphere.threeCSS.parent).toBe(null)

		expect(scene.children.length).toBe(1)
		expect(scene.children[0]).toBe(slot)
		expect(scene.composedSceneGraphChildren.length).toBe(1)
		expect(scene.composedSceneGraphChildren[0]).toBe(node)
		expect(scene.three.children.length).toBe(1)
		expect(scene.three.children[0]).toBe(node.three)
		expect(scene.threeCSS.children.length).toBe(1)
		expect(scene.threeCSS.children[0]).toBe(node.threeCSS)
	})

	it('composes a distributed node of a ShadowRoot child slot to the shadow host', async () => {
		const scene = html`
			<lume-scene webgl id="7">
				<lume-element3d>
					<lume-box slot="root">hello</lume-box>
					<lume-sphere>hello</lume-sphere>
				</lume-element3d>
			</lume-scene>
		` as Scene

		container.append(scene)

		const node = scene.querySelector('lume-element3d')!
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
		expect(box.parentLumeElement).toBe(node)
		expect(box.assignedSlot).toBe(slot)
		expect(box.composedParent).toBe(node)
		expect(box.composedSceneGraphParent).toBe(node)
		expect(box.three.parent).toBe(node.three)
		expect(box.threeCSS.parent).toBe(node.threeCSS)

		// The sphere is not composed because it is not slotted into the ShadowRoot
		expect(sphere.parentElement).toBe(node)
		expect(sphere.parentLumeElement).toBe(node)
		expect(sphere.assignedSlot).toBe(null)
		expect(sphere.composedParent).toBe(null)
		expect(sphere.composedSceneGraphParent).toBe(null)
		expect(sphere.three.parent).toBe(null)
		expect(sphere.threeCSS.parent).toBe(null)

		expect(node.composedSceneGraphChildren.length).toBe(1)
		expect(node.composedSceneGraphChildren[0]).toBe(box)
		expect(node.three.children.length).toBe(1)
		expect(node.three.children[0]).toBe(box.three)
		expect(node.threeCSS.children.length).toBe(1)
		expect(node.threeCSS.children[0]).toBe(box.threeCSS)
	})

	it('composes a distributed node of a ShadowRoot child slot to the shadow host when the shadow host has a slot assigned to the ShadowRoot child slot', async () => {
		const node = html`<lume-element3d slot="node">hello</lume-element3d>` as Element3D
		container.append(node)

		const middle = html`
			<lume-scene id="8" webgl>
				<lume-element3d>
					<slot name="node" slot="deeper"></slot>
				</lume-element3d>
			</lume-scene>
		` as HTMLDivElement

		const root = container.attachShadow({mode: 'open'})
		root.append(middle)

		const middleNode = middle.querySelector('lume-element3d')!
		const middleSlot = middle.querySelector('slot')!

		const deeper = html`<slot name="deeper"></slot>` as HTMLSlotElement

		const root2 = middleNode.attachShadow({mode: 'open'})
		root2.append(deeper)

		// TODO get it work without a timeout (ths is difficult considering
		// that the implementation currently relies on MutationObserver
		// which triggers reactions deferred).
		await new Promise(r => setTimeout(r, 10))

		expect(node.parentElement).toBe(container)
		expect(node.parentLumeElement).toBe(null)
		expect(node.assignedSlot).toBe(middleSlot)
		expect(node.composedParent).toBe(middleNode)
		expect(node.composedSceneGraphParent).toBe(middleNode)
		expect(node.three.parent).toBe(middleNode.three)
		expect(node.threeCSS.parent).toBe(middleNode.threeCSS)

		expect(middleNode.children.length).toBe(1)
		expect(middleNode.children[0]).toBe(middleSlot)
		expect(middleNode.composedSceneGraphChildren.length).toBe(1)
		expect(middleNode.composedSceneGraphChildren[0]).toBe(node)
		expect(middleNode.three.children.length).toBe(1)
		expect(middleNode.three.children[0]).toBe(node.three)
		expect(middleNode.threeCSS.children.length).toBe(1)
		expect(middleNode.threeCSS.children[0]).toBe(node.threeCSS)
	})

	it('tracks direct vs terminal slottedParent through forwarded slot chains', async () => {
		// Element A has a ShadowRoot.
		const A = document.createElement('lume-element3d')
		const rootA = A.attachShadow({mode: 'open'})

		// Element B is a direct child of A, assigned to one of two slots in A's ShadowRoot.
		const B = document.createElement('lume-element3d')
		B.setAttribute('slot', 'slot1')
		A.append(B)

		container.append(A)

		// C1 and C2 are siblings in A's ShadowRoot, each owning one slot.
		// Both slots forward to their owner's own shadow which contains a
		// terminal slot.  This way moving B from slot1 to slot2 changes
		// B's slottedParent and terminalSlottedParent.
		const C1 = document.createElement('lume-element3d')
		const slot1 = document.createElement('slot')
		slot1.setAttribute('name', 'slot1')
		slot1.setAttribute('slot', 'terminal')
		C1.append(slot1)
		rootA.append(C1)

		const C2 = document.createElement('lume-element3d')
		const slot2 = document.createElement('slot')
		slot2.setAttribute('name', 'slot2')
		slot2.setAttribute('slot', 'terminal')
		C2.append(slot2)
		rootA.append(C2)

		// Each C* has a ShadowRoot containing a D* with a terminal slot.
		const rootC1 = C1.attachShadow({mode: 'open'})
		const D1 = document.createElement('lume-element3d')
		const terminalSlot1 = document.createElement('slot')
		terminalSlot1.setAttribute('name', 'terminal')
		D1.append(terminalSlot1)
		rootC1.append(D1)

		const rootC2 = C2.attachShadow({mode: 'open'})
		const D2 = document.createElement('lume-element3d')
		const terminalSlot2 = document.createElement('slot')
		terminalSlot2.setAttribute('name', 'terminal')
		D2.append(terminalSlot2)
		rootC2.append(D2)

		await new Promise(r => setTimeout(r, 10))

		// --- Verify initial state: B → slot1 → terminal1 ---

		// Direct slottedParent: C1 (owner of slot1)
		expect(B.slottedParent).toBe(C1)
		// Terminal slottedParent: D1 (owner of terminal slot in C1's shadow)
		expect(B.terminalSlottedParent).toBe(D1)

		// C1 has B as a direct slotted child.
		expect(C1.slottedChildren!.size).toBe(1)
		expect(C1.slottedChildren!.has(B)).toBe(true)
		expect(C1.terminalSlottedChildren).toBeNull()

		// C2 has nothing — B is not assigned to slot2 yet.
		expect(C2.slottedChildren).toBeNull()
		expect(C2.terminalSlottedChildren).toBeNull()

		// D1 has B as a terminal slotted child.
		expect(D1.terminalSlottedChildren!.size).toBe(1)
		expect(D1.terminalSlottedChildren!.has(B)).toBe(true)

		// D2 has nothing.
		expect(D2.terminalSlottedChildren).toBeNull()

		// --- Move B from slot1 to slot2 ---

		B.setAttribute('slot', 'slot2')

		await new Promise(r => setTimeout(r, 10))

		// B's direct slottedParent changed: C1 → C2.
		expect(B.slottedParent).toBe(C2)
		// B's terminal slottedParent changed: D1 → D2.
		expect(B.terminalSlottedParent).toBe(D2)

		// C1's slottedChildren is now empty (B left slot1).
		expect(C1.slottedChildren).toBeNull()
		expect(C1.terminalSlottedChildren).toBeNull()

		// C2 now has B as a direct slotted child.
		expect(C2.slottedChildren!.size).toBe(1)
		expect(C2.slottedChildren!.has(B)).toBe(true)
		expect(C2.terminalSlottedChildren).toBeNull()

		// D1's terminal children empty.
		expect(D1.terminalSlottedChildren).toBeNull()

		// D2 now has B as a terminal slotted child.
		expect(D2.terminalSlottedChildren!.size).toBe(1)
		expect(D2.terminalSlottedChildren!.has(B)).toBe(true)
	})

	it('tracks direct vs terminal slottedParent through a three-layer forwarded slot chain', async () => {
			// Helper to instrument an element's composition callbacks for testing.
			const trackCallbacks = (el: HTMLElement) => {
				const log: any[] = []
				const origComposed = (el as any).composedCallback
				const origUncomposed = (el as any).uncomposedCallback
				const origChildComposed = (el as any).childComposedCallback
				const origChildUncomposed = (el as any).childUncomposedCallback

				;(el as any).composedCallback = function(parent: any, type: string) {
					log.push({event: 'composed', other: parent, compositionType: type})
					return origComposed?.call(this, parent, type)
				}
				;(el as any).uncomposedCallback = function(parent: any, type: string) {
					log.push({event: 'uncomposed', other: parent, compositionType: type})
					return origUncomposed?.call(this, parent, type)
				}
				;(el as any).childComposedCallback = function(child: any, type: string) {
					log.push({event: 'childComposed', other: child, compositionType: type})
					return origChildComposed?.call(this, child, type)
				}
				;(el as any).childUncomposedCallback = function(child: any, type: string) {
					log.push({event: 'childUncomposed', other: child, compositionType: type})
					return origChildUncomposed?.call(this, child, type)
				}
				return log
			}

			// Layer 1: A's ShadowRoot
			const A = document.createElement('lume-element3d')
			const A_log = trackCallbacks(A)
			const rootA = A.attachShadow({mode: 'open'})

			// Element B is a direct child of A.
			const B = document.createElement('lume-element3d')
			const B_log = trackCallbacks(B)
			B.setAttribute('slot', 'slotA')
			A.append(B)

			container.append(A)

			// C1 owns slotA (forwarded to "mid"). C2 owns slotB (also forwarded
					// to "mid"). X is assigned directly to "mid" in C1's shadow.
					// The three-layer chain is: B → slotA → midSlot (in D, C1's shadow)
					// → terminalSlot (in E, D's shadow).
					const C1 = document.createElement('lume-element3d')
					const C1_log = trackCallbacks(C1)
					const slotA = document.createElement('slot')
					slotA.setAttribute('name', 'slotA')
					slotA.setAttribute('slot', 'mid')
					C1.append(slotA)

					const X = document.createElement('lume-element3d')
					const X_log = trackCallbacks(X)
					X.setAttribute('slot', 'mid')
					C1.append(X)
					rootA.append(C1)

					const C2 = document.createElement('lume-element3d')
					const C2_log = trackCallbacks(C2)
					const slotB = document.createElement('slot')
					slotB.setAttribute('name', 'slotB')
					slotB.setAttribute('slot', 'mid2')
					C2.append(slotB)
					rootA.append(C2)

					// Layer 2: D in C1's shadow (mid slot, forwarded to "terminal")
					const rootC1 = C1.attachShadow({mode: 'open'})
					const D = document.createElement('lume-element3d')
					const D_log = trackCallbacks(D)
					const midSlot = document.createElement('slot')
					midSlot.setAttribute('name', 'mid')
					midSlot.setAttribute('slot', 'terminal')
					D.append(midSlot)
					rootC1.append(D)

					// Layer 2b: D2 in C2's shadow (separate chain for slotB)
					const rootC2 = C2.attachShadow({mode: 'open'})
					const D2 = document.createElement('lume-element3d')
					const D2_log = trackCallbacks(D2)
					const midSlot2 = document.createElement('slot')
					midSlot2.setAttribute('name', 'mid2')
					midSlot2.setAttribute('slot', 'terminal2')
					D2.append(midSlot2)
					rootC2.append(D2)

			// Layer 3: D's ShadowRoot → E (terminal slot, final destination for C1 chain)
					const rootD = D.attachShadow({mode: 'open'})
					const E = document.createElement('lume-element3d')
					const E_log = trackCallbacks(E)
					const terminalSlot = document.createElement('slot')
					terminalSlot.setAttribute('name', 'terminal')
					E.append(terminalSlot)
					rootD.append(E)

					// Layer 3b: D2's ShadowRoot → E2 (terminal slot for C2 chain)
					const rootD2 = D2.attachShadow({mode: 'open'})
					const E2 = document.createElement('lume-element3d')
					const E2_log = trackCallbacks(E2)
					const terminalSlot2 = document.createElement('slot')
					terminalSlot2.setAttribute('name', 'terminal2')
					E2.append(terminalSlot2)
					rootD2.append(E2)

					await new Promise(r => setTimeout(r, 10))

					// --- Verify initial state ---

					// B's direct slottedParent: C1 (slotA's owner, first in chain)
					expect(B.slottedParent).toBe(C1)
					// B's terminal slottedParent: E (terminal slot's owner, final in chain for C1)
					expect(B.terminalSlottedParent).toBe(E)

					// X's direct slottedParent: D (mid slot's owner, X is in C1's light DOM)
					expect(X.slottedParent).toBe(D)
					// X's terminal slottedParent: E (same terminal slot)
					expect(X.terminalSlottedParent).toBe(E)

					// C1 has B as a direct slotted child (via slotA), but NOT X (X is assigned
					// directly to midSlot in C1's shadow, bypassing C1's slot ownership).
					expect(C1.slottedChildren!.size).toBe(1)
					expect(C1.slottedChildren!.has(B)).toBe(true)
					expect(C1.slottedChildren!.has(X)).toBe(false)
					expect(C1.terminalSlottedChildren).toBeNull()

					// C2 has nothing — B is not assigned to slotB yet.
					expect(C2.slottedChildren).toBeNull()
					expect(C2.terminalSlottedChildren).toBeNull()

					// D has BOTH B (passthrough from slotA) and X (directly assigned to "mid").
					expect(D.slottedChildren!.size).toBe(2)
					expect(D.slottedChildren!.has(B)).toBe(true)
					expect(D.slottedChildren!.has(X)).toBe(true)
					expect(D.terminalSlottedChildren).toBeNull()

					// D2 has nothing (separate chain, no elements assigned to mid2 yet).
					expect(D2.slottedChildren).toBeNull()
					expect(D2.terminalSlottedChildren).toBeNull()

					// E has BOTH B and X as terminal slotted children (final sink for C1 chain).
					// slottedChildren mirrors terminalSlottedChildren for terminal slots.
					expect(E.slottedChildren!.size).toBe(2)
					expect(E.slottedChildren!.has(B)).toBe(true)
					expect(E.slottedChildren!.has(X)).toBe(true)
					expect(E.terminalSlottedChildren!.size).toBe(2)
					expect(E.terminalSlottedChildren!.has(B)).toBe(true)
					expect(E.terminalSlottedChildren!.has(X)).toBe(true)

					// composedParent is the terminal slot owner (E).
					console.log('[3L-TEST] B.__composedParent:', (B as any).__composedParent?.tagName)
					console.log('[3L-TEST] B.terminalSlottedParent:', B.terminalSlottedParent?.tagName)
					console.log('[3L-TEST] B.composedParent:', B.composedParent?.tagName)
					console.log('[3L-TEST] E:', E.tagName)
					console.log('[3L-TEST] E === B.__composedParent:', E === (B as any).__composedParent)
					console.log('[3L-TEST] E === B.composedParent:', E === B.composedParent)
					expect(B.composedParent).toBe(E)
					expect(X.composedParent).toBe(E)

					// E2 has nothing (separate chain, no terminal2 assignments yet).
					expect(E2.terminalSlottedChildren).toBeNull()

					// --- Callback verification ---

					// B was composed to C1 with "slot" type (direct slot parent).
					expect(B_log.filter(e => e.event === 'composed' && e.other === C1 && e.compositionType === 'slot').length).toBe(1)
					expect(C1_log.filter(e => e.event === 'childComposed' && e.other === B && e.compositionType === 'slot').length).toBe(1)

					// D received childComposed for B (passthrough) and X (direct) with "slot" type.
					expect(D_log.filter(e => e.event === 'childComposed' && e.other === B && e.compositionType === 'slot').length).toBe(1)
					expect(D_log.filter(e => e.event === 'childComposed' && e.other === X && e.compositionType === 'slot').length).toBe(1)

					// X was composed to D with "slot" type (mid slot is first slot for X).
					expect(X_log.filter(e => e.event === 'composed' && e.other === D && e.compositionType === 'slot').length).toBe(1)

					// B did NOT get "slot" composed to D or C2.
					expect(B_log.filter(e => e.event === 'composed' && e.other === D && e.compositionType === 'slot').length).toBe(0)
					expect(B_log.filter(e => e.event === 'composed' && e.other === C2 && e.compositionType === 'slot').length).toBe(0)

					// Both B and X got "terminal-slot" composed to E.
					expect(B_log.filter(e => e.event === 'composed' && e.other === E && e.compositionType === 'terminal-slot').length).toBe(1)
					expect(X_log.filter(e => e.event === 'composed' && e.other === E && e.compositionType === 'terminal-slot').length).toBe(1)
					expect(E_log.filter(e => e.event === 'childComposed' && e.other === B && e.compositionType === 'terminal-slot').length).toBe(1)
					expect(E_log.filter(e => e.event === 'childComposed' && e.other === X && e.compositionType === 'terminal-slot').length).toBe(1)

					// --- Move B from slotA to slotB (C1 → C2, different D/E chain) ---

					// Reset logs to check what fires during the move.
					A_log.length = B_log.length = C1_log.length = C2_log.length = D_log.length = D2_log.length = E_log.length = E2_log.length = X_log.length = 0

					B.setAttribute('slot', 'slotB')

					await new Promise(r => setTimeout(r, 10))

					// B's direct slottedParent changed: C1 → C2.
					expect(B.slottedParent).toBe(C2)
					// B's terminal slottedParent changed: E → E2 (different terminal chain).
					expect(B.terminalSlottedParent).toBe(E2)

					// C1's slottedChildren is now empty.
					expect(C1.slottedChildren).toBeNull()

					// C2 now has B as a direct slotted child.
					expect(C2.slottedChildren!.size).toBe(1)
					expect(C2.slottedChildren!.has(B)).toBe(true)

					// D still has X, but B left the chain.
					expect(D.slottedChildren!.size).toBe(1)
					expect(D.slottedChildren!.has(X)).toBe(true)
					expect(D.terminalSlottedChildren).toBeNull()

					// D2 now has B as passthrough from C2's slotB.
					expect(D2.slottedChildren!.size).toBe(1)
					expect(D2.slottedChildren!.has(B)).toBe(true)
					expect(D2.terminalSlottedChildren).toBeNull()

					// E still has X, but B left.
					expect(E.terminalSlottedChildren!.size).toBe(1)
					expect(E.terminalSlottedChildren!.has(X)).toBe(true)
					// slottedChildren mirrors terminal — B was removed.
					expect(E.slottedChildren!.size).toBe(1)
					expect(E.slottedChildren!.has(X)).toBe(true)
					expect(E.slottedChildren!.has(B)).toBe(false)

					// E2 now has B as terminal child.
					expect(E2.terminalSlottedChildren!.size).toBe(1)
					expect(E2.terminalSlottedChildren!.has(B)).toBe(true)
					// slottedChildren mirrors terminal.
					expect(E2.slottedChildren!.size).toBe(1)
					expect(E2.slottedChildren!.has(B)).toBe(true)

					// composedParent follows the terminal slot owner.
					expect(B.composedParent).toBe(E2)
					expect(X.composedParent).toBe(E)

					// B got uncomposed from C1 (slot type) and composed to C2 (slot type).
					expect(B_log.filter(e => e.event === 'uncomposed' && e.other === C1 && e.compositionType === 'slot').length).toBe(1)
					expect(B_log.filter(e => e.event === 'composed' && e.other === C2 && e.compositionType === 'slot').length).toBe(1)
					expect(C1_log.filter(e => e.event === 'childUncomposed' && e.other === B && e.compositionType === 'slot').length).toBe(1)
					expect(C2_log.filter(e => e.event === 'childComposed' && e.other === B && e.compositionType === 'slot').length).toBe(1)

					// D got childUncomposed for B (passthrough left), D2 got childComposed (passthrough arrived).
					expect(D_log.filter(e => e.event === 'childUncomposed' && e.other === B && e.compositionType === 'slot').length).toBe(1)
					expect(D2_log.filter(e => e.event === 'childComposed' && e.other === B && e.compositionType === 'slot').length).toBe(1)

					// Terminal callbacks: B left E (terminal-slot), arrived at E2 (terminal-slot).
					expect(B_log.filter(e => e.event === 'uncomposed' && e.other === E && e.compositionType === 'terminal-slot').length).toBe(1)
					expect(B_log.filter(e => e.event === 'composed' && e.other === E2 && e.compositionType === 'terminal-slot').length).toBe(1)
					expect(E_log.filter(e => e.event === 'childUncomposed' && e.other === B && e.compositionType === 'terminal-slot').length).toBe(1)
					expect(E2_log.filter(e => e.event === 'childComposed' && e.other === B && e.compositionType === 'terminal-slot').length).toBe(1)
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
					<lume-element3d slot="scene">hello</lume-element3d>
				</lume-scene>
			` as Scene,
		)

		const scene = container.querySelector('lume-scene')!
		const node = container.querySelector('lume-element3d')!

		root.append(html`<slot></slot>` as HTMLSlotElement)

		// TODO get it work without a timeout (ths is difficult considering
		// that the implementation currently relies on MutationObserver
		// which triggers reactions deferred).
		await new Promise(r => setTimeout(r, 10))

		expect(node.parentLumeElement).toBe(scene)
		expect(node.composedSceneGraphParent).toBe(scene)
		expect(scene.composedSceneGraphChildren.length).toBe(1)
		expect(scene.composedSceneGraphChildren[0]).toBe(node)
		expect(scene.composedParent).toBe(container)
		expect(scene.composedSceneGraphParent).toBe(null)
	})

	// TODO slotting of scenes is not currently supported.
	xit('supports Scenes slotted to a slot child of a div in a ShadowRoot', async () => {
		const root = container.attachShadow({mode: 'open'})

		container.append(
			html`
				<lume-scene id="10">
					<lume-element3d slot="scene">hello</lume-element3d>
				</lume-scene>
			` as Scene,
		)

		const scene = container.querySelector('lume-scene')!
		const node = container.querySelector('lume-element3d')!

		const slottableParent = html`
			<div>
				<slot></slot>
			</div>
		` as HTMLDivElement

		root.append(slottableParent)

		// TODO get it work without a timeout (ths is difficult considering
		// that the implementation currently relies on MutationObserver
		// which triggers reactions deferred).
		await new Promise(r => setTimeout(r, 10))

		expect(node.parentLumeElement).toBe(scene)
		expect(node.composedSceneGraphParent).toBe(scene)
		expect(scene.composedSceneGraphChildren.length).toBe(1)
		expect(scene.composedSceneGraphChildren[0]).toBe(node)
		expect(scene.composedParent).toBe(slottableParent)
		expect(scene.composedSceneGraphParent).toBe(null)
	})

	// TODO tests for features that rely on the composed tree
	xit('produces the correct calculated size for a Node based on its composed parent', () => {})
	xit('produces the correct transform for a Node based on its composed parent', () => {})
})
