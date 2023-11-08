import 'element-behaviors'
import {ProjectedMaterial} from '@lume/three-projected-material/dist/ProjectedMaterial.js'
import {OrthographicCamera} from 'three/src/cameras/OrthographicCamera.js'
import {onCleanup, createEffect} from 'solid-js'
import {Texture} from 'three/src/textures/Texture.js'
import {stringAttribute} from '@lume/element'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {PhysicalMaterialBehavior, type PhysicalMaterialBehaviorAttributes} from './PhysicalMaterialBehavior.js'
import {TextureProjector} from '../../../textures/TextureProjector.js'

export type ProjectedMaterialBehaviorAttributes = PhysicalMaterialBehaviorAttributes | 'projectedTextures'

/**
 * @class ProjectedMaterialBehavior
 *
 * Behavior: `projected-material`
 *
 * A physical material with the added ability to have additional textures
 * projected onto it with
 * [`<lume-texture-projector>`](../../../textures/TextureProjector) elements.
 *
 * @extends PhysicalMaterialBehavior
 */
export {ProjectedMaterialBehavior}
@behavior
class ProjectedMaterialBehavior extends PhysicalMaterialBehavior {
	#projectedTextures: Array<TextureProjector> = []
	#rawProjectedTextures: string | Array<TextureProjector | string> = []

	/**
	 * @property {string | Array<TextureProjector | string | null>} projectedTextures
	 *
	 * *string attribute*
	 *
	 * Default: `[]`
	 *
	 * The corresponding `clip-planes` attribute accepts one or more selectors,
	 * comma separated, that define which
	 * [`<lume-clip-plane>`](../../core/TextureProjector) elements are to be used as
	 * clip planes. If a selector matches an element that is not a
	 * `<lume-clip-plane>`, it is ignored. If a selector matches more than one
	 * element, all of them that are clip planes are used.
	 *
	 * ```html
	 * <lume-box has="clip-planes" clip-planes=".foo, .bar, #baz"></lume-box>
	 * ```
	 *
	 * The property can also be set with a string (comma separated selectors),
	 * or a mixed array of strings (selectors) or `<lume-clip-plane>` element
	 * instances.
	 *
	 * ```js
	 * el.projectedTextures = ".some-projected-texture"
	 * // or
	 * const plane = document.querySelector('.some-projected-texture')
	 * el.projectedTextures = [plane, "#someOtherTexture"]
	 * ```
	 *
	 * The property getter returns the currently applicable collection of
	 * `<lume-clip-plane>` instances, not the original string or array of values
	 * passed into the attribute or setter. Applicable planes are those that are
	 * connected into the document, and that participate in rendering (composed,
	 * either in the top level document, in a ShadowRoot, or distributed to a
	 * slot in a ShadowRoot).
	 */
	@stringAttribute
	@receiver
	get projectedTextures(): Array<TextureProjector> {
		return this.#projectedTextures
	}
	set projectedTextures(value: string | Array<TextureProjector | string>) {
		this.#rawProjectedTextures = value

		let array: Array<TextureProjector | string> = []

		if (typeof value === 'string') {
			array = [value.trim()]
		} else if (Array.isArray(value)) {
			array = value
		} else {
			throw new TypeError('Invalid value for projectedTextures')
		}

		this.#projectedTextures = []

		for (const v of array) {
			if (typeof v !== 'string') {
				// TODO #279: This .projectedTextures setter non-reactive to v.scene, so it will
				// not update if the element becomes composed into a Lume scene.
				if (v instanceof TextureProjector && v.scene) this.#projectedTextures.push(v)
				continue
			} else if (!v) {
				// skip empty strings, they cause an error with querySelectorAll
				continue
			}

			let root = this.element.getRootNode() as Document | ShadowRoot | null

			// TODO Should we not search up the composed tree, and stay only
			// in the current ShadowRoot?

			while (root) {
				const els = root.querySelectorAll(v)

				for (let i = 0, l = els.length; i < l; i += 1) {
					const el = els.item(i)

					if (!el) continue

					// Find only planes participating in rendering (i.e. in the
					// composed tree, noting that .scene is null when not
					// composed)
					// TODO #279: This .projectedTextures setter non-reactive to el.scene, so it will
					// not update if the element becomes composed into a Lume scene.
					if (el instanceof TextureProjector && el.scene) this.#projectedTextures.push(el)

					// TODO We aren't observing el.scene, so if the element
					// becomes a particpant in the scene later nothing will
					// happen.
					// TODO If an element was not yet upgraded, it will not
					// be found here. We need to wait for upgrade.
					// TODO We need to also react to added/removed elements.
				}

				root = root instanceof ShadowRoot ? (root.host.getRootNode() as Document | ShadowRoot) : null
			}
		}
	}

