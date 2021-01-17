import 'element-behaviors'
import {reactive, autorun, attribute} from '@lume/element'
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial'
// @ts-ignore, no type def
import default_vertex from 'three/src/renderers/shaders/ShaderChunk/default_vertex.glsl'
// @ts-ignore, no type def
import default_fragment from 'three/src/renderers/shaders/ShaderChunk/default_fragment.glsl'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import MaterialTexture from './MaterialTexture'

export class ShaderMaterialBehavior extends MaterialTexture.mixin(BaseMaterialBehavior) {
	protected static _observedProperties = [
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
	@reactive
	@attribute
	get uniforms(): string | Record<string, any> | null {
		return this.__uniforms
	}
	set uniforms(u: string | Record<string, any> | null) {
		if (!u) {
			this.__uniforms = {}
			return
		}

		if (typeof u === 'string') {
			this.__uniforms = JSON.parse(u)
		} else {
			this.__uniforms = u
		}
	}

	private __uniforms: Record<string, any> = {}

	@reactive @attribute vertexShader = default_vertex
	@reactive @attribute fragmentShader = default_fragment

	protected _createComponent() {
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
