import {attribute, autorun, booleanAttribute, numberAttribute, reactive, stringAttribute, untrack} from '@lume/element'
import 'element-behaviors'
import {ExtrudeGeometry} from 'three/src/geometries/ExtrudeGeometry.js'
import {Shape} from 'three/src/extras/core/Shape.js'
import {ShapeGeometry} from 'three/src/geometries/ShapeGeometry.js'
import {GeometryBehavior} from './GeometryBehavior.js'
import {stringToNumberArray} from '../../meshes/utils.js'

import type {Geometry} from 'three/src/core/Geometry.js'

// Heart shape.
const defaultShape = new Shape()

defaultShape.moveTo(5, 5)
defaultShape.bezierCurveTo(5, 5, 4, 0, 0, 0)
defaultShape.bezierCurveTo(-6, 0, -6, 7, -6, 7)
defaultShape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19)
defaultShape.bezierCurveTo(12, 15.4, 16, 11, 16, 7)
defaultShape.bezierCurveTo(16, 7, 16, 0, 10, 0)
defaultShape.bezierCurveTo(7, 0, 5, 5, 5, 5)

const emptyShape = new Shape()

export type ShapeGeometryBehaviorAttributes =
	| 'shape'
	| 'curveSegments'
	| 'bevel'
	| 'bevelSegments'
	| 'bevelThickness'
	| 'centerGeometry'
	| 'fitment'

@reactive
export class ShapeGeometryBehavior extends GeometryBehavior {
	static _observedProperties = [
		'shape',
		'curveSegments',
		'bevel',
		'bevelSegments',
		'bevelThickness',
		'centerGeometry',
		'fitment',
		...(GeometryBehavior._observedProperties || []),
	]

	__shape = new Shape().copy(defaultShape)

	@attribute
	get shape(): Shape {
		return this.__shape
	}
	set shape(shape: string | null | Shape) {
		if (!shape) {
			this.__shape.copy(defaultShape)
		} else if (typeof shape === 'string') {
			const points = stringToNumberArray(shape, 'shape')

			if (points.length % 2 !== 0)
				throw new Error('shape path must have an even number of numbers, each pair of numbers being a point.')

			this.__shape.copy(emptyShape)

			this.__shape.moveTo(points[0], points[1])

			if (points.length > 2)
				for (let i = 2; i < points.length; i += 2) this.__shape.lineTo(points[i], points[i + 1])
		} else {
			// Three.js bug: Copying a shape from itself breaks, causes
			// its `curves` array to be empty. Without this, `<lume-shape>` will
			// not draw anything on screen initially until its `shape` is
			// modified.
			if (this.__shape !== shape) {
				this.__shape.copy(shape)
			}
		}

		this.__shape.updateArcLengths()
	}

	@numberAttribute(8) curveSegments = 8
	@booleanAttribute(false) bevel = false
	@numberAttribute(4) bevelSegments = 4
	@numberAttribute(4) bevelThickness = 4
	@booleanAttribute(true) centerGeometry = true

	/**
	 * @property {string} fitment - Determines how to fit a shape within the
	 * size area on X and Y. The Z size dictates the shape extrusion separately.
	 * This takes the same values as the object-fit CSS property, except global
	 * values. See https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit#values
	 * for details.
	 */
	@stringAttribute('none') fitment: 'none' | 'contain' | 'cover' | 'fill' | 'scale-down' = 'none'

