import {booleanAttribute, element, numberAttribute, type ElementAttributes} from '@lume/element'
import {Shape} from 'three/src/extras/core/Shape.js'
import {ExtrudeGeometry} from 'three/src/geometries/ExtrudeGeometry.js'
import {ShapeGeometry} from 'three/src/geometries/ShapeGeometry.js'
import {GeometryBehaviorEl} from './GeometryBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

import type {BufferGeometry} from 'three/src/core/BufferGeometry.js'

export type RoundedrectGeometryAttributes = 'cornerRadius' | 'thickness' | 'quadraticCorners'

/**
 * @class RoundedRectangleGeometry -
 *
 * Element: `<lume-roundedrect-geometry>`
 *
 * @extends GeometryBehaviorEl
 * @element lume-roundedrect-geometry
 */
export
@element('lume-roundedrect-geometry', autoDefineElements)
class RoundedrectGeometry extends GeometryBehaviorEl {
	@numberAttribute cornerRadius = 0
	@numberAttribute thickness = 0
	@booleanAttribute quadraticCorners = false

	override _createComponent() {
		let thickness = this.thickness
		let geom: BufferGeometry

		const roundedRectShape = new RoundedRectShape(
			0,
			0,
			this.composedParent!.calculatedSize.x,
			this.composedParent!.calculatedSize.y,
			this.cornerRadius,
			this.quadraticCorners,
		)

		if (thickness > 0) {
			geom = new ExtrudeGeometry(roundedRectShape, {
				bevelEnabled: true,
				steps: 1,
				bevelSegments: 1,
				bevelSize: 0,
				bevelThickness: 0,
				depth: thickness,
			})
		} else {
			geom = new ShapeGeometry(roundedRectShape)
		}

		geom.translate(
			-this.composedParent!.calculatedSize.x / 2,
			-this.composedParent!.calculatedSize.y / 2,
			-thickness / 2,
		)

		return geom
	}
}

// Based on Three.js example: https://github.com/mrdoob/three.js/blob/159a40648ee86755220491d4f0bae202235a341c/examples/webgl_geometry_shapes.html#L237
class RoundedRectShape extends Shape {
	constructor(x: number, y: number, width: number, height: number, radius: number, quadraticCorners = false) {
		super()

		if (quadraticCorners) {
			// Quadratic corners (can look better, more bubbly)
			this.moveTo(x, y + radius)
			this.lineTo(x, y + height - radius)
			this.quadraticCurveTo(x, y + height, x + radius, y + height)
			this.lineTo(x + width - radius, y + height)
			this.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
			this.lineTo(x + width, y + radius)
			this.quadraticCurveTo(x + width, y, x + width - radius, y)
			this.lineTo(x + radius, y)
			this.quadraticCurveTo(x, y, x, y + radius)

			return
		}

		// Circular corners (matches DOM's rounded borders)
		this.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false)
		this.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false)
		this.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false)
		this.absarc(x + radius, y + radius, radius, Math.PI, Math.PI + Math.PI / 2, false)
		this.lineTo(x + width - radius, y) // complete the loop
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-roundedrect-geometry': ElementAttributes<RoundedrectGeometry, RoundedrectGeometryAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-roundedrect-geometry': RoundedrectGeometry
	}
}