	override _createComponent() {
		// TODO multiple projected textures.
		// Only one projected texture for now. Handling a material array is
		// needed for multiple projections, unless we update ProjectedMaterial
		// to supported multiple textures/cameras so that we can have a single
		// material. Probably the mat.project and mat.updateFromCamera methods
		// should accept a camera from the outside rather than using one that is
		// contained in the material.
		return new ProjectedMaterial()
	}

	#observer: MutationObserver | null = null

	override loadGL() {
		super.loadGL()

		let queuedRequery = false

		// loadGL may fire during parsing before children exist. This
		// MutationObserver will also fire during parsing. This allows us to
		// re-run the query logic whenever DOM in the current root changes.
		//
		// TODO we need to observe all the way up the composed tree, or we
		// should make the querying scoped only to the nearest root, for
		// consistency. This covers most cases, for now.
		this.#observer = new MutationObserver(() => {
			if (queuedRequery) return

			queuedRequery = true

			// Use a timeout for batching so this doesn't run a ton of times during DOM parsing.
			setTimeout(() => {
				queuedRequery = false

				// TODO this could be more efficient if we check the added nodes directly, but for now we re-run the query logic.
				// This triggers the setter logic.
				this.projectedTextures = this.#rawProjectedTextures
			}, 0)
		})

		this.#observer.observe(this.element.getRootNode(), {childList: true, subtree: true})

		this._handleTexture(
			() => this.projectedTextures[0]?.src ?? '',
			(mat, tex) => (mat.texture = tex || new Texture()),
			mat => !!mat.texture,
			() => {},
			true,
		)

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			const three = this.element.three
			if (three.material !== mat) return

			createEffect(() => {
				const tex = this.projectedTextures[0]
				if (!tex) return

				createEffect(() => {
					mat.fitment = tex.fitment
					mat.frontFacesOnly = tex.frontFacesOnly
					this.element.needsUpdate()
				})
			})

			createEffect(() => {
				const tex = this.projectedTextures[0]
				if (!tex) return

				// if the camera changes
				const cam = tex._camera
				if (!cam) return

				if (three.material !== mat) return

				mat.camera = cam
				mat.updateFromCamera()
				mat.project(three as any, false)

				this.element.needsUpdate()

				// Do we need this?
				onCleanup(() => {
					const mat = this.meshComponent

					// If the whole behavior was cleaned up, mat will be undefined
					// here due to #disposeMeshComponent in the base class onCleanup
					if (!mat) return

					if (three.material !== mat) return

					mat.camera = new OrthographicCamera(0.00000001, 0.00000001, 0.00000001, 0.00000001)
					mat.updateFromCamera()
					mat.project(three as any, false)

					this.element.needsUpdate()
				})
			})

			createEffect(() => {
				const tex = this.projectedTextures[0]
				if (!tex) return

				createEffect(() => {
					tex.calculatedSize // dependency

					mat.updateFromCamera() // needed because the size of the texture projector affects the camera projection
					this.element.needsUpdate()
				})
			})

			createEffect(() => {
				if (three.material !== mat) return

				// triggered when this.element has its world matrix updated.
				this.element.version
				mat.project(three as any, false)
			})

			createEffect(() => {
				console.log('> meshComponent effect', this.element.tagName + '#' + this.element.id)

				const tex = this.projectedTextures[0]
				if (!tex) return

				createEffect(() => {
					if (three.material !== mat) return

					// triggered when tex has its world matrix updated, which
					// transforms the camera we use for texture projection.
					tex.version
					mat.project(three as any, false)
					this.element.needsUpdate() // The texture element updated, so make sure this.element does too.
				})
			})
		})
	}

	override unloadGL(): void {
		super.unloadGL()

		this.#observer?.disconnect()
		this.#observer = null
	}
}

if (globalThis.window?.document && !elementBehaviors.has('projected-material'))
	elementBehaviors.define('projected-material', ProjectedMaterialBehavior)
