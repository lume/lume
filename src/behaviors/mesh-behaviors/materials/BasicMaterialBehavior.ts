import 'element-behaviors'
import {stringAttribute} from '@lume/element'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap'

export
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
			() => {},
			true,
		)
		this._handleTexture(
			() => this.specularMap,
			(mat, tex) => (mat.specularMap = tex),
			mat => !!mat.specularMap,
			() => {},
			true,
		)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('basic-material'))
	elementBehaviors.define('basic-material', BasicMaterialBehavior)
