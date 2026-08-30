import {stringAttribute, element, type ElementAttributes} from '@lume/element'
import {LineBasicMaterial} from 'three/src/materials/LineBasicMaterial.js'
import {MaterialBehaviorEl, type MaterialBehaviorElAttributes} from './MaterialBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type BasiclineMaterialAttributes = MaterialBehaviorElAttributes | 'texture'

/**
 * @class BasiclineMaterial -
 *
 * Element: `<lume-basicline-material>`
 *
 * This is the default material behavior for
 * [`<lume-line>`](../../../meshes/Line.md) elements. It renders a series of
 * points as a simple colored line, optionally with a texture for coloring. It is
 * backed by Three.js `LineBasicMaterial` underneath. This is typically paired with
 * [`LineGeometryBehavior`](../geometries/LineGeometryBehavior.md).
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = lineExample
 * </script>
 *
 * @extends MaterialBehaviorEl
 * @element lume-basicline-material
 */
@element('lume-basicline-material', autoDefineElements)
export class BasiclineMaterial extends MaterialBehaviorEl {
	/**
	 * @property {string} texture - A texture to set color along the line.
	 * Useful when supplying UVs to the geometry being used along with this
	 * material. Most likely you'll supply UVs by copying data from a modeling
	 * program like Blender, probably not something you'd program manually.
	 */
	@stringAttribute texture = ''

	override _createComponent() {
		return new LineBasicMaterial()
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		this._handleTexture(
			() => this.texture,
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
			() => {},
			true,
		)
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-basicline-material': ElementAttributes<BasiclineMaterial, BasiclineMaterialAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-basicline-material': BasiclineMaterial
	}
}
