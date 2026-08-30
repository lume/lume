import {booleanAttribute, numberAttribute, stringAttribute, element, type ElementAttributes} from '@lume/element'
import {PointsMaterial as ThreePointsMaterial} from 'three/src/materials/PointsMaterial.js'
import {MaterialBehaviorEl, type MaterialBehaviorElAttributes} from './MaterialBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type PointsMaterialAttributes = MaterialBehaviorElAttributes | 'texture' | 'sizeAttenuation' | 'pointSize'

/**
 * @class PointsMaterial -
 *
 * Element: `<lume-points-material>`
 *
 * @extends MaterialBehaviorEl
 * @element lume-points-material
 */
export
@element('lume-points-material', autoDefineElements)
class PointsMaterial extends MaterialBehaviorEl {
	/**
	 * @property {string} texture - The URL of a color texture to use for the
	 * points.  Defaults to an empty string, which means no texture.
	 */
	@stringAttribute texture = ''

	/**
	 * @property {boolean} sizeAttenuation - Whether the size of the points is
	 * attenuated by the camera depth (i.e. whether the points have a size in 3D
	 * space, rather than in screen pixels). Defaults to `false`.
	 */
	@booleanAttribute sizeAttenuation = false

	/**
	 * @property {number} pointSize - The size of the points. Defaults to `1`
	 * CSS pixel.
	 */
	@numberAttribute pointSize = 1

	// TODO we need a devicePixelRatio signal to make the default value reactive
	// (f.e. across monitors with different ratios)
	// hardwareSized = false

	override _createComponent() {
		return new ThreePointsMaterial({color: 0x00ff00})
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.sizeAttenuation = this.sizeAttenuation
			mat.size = this.pointSize

			parent.needsUpdate()
		})

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
			'lume-points-material': ElementAttributes<PointsMaterial, PointsMaterialAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-points-material': PointsMaterial
	}
}
