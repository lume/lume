import 'element-behaviors'
import {stringAttribute} from '@lume/element'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap'

export {BasicMaterialBehavior}
@behavior
class BasicMaterialBehavior extends MaterialBehavior {
	@stringAttribute @receiver texture = ''
	@stringAttribute @receiver specularMap = ''

	override _createComponent() {
		return new MeshBasicMaterial()
	}

	override loadGL() {
		super.loadGL()

		this._handleTexture(
			() => this.texture, // map
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
		)
		this._handleTexture(
			() => this.specularMap,
			(mat, tex) => (mat.specularMap = tex),
			mat => !!mat.specularMap,
		)
	}
}

if (!elementBehaviors.has('basic-material')) elementBehaviors.define('basic-material', BasicMaterialBehavior)
