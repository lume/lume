import {stringAttribute} from '../../attribute.js'
import 'element-behaviors'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap'

export class BasicMaterialBehavior extends MaterialBehavior {
	@stringAttribute('') texture = ''
	@stringAttribute('') specularMap = ''

	override _createComponent() {
		return new MeshBasicMaterial({color: 0x00ff00})
	}

	override loadGL() {
		super.loadGL()

		this._handleTexture(
			() => this.texture,
			tex => {
				this.meshComponent!.map = tex
			},
		)
		this._handleTexture(
			() => this.specularMap,
			tex => {
				this.meshComponent!.specularMap = tex
			},
		)
	}
}

if (!elementBehaviors.has('basic-material')) elementBehaviors.define('basic-material', BasicMaterialBehavior)
