import 'element-behaviors'
import {untrack} from 'solid-js'
import {attribute, stringAttribute} from '@lume/element'
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial.js'
// @ts-ignore, no type def
import default_vertex from 'three/src/renderers/shaders/ShaderChunk/default_vertex.glsl.js'
// @ts-ignore, no type def
import default_fragment from 'three/src/renderers/shaders/ShaderChunk/default_fragment.glsl.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type ShaderMaterialBehaviorAttributes =
	| MaterialBehaviorAttributes
	| 'uniforms'
	| 'vertexShader'
	| 'fragmentShader'

export
@behavior
class ShaderMaterialBehavior extends MaterialBehavior {
	// TODO: Perhaps instead of accepting string objects for HTML attributes,
	// we can create specific uniform-foo attributes for each uniform, and have
	// specific data handling and type definitions for each one. This would
	// make it easier to animate particular uniforms instead of replacing the
	// whole object each time.
	@attribute
	@receiver
	get uniforms(): Record<string, any> {
		return this.#uniforms
	}
	set uniforms(u: string | Record<string, any> | null) {
		if (!u) {
			this.#uniforms = {}
			return
		}

		if (typeof u === 'string') {
			try {
				this.#uniforms = JSON.parse(u)
			} catch (e) {
				console.warn('Unparsable uniform value:', u)
			}
		} else {
			this.#uniforms = u
		}
	}

	#uniforms: Record<string, any> = {}

	@stringAttribute @receiver vertexShader = default_vertex
	@stringAttribute @receiver fragmentShader = default_fragment

	override _createComponent() {
		// untrack, we subsequently update the properties using an effect.
		return untrack(() => {
			return new ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: this.vertexShader,
				fragmentShader: this.fragmentShader,
			})
		})
	}

	override connectedCallback() {
		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.uniforms = this.uniforms
			mat.vertexShader = this.vertexShader || default_vertex
			mat.fragmentShader = this.fragmentShader || default_fragment

			mat.needsUpdate = true
			this.element.needsUpdate()
		})

		super.connectedCallback()
	}
}

if (globalThis.window?.document && !elementBehaviors.has('shader-material'))
	elementBehaviors.define('shader-material', ShaderMaterialBehavior)
