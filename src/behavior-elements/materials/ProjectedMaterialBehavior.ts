import {stringAttribute, element} from '@lume/element'
import {onCleanup, createEffect} from 'solid-js'
import {signal} from 'classy-solid'
import {ProjectedMaterial} from '@lume/three-projected-material/dist/ProjectedMaterial.js'
import {OrthographicCamera} from 'three/src/cameras/OrthographicCamera.js'
import {Texture} from 'three/src/textures/Texture.js'
import {PhysicalMaterialBehavior, type PhysicalMaterialBehaviorAttributes} from './PhysicalMaterialBehavior.js'
import {TextureProjector} from '../../../textures/TextureProjector.js'
import type {Element3D} from '../../../core/Element3D.js'
import {upwardRoots} from '../../../utils/upwardRoots.js'
import {querySelectorUpward} from '../../../utils/querySelectorUpward.js'
import {autoDefineElements} from '../../LumeConfig.js'

export type ProjectedMaterialBehaviorAttributes =
	| PhysicalMaterialBehaviorAttributes
	| 'textureProjectors'
	| 'projectedTextures' // deprecated

/**
 * @class ProjectedMaterialBehavior
 *
 * Element: `projected-material`
 *
 * A physical material with the added ability to have additional textures
 * projected onto it with
 * [`<lume-texture-projector>`](../../../textures/TextureProjector) elements.
 *
 * Project a texture onto a mesh using a `<lume-texture-projector>` and
 * this projected material on the mesh, with the texture being projected with a
 * camera-like mechanism. This is useful for displaying things on surfaces like
 * projected TV content or projector content.
 *
 * The `textureProjectors` attribute is used to point to one or more texture
 * projectors. The value is a selector string using the same query syntax as
 * [`document.querySelectorAll()`](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll#Syntax).
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = projectedMaterialExample
 * </script>
 *
 * @extends PhysicalMaterialBehavior
 * @element projected-material
 */
export
@element('projected-material', autoDefineElements)
class ProjectedMaterialBehavior extends PhysicalMaterialBehavior {
	#textureProjectorsRaw: string | Array<TextureProjector | string> = ''

	/** The currently-found texture projector element(s). */
	@signal private textureProjectorsFromSelector: TextureProjector[] = []

	/**
	 * @property {string | TextureProjector[]} textureProjectors - A CSS selector
	 * that points to one or more `<lume-texture-projector>` elements to use for
	 * texture projection on this material. If a CSS selector matches an element
	 * that is not a `<lume-texture-projector>`, it is ignored (note that
	 * non-upgraded elements will not be detected, make sure to load element
	 * definitions up front which is the default if you're simply importing
	 * `lume`).
	 * If a selector matches
	 * more than one element, only the first `<lume-texture-projector>` will be used
	 * (in the near future we will allow multiple projectors to project).
	 *
	 * ```html
	 * <lume-box has="projected-material" texture-projectors=".foo, .bar, #baz"></lume-box>
	 * ```
	 *
	 * The `textureProjectors` JS property can be set with a string of comma
	 * separated selectors, or a mixed array of strings (selectors) or
	 * `<lume-texture-projector>` element instances, making the JS property more
	 * flexible for scenarios where selectors are not enough (f.e. maybe you
	 * need to get a reference to an element from some other part of the DOM,
	 * perhaps from a tree inside a ShadowRoot, or you are programmatically
	 * creating elements, etc).
	 *
	 * ```js
	 * el.textureProjectors = ".some-texture-projector"
	 * // or
	 * const projector = document.querySelector('.some-texture-projector')
	 * el.textureProjectors = [projector, "#someOtherTextureProjector"]
	 * ```
	 *
	 * Texture projectors that are not in the composed tree (i.e. not
	 * participating in rendering) will be ignored.  The texture projectors that
	 * will be associated are those that are connected into the document, and
	 * that participate in rendering (i.e.  composed, either in the top level
	 * document, in a ShadowRoot, or distributed to a slot in a ShadowRoot).
	 * This is the same as with the browser's built-in elements: a `<div>`
	 * element that is connected into the DOM but not slotted to its parent's
	 * `.shadowRoot` will not participate in the visual output.
	 */
	@stringAttribute get textureProjectors(): string | Array<TextureProjector | string> {
		return this.#textureProjectorsRaw
	}
	@stringAttribute set textureProjectors(value: string | Array<TextureProjector | string>) {
		this.#textureProjectorsRaw = value
	}

	/**
	 * @deprecated
	 * @property {string | Array<TextureProjector | string | null>} projectedTextures
	 *
	 * `string attribute`
	 *
	 * *deprecated*: renamed to [`.textureProjectors`](#textureprojectors).
	 */
	@stringAttribute get projectedTextures() {
		return this.textureProjectors
	}
	@stringAttribute set projectedTextures(value) {
		this.textureProjectors = value
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

	override connectedCallback() {
		super.connectedCallback()

		let queuedRequery = false

		this.#observer = new MutationObserver(() => {
			if (queuedRequery) return

			queuedRequery = true

			// Use a timeout for batching so this doesn't run a ton of times during DOM parsing.
			setTimeout(() => {
				queuedRequery = false

				// TODO this could be more efficient if we check the added nodes directly, but for now we re-run the query logic.
				// This triggers the setter logic.
				this.textureProjectors = this.#textureProjectorsRaw
			}, 0)
		})

		for (const root of upwardRoots(this.parentElement!)) this.#observer.observe(root, {childList: true, subtree: true})

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			const three = this.parentElement!.three
			if (three.material !== mat) return

			createEffect(() => {
				this.textureProjectors

				let array: Array<TextureProjector | string> = []

				if (typeof this.#textureProjectorsRaw === 'string') {
					array = [this.#textureProjectorsRaw.trim()]
				} else if (Array.isArray(this.#textureProjectorsRaw)) {
					array = this.#textureProjectorsRaw
				} else {
					throw new TypeError('Invalid value for textureProjectors')
				}

				// Make sure selectors are not empty before we process them.
				array = array.filter(selector => selector && selector.toString().trim())

				let newProjectors: TextureProjector[] = []

				for (let i = 0; i < array.length; i += 1) {
					const item = array[i]!

					if (typeof item === 'string') {
						const projectors = this.parentElement!.scene.querySelectorAll(item) as unknown as TextureProjector[]

						for (const projector of projectors) {
							if (!(projector instanceof TextureProjector)) continue
							newProjectors.push(projector)
						}
					} else if (item instanceof TextureProjector) {
						newProjectors.push(item)
					}
				}

				this.textureProjectorsFromSelector = newProjectors
			})
		})

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			const projectors = this.textureProjectorsFromSelector

			onCleanup(() => mat.dispose())

			// For now, only the first projector.
			const projector = projectors[0]

			if (!projector) return

			mat.project(projector.three as Texture, (projector.camera.three as OrthographicCamera).matrixWorldInverse, projector.camera.three.projectionMatrix)

			this.parentElement!.needsUpdate()
		})
	}

	override disconnectedCallback() {
		super.disconnectedCallback()
		this.#observer?.disconnect()
		this.#observer = null
	}
}