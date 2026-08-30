import {untrack} from 'solid-js'
import {attribute, stringAttribute, element, type ElementAttributes} from '@lume/element'
import {ShaderMaterial as ThreeShaderMaterial} from 'three/src/materials/ShaderMaterial.js'
// @ts-ignore, no type def
import default_vertex from 'three/src/renderers/shaders/ShaderChunk/default_vertex.glsl.js'
// @ts-ignore, no type def
import default_fragment from 'three/src/renderers/shaders/ShaderChunk/default_fragment.glsl.js'
import {MaterialBehaviorEl, type MaterialBehaviorElAttributes} from './MaterialBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type ShaderMaterialAttributes = MaterialBehaviorElAttributes | 'uniforms' | 'vertexShader' | 'fragmentShader'

/**
 * @class ShaderMaterial
 *
 * Element: `<lume-shader-material>`
 *
 * This behavior allows you to define custom vertex and fragment shaders for a mesh,
 * using Three.js's `ShaderMaterial` under the hood. You can also pass in custom uniforms
 * as a JSON object or string.
 *
 * @extends MaterialBehaviorEl
 * @element lume-shader-material
 */
export
@element('lume-shader-material', autoDefineElements)
class ShaderMaterial extends MaterialBehaviorEl {
	// TODO: Perhaps instead of accepting string objects for HTML attributes,
	// we can create specific uniform-foo attributes for each uniform, and have
	// specific data handling and type definitions for each one. This would
	// make it easier to animate particular uniforms instead of replacing the
	// whole object each time.
	@attribute get uniforms(): Record<string, any> {
		return this.#uniforms
	}
	@attribute set uniforms(u: string | Record<string, any> | null) {
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

	@stringAttribute vertexShader = default_vertex
	@stringAttribute fragmentShader = default_fragment

	override _createComponent() {
		// untrack, we subsequently update the properties using an effect.
		return untrack(() => {
			return new ThreeShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: this.vertexShader,
				fragmentShader: this.fragmentShader,
			})
		})
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.uniforms = this.uniforms
			mat.vertexShader = this.vertexShader || default_vertex
			mat.fragmentShader = this.fragmentShader || default_fragment

			mat.needsUpdate = true
			parent.needsUpdate()
		})
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-shader-material': ElementAttributes<ShaderMaterial, ShaderMaterialAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-shader-material': ShaderMaterial
	}
}
