import 'element-behaviors'
import {reactive, autorun, attribute} from '@lume/element'
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial.js'
// @ts-ignore, no type def
import default_vertex from 'three/src/renderers/shaders/ShaderChunk/default_vertex.glsl.js'
// @ts-ignore, no type def
import default_fragment from 'three/src/renderers/shaders/ShaderChunk/default_fragment.glsl.js'
import {BaseMaterialBehavior} from './BaseMaterialBehavior.js'
import {MaterialTexture} from './MaterialTexture.js'

@reactive
export class ShaderMaterialBehavior extends MaterialTexture(BaseMaterialBehavior) {
	static _observedProperties = [
		'uniforms',
		'vertexShader',
		'fragmentShader',
		...BaseMaterialBehavior._observedProperties,
	]

	// TODO: Perhaps instead of accepting string objects for HTML attributes,
	// we can create specific uniform-foo attributes for each uniform, and have
	// specific data handling and type definitions for each one. This would
	// make it easier to animate particular uniforms instead of replacing the
	// whole object each time.
	@attribute
	get uniforms(): string | Record<string, any> | null {
		return this.#uniforms
	}
	set uniforms(u: string | Record<string, any> | null) {
		if (!u) {
			this.#uniforms = {}
			return
		}

		if (typeof u === 'string') {
			this.#uniforms = JSON.parse(u)
		} else {
			this.#uniforms = u
		}
	}

	#uniforms: Record<string, any> = {}

	@attribute vertexShader = default_vertex
	@attribute fragmentShader = default_fragment

	_createComponent() {
		return new ShaderMaterial({
			uniforms: this.uniforms as Record<string, any>,
			vertexShader: this.vertexShader || default_vertex,
			fragmentShader: this.fragmentShader || default_fragment,
		})
	}

	loadGL() {
		if (!super.loadGL()) return false

		this._stopFns.push(
			autorun(() => {
				const mat = this.getMeshComponent<ShaderMaterial>('material')

				mat.uniforms = this.uniforms as Record<string, any>
				mat.vertexShader = this.vertexShader || default_vertex
				mat.fragmentShader = this.fragmentShader || default_fragment

				this.element.needsUpdate()
			}),
		)

		return true
	}
}

elementBehaviors.define('shader-material', ShaderMaterialBehavior)
