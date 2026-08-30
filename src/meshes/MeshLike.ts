// import {Show} from 'solid-js'
import html from 'solid-js/html'
import {element} from '@lume/element'
import {Element3D} from '../core/Element3D.js'
import {effect, memo} from 'classy-solid'
import type {GeometryBehaviorEl} from '../behavior-elements/mesh-behaviors/geometries/GeometryBehaviorEl.js'
import type {MaterialBehaviorEl} from '../behavior-elements/mesh-behaviors/materials/MaterialBehaviorEl.js'
// Import these lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/geometries/BoxGeometry.js')
import('../behavior-elements/mesh-behaviors/materials/PhysicalMaterial.js')

// These imported async to also avoid a circular import error with regular import.
const Classes = Promise.all([
	import('../behavior-elements/mesh-behaviors/geometries/GeometryBehaviorEl.js'),
	import('../behavior-elements/mesh-behaviors/materials/MaterialBehaviorEl.js'),
]).then(([{GeometryBehaviorEl}, {MaterialBehaviorEl}]) => ({GeometryBehaviorEl, MaterialBehaviorEl}))

type Classes = {GeometryBehaviorEl: typeof GeometryBehaviorEl; MaterialBehaviorEl: typeof MaterialBehaviorEl}

/**
 * @abstract
 * @class MeshLike -
 *
 * `abstract`
 *
 * An abstract base class for elements that render a shape (a geometry) with a
 * style (a material) — namely `Mesh`, `Points`, and `Line` elements. It renders
 * default geometry and material behavior child elements into named slots,
 * unless subclasses override the defaults via `_defaultGeometry` and
 * `_defaultMaterial`, or unless the user provides their own child behavior
 * elements.
 *
 * The default geometry is [`<lume-box-geometry>`](../behavior-elements/mesh-behaviors/geometries/BoxGeometry)
 * and the default material is [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * @extends Element3D
 */
export
@element({autoDefine: false})
abstract class MeshLike extends Element3D {
	/** @protected */
	protected _defaultGeometry = () => html`<lume-box-geometry></lume-box-geometry>`
	/** @protected */
	protected _defaultMaterial = () => html`<lume-physical-material></lume-physical-material>`

	@memo get hasLegacyGeometry() {
		return this.has.split(/\s+/).some(v => v.endsWith('-geometry'))
	}
	@memo get hasLegacyMaterial() {
		return this.has.split(/\s+/).some(v => v.endsWith('-material'))
	}

	override hasShadow = true
	override shadowOptions: ShadowRootInit = {mode: 'open', slotAssignment: 'manual'}

	override childConnectedCallback() {
		this.#queueSlotAssignment()
	}
	override childDisconnectedCallback() {
		this.#queueSlotAssignment()
	}

	override connectedCallback() {
		super.connectedCallback()
		this.#queueSlotAssignment()
	}

	@effect __hasEffect() {
		this.hasLegacyGeometry
		this.hasLegacyMaterial
		this.#queueSlotAssignment()
	}

	override template = () => html`
		<slot name="geometry" ref=${(el: HTMLSlotElement) => (this.#geometrySlot = el)}>
			${() => !this.hasLegacyGeometry && this._defaultGeometry()}
		</slot>

		<slot name="material" ref=${(el: HTMLSlotElement) => (this.#materialSlot = el)}>
			${() => !this.hasLegacyMaterial && this._defaultMaterial()}
		</slot>

		<slot ref=${(el: HTMLSlotElement) => (this.#defaultSlot = el)}></slot>
	`

	#geometrySlot: HTMLSlotElement | null = null
	#materialSlot: HTMLSlotElement | null = null
	#defaultSlot: HTMLSlotElement | null = null

	#slotAssignmentQueued = false

	/**
	 * Queue slot assignment to the next microtask.
	 * Not only is it important to queue slot assignment so that multiple effect
	 * or child connected callback runs don't trigger assignment logic too many
	 * times in the same tick, but this also ensures that slot fallback content
	 * is in place before we run assignment (otherwise fallback content in the
	 * template could be added *after* assignment and thus not get assigned in
	 * some browsers).
	 */
	#queueSlotAssignment() {
		if (!this.#slotAssignmentQueued) {
			this.#slotAssignmentQueued = true
			Classes.then(this.#updateSlotAssignment)
		}
	}

	/**
	 * We use manual slot assignment so that we don't have to explicitly mark
	 * all geometry and material behavior elements with slot attributes. Any
	 * elements that are geometry or material behavior elements get
	 * automatically slotted to respective slots to replace default geometry or
	 * material behaviors, while all other nodes get assigned to the default
	 * slot.
	 */
	#updateSlotAssignment = ({GeometryBehaviorEl, MaterialBehaviorEl}: Classes) => {
		this.#slotAssignmentQueued = false
		if (!this.isConnected) return

		let geom: Element | undefined
		let mat: Element | undefined
		const rest: (Element | Text)[] = []

		for (const child of this.childNodes) {
			if (child instanceof GeometryBehaviorEl) geom = child
			else if (child instanceof MaterialBehaviorEl) mat = child
			else if (child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.TEXT_NODE)
				rest.push(child as Element | Text)
		}

		if (!this.hasLegacyGeometry && geom) this.#geometrySlot?.assign(geom)
		else this.#geometrySlot?.assign() // assign slot fallback content

		if (!this.hasLegacyMaterial && mat) this.#materialSlot?.assign(mat)
		else this.#materialSlot?.assign() // assign slot fallback content

		this.#defaultSlot?.assign(...rest)
	}
}