	_createComponent() {
		let geometry: ExtrudeGeometry | ShapeGeometry

		if (this.element.calculatedSize.z === 0) {
			geometry = new ShapeGeometry(this.shape, this.curveSegments)
		} else {
			geometry = new ExtrudeGeometry(this.shape, {
				curveSegments: this.curveSegments,
				bevelSegments: this.bevelSegments,
				bevelThickness: this.bevelThickness,
				bevelEnabled: this.bevel,
				depth: this.element.calculatedSize.z,
			})
		}

		if (this.centerGeometry) geometry.center()

		// Make a Shape's Y coordinates go downward to match with LUME's coordinate system.
		// Negative scale throws a lot of things off, causing lighting not to work due to normals going the wrong direction.
		geometry.scale(1, -1, 1)
		// So we have to do the following to reverse the effects:
		handleInvertedGeometry(geometry)

		if (this.fitment === 'none') return geometry

		let minX = Number.MAX_VALUE
		let maxX = -Number.MAX_VALUE
		let minY = Number.MAX_VALUE
		let maxY = -Number.MAX_VALUE

		for (const vert of geometry.vertices) {
			minX = vert.x < minX ? vert.x : minX
			maxX = vert.x > maxX ? vert.x : maxX
			minY = vert.y < minY ? vert.y : minY
			maxY = vert.y > maxY ? vert.y : maxY
		}

		const shapeSizeX = maxX - minX
		const shapeSizeY = maxY - minY

		const scaleX = shapeSizeX / this.element.calculatedSize.x
		const scaleY = shapeSizeY / this.element.calculatedSize.y

		if (this.fitment === 'fill') {
			geometry.scale(1 / scaleX, 1 / scaleY, 1)
			return geometry
		}

		const shapeAspect = shapeSizeX / shapeSizeY
		const sizeAspect = this.element.calculatedSize.x / this.element.calculatedSize.y

		if (this.fitment === 'contain') {
			// tall
			if (shapeAspect < sizeAspect) {
				geometry.scale(1 / scaleY, 1 / scaleY, 1)
			}
			// wide (or equal)
			else {
				geometry.scale(1 / scaleX, 1 / scaleX, 1)
			}
		} else if (this.fitment === 'cover') {
			// tall
			if (shapeAspect < sizeAspect) {
				geometry.scale(1 / scaleX, 1 / scaleX, 1)
			}
			// wide (or equal)
			else {
				geometry.scale(1 / scaleY, 1 / scaleY, 1)
			}
		} else if (this.fitment === 'scale-down') {
			if (!(shapeSizeX <= this.element.calculatedSize.x && shapeSizeY <= this.element.calculatedSize.y)) {
				// tall
				if (shapeAspect < sizeAspect) {
					geometry.scale(1 / scaleY, 1 / scaleY, 1)
				}
				// wide (or equal)
				else {
					geometry.scale(1 / scaleX, 1 / scaleX, 1)
				}
			}
		}

		return geometry
	}

	loadGL(): boolean {
		if (!super.loadGL()) return false

		this._stopFns.push(
			autorun(() => {
				this.shape
				this.curveSegments
				this.bevel
				this.bevelSegments
				this.bevelThickness
				this.centerGeometry
				this.element.calculatedSize

				untrack(() => this.resetMeshComponent())
			}),
		)

		return true
	}
}

if (!elementBehaviors.has('shape-geometry')) elementBehaviors.define('shape-geometry', ShapeGeometryBehavior)

// Based on https://stackoverflow.com/questions/16824650/three-js-how-to-flip-normals-after-negative-scale
// TODO handle BufferGeometry too. We'll need to once we update Three.js to
// latest, which drops the old Geometry classes.
function handleInvertedGeometry(geometry: Geometry) {
	for (const face of geometry.faces) {
		// flip face normals
		// TODO It seems to work without modifying z. Is this ok?
		face.normal.x *= -1
		face.normal.y *= -1
		face.normal.z *= -1

		// change face winding order
		const temp = face.a
		face.a = face.c
		face.c = temp
	}

	// flip UV coordinates
	const faceVertexUvs = geometry.faceVertexUvs[0]
	for (let i = 0; i < faceVertexUvs.length; i++) {
		const temp = faceVertexUvs[i][0]
		faceVertexUvs[i][0] = faceVertexUvs[i][2]
		faceVertexUvs[i][2] = temp
	}

	// TODO Does anything else need update? Right now it doesn't matter, as
	// we're only using this on freshly-made geometries. When we optimize in the
	// future, we'd want to update geometries in place rather than always
	// replacing them, then this will matter.
	geometry.verticesNeedUpdate = true
	geometry.normalsNeedUpdate = true

	// If we use this on other geometries that need smoothing, this will apply:
	// TODO attribute to toggle flat shading
	// geometry.computeFaceNormals()
	// geometry.computeVertexNormals()
	// geometry.computeBoundingSphere()
}
