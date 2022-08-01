import 'element-behaviors'
import {reactive, attribute, stringAttribute} from '../../attribute.js'
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial.js'
// @ts-ignore, no type def
import default_vertex from 'three/src/renderers/shaders/ShaderChunk/default_vertex.glsl.js'
// @ts-ignore, no type def
import default_fragment from 'three/src/renderers/shaders/ShaderChunk/default_fragment.glsl.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {untrack} from 'solid-js'

export type ShaderMaterialBehaviorAttributes =
	| MaterialBehaviorAttributes
	| 'uniforms'
	| 'vertexShader'
	| 'fragmentShader'

@reactive
export class ShaderMaterialBehavior extends MaterialBehavior {
	// TODO: Perhaps instead of accepting string objects for HTML attributes,
	// we can create specific uniform-foo attributes for each uniform, and have
	// specific data handling and type definitions for each one. This would
	// make it easier to animate particular uniforms instead of replacing the
	// whole object each time.
	@attribute
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

	@stringAttribute(default_vertex) vertexShader = default_vertex
	@stringAttribute(default_fragment) fragmentShader = default_fragment

	override _createComponent() {
		// untrack because we update the properties on the material instance in the effect in loadGL
		return untrack(() => {
			return new ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: this.vertexShader,
				fragmentShader: this.fragmentShader,
			})
		})
	}

	override loadGL() {
		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.uniforms = this.uniforms as Record<string, any>
			mat.vertexShader = this.vertexShader || default_vertex
			mat.fragmentShader = this.fragmentShader || default_fragment

			mat.needsUpdate = true
			this.element.needsUpdate()
		})

		super.loadGL()
	}
}

if (!elementBehaviors.has('shader-material')) elementBehaviors.define('shader-material', ShaderMaterialBehavior)
