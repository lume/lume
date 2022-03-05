import {booleanAttribute, numberAttribute, reactive, stringAttribute, untrack} from '../../attribute.js'
import {attribute} from '../../attribute.js'
import 'element-behaviors'
import {ExtrudeGeometry} from 'three/src/geometries/ExtrudeGeometry.js'
import {Shape} from 'three/src/extras/core/Shape.js'
import {ShapeGeometry} from 'three/src/geometries/ShapeGeometry.js'
import {ShapePath} from 'three/src/extras/core/ShapePath.js'
import {Vector2} from 'three/src/math/Vector2.js'
import {GeometryBehavior} from './GeometryBehavior.js'
import {stringToNumberArray} from '../../../meshes/utils.js'

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

const isPathStringRe = /^[mlhvcsqtaz][^a-z]/i

export type ShapeGeometryBehaviorAttributes =
	| 'shape'
	| 'curveSegments'
	| 'bevel'
	| 'bevelSegments'
	| 'bevelThickness'
	| 'centerGeometry'
	| 'fitment'

/**
@class ShapeGeometryBehavior -

Provides a 2D extrudable shape geometry for mesh
elements. The [`<lume-shape>`](../../meshes/Shape.md) element has this behavior
on it by default.

The shape defined by the [`shape`](#shape) attribute property will be centered within the
size space defined by the host element's `size` and `sizeMode` attribute
properties.

To extrude the shape, set the host element's Z size to the amount of desired
extrusion. If the host element Z size is zero, the shape will be flat and 2D
only.

<div id="exampleContainer"></div>
<script>
  new Vue({
    el: '#exampleContainer',
    template: '<live-code class="full" :template="code" :autorun="true" mode="html>iframe" />',
    data: { code: shapesExample },
  })
</script>
*/
@reactive
export class ShapeGeometryBehavior extends GeometryBehavior {
	__shape = new Shape().copy(defaultShape)

	/**
	 * @property {string | number[] | THREE.Shape | null} shape - Defines the 2D shape to render.
	 *
	 * Reading the property always returns an underlying
	 * [THREE.Shape](https://threejs.org/docs/index.html?q=shape#api/en/extras/core/Shape)
	 * object.
	 *
	 * Setting the property accepts `string`, `number[]`, `null`, or
	 * `THREE.Shape` values. All values are mapped to a single `THREE.Shape`
	 * property (the one returned by the getter).
	 *
	 * While setting the property triggers reactivity, modifying the
	 * `THREE.Shape` returned by the getter does not. In such a case, we can
	 * execute `el.shape = el.shape` to trigger reactivity.
	 * <!-- TODO investigate using Solid createMutable to make the THREE.Shape reactive. -->
	 *
	 * A string value should be a list of numbers separated by any amount space
	 * (commas are optional, for organizational use), every two numbers forming
	 * one point in the 2D shape. Similar to the rest of LUME's coordinate
	 * system, +X goes rightward, and +Y goes downward.
	 *
	 * An array of numbers is similar to the string value: every two numbers
	 * form a point in the shape.
	 * <!-- TODO investigate reacting to reactive arrays -->
	 *
	 * If the string or number array have no points, the default shape is rendered.
	 *
	 * A `THREE.Shape` value will have its data copied to the underlying
	 * `THREE.Shape` returned by the getter, and does not replace the underlying
	 * `THREE.Shape` object.
	 * <!-- TODO perhaps the getter should always return the value the user set, and not expose the internal `THREE.Shape` -->
	 *
	 * A value of `null` (or when the attribute is removed) causes the
	 * default shape to be rendered.
	 */
	@attribute
	get shape(): Shape {
		return this.__shape
	}
	set shape(shape: string | number[] | Shape | null) {
		if (!shape) {
			this.__shape.copy(defaultShape)
		} else if (
			typeof shape === 'string' &&
			(shape = shape.trim()) && // skip empty string here
			shape.match(isPathStringRe)
		) {
			const shapePath = parseSvgPathDAttribute(shape)

			// TODO This supports only one solid shape for now.
			this.__shape.copy(shapePath.toShapes(true)[0] ?? defaultShape)
		} else if (typeof shape === 'string' && !shape.match(/^[0-9]/)) {
			// TODO query selector for <path> element from which to get a `d` attribute.
			console.error('Unsupported shape path: ', shape)
			this.__shape.copy(defaultShape)
		} else if (typeof shape === 'string' || Array.isArray(shape)) {
			const points: number[] = typeof shape === 'string' ? stringToNumberArray(shape, 'shape') : shape

			if (!points.length) {
				this.__shape.copy(defaultShape)
			} else {
				if (points.length % 2 !== 0)
					throw new Error(
						'shape path must have an even number of numbers, each pair of numbers being a point.',
					)

				this.__shape.copy(emptyShape)
				this.__shape.moveTo(points[0], points[1])

				if (points.length > 2)
					for (let i = 2; i < points.length; i += 2) this.__shape.lineTo(points[i], points[i + 1])
			}
		} else {
			// Three.js bug: Copying a shape from itself breaks, causing
			// its `curves` array to be empty. Without this, `<lume-shape>` will
			// not draw anything on screen initially until its `shape` is
			// modified.
			if (this.__shape !== shape) {
				this.__shape.copy(shape)
			}
		}

		this.__shape.updateArcLengths()
	}

	/**
	 * @property {number} curveSegments - The number of lines per curve withing
	 * the shape. The higher the number, the smoother the shape at the cost of
	 * render time.
	 * @default 8
	 */
	@numberAttribute(8) curveSegments = 8
	/**
	 * @property {boolean} bevel - When the shape is extruded, enables rounding
	 * of the shape edges.
	 * @default false
	 */
	@booleanAttribute(false) bevel = false
	/**
	 * @property {number} bevelSegments - When the shape is extruded, determines
	 * the number of sections for the bevel. A higher number makes the model
	 * look smoother, but cost more time to render.
	 * @default 4
	 */
	@numberAttribute(4) bevelSegments = 4
	/**
	 * @property {number} bevelThickness - When the shape is extruded,
	 * determines the thickness of the bevel. Roughly like the amount of
	 * radius for the rounded edges.
	 * @default 4
	 */
	@numberAttribute(4) bevelThickness = 4
	/**
	 * @property {boolean} centerGeometry - When true, centers the shape geometry
	 * within the host element's size space.
	 * @default true
	 */
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

	loadGL() {
		super.loadGL()

		this.createEffect(() => {
			this.shape
			this.curveSegments
			this.bevel
			this.bevelSegments
			this.bevelThickness
			this.centerGeometry
			this.element.calculatedSize

			untrack(() => this.resetMeshComponent())
		})
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

	// If we use this on a geometry that needs smoothing, this will apply:
	// TODO attribute to toggle flat shading
	// geometry.computeFaceNormals()
	// geometry.computeVertexNormals()
	// geometry.computeBoundingSphere()
}

// Adapted from https://github.com/mrdoob/three.js/blob/c7d06c02e302ab9c20fe8b33eade4b61c6712654/examples/jsm/loaders/SVGLoader.js#L207

// function parseSvgPathElement(path: SVGPathElement) {
// 	return parseSvgPathDAttribute(path.getAttribute('d'))
// }

function parseSvgPathDAttribute(d: string | null) {
	const path = new ShapePath()

	const point = new Vector2()
	const control = new Vector2()

	const firstPoint = new Vector2()
	let isFirstPoint = true
	let doSetFirstPoint = false

	if (!d) {
		console.error('Path has not `d` attribute.')
		return path
	}

	const commands = d.match(/[a-df-z][^a-df-z]*/gi)

	if (!commands) {
		console.error('Empty or invalid path: ', d)
		return path
	}

	for (let i = 0, l = commands.length; i < l; i++) {
		const command = commands[i]

		const type = command.charAt(0)
		const data = command.slice(1).trim()

		if (isFirstPoint === true) {
			doSetFirstPoint = true
			isFirstPoint = false
		}

		let numbers

		switch (type) {
			case 'M':
				numbers = parseFloats(data)
				for (let j = 0, jl = numbers.length; j < jl; j += 2) {
					point.x = numbers[j + 0]
					point.y = numbers[j + 1]
					control.x = point.x
					control.y = point.y

					if (j === 0) {
						path.moveTo(point.x, point.y)
					} else {
						path.lineTo(point.x, point.y)
					}

					if (j === 0) firstPoint.copy(point)
				}

				break

			case 'H':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j++) {
					point.x = numbers[j]
					control.x = point.x
					control.y = point.y
					path.lineTo(point.x, point.y)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'V':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j++) {
					point.y = numbers[j]
					control.x = point.x
					control.y = point.y
					path.lineTo(point.x, point.y)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'L':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 2) {
					point.x = numbers[j + 0]
					point.y = numbers[j + 1]
					control.x = point.x
					control.y = point.y
					path.lineTo(point.x, point.y)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'C':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 6) {
					path.bezierCurveTo(
						numbers[j + 0],
						numbers[j + 1],
						numbers[j + 2],
						numbers[j + 3],
						numbers[j + 4],
						numbers[j + 5],
					)
					control.x = numbers[j + 2]
					control.y = numbers[j + 3]
					point.x = numbers[j + 4]
					point.y = numbers[j + 5]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'S':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 4) {
					path.bezierCurveTo(
						getReflection(point.x, control.x),
						getReflection(point.y, control.y),
						numbers[j + 0],
						numbers[j + 1],
						numbers[j + 2],
						numbers[j + 3],
					)
					control.x = numbers[j + 0]
					control.y = numbers[j + 1]
					point.x = numbers[j + 2]
					point.y = numbers[j + 3]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'Q':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 4) {
					path.quadraticCurveTo(numbers[j + 0], numbers[j + 1], numbers[j + 2], numbers[j + 3])
					control.x = numbers[j + 0]
					control.y = numbers[j + 1]
					point.x = numbers[j + 2]
					point.y = numbers[j + 3]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'T':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 2) {
					const rx = getReflection(point.x, control.x)
					const ry = getReflection(point.y, control.y)
					path.quadraticCurveTo(rx, ry, numbers[j + 0], numbers[j + 1])
					control.x = rx
					control.y = ry
					point.x = numbers[j + 0]
					point.y = numbers[j + 1]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'A':
				numbers = parseFloats(data, [3, 4], 7)

				for (let j = 0, jl = numbers.length; j < jl; j += 7) {
					// skip command if start point == end point
					if (numbers[j + 5] == point.x && numbers[j + 6] == point.y) continue

					const start = point.clone()
					point.x = numbers[j + 5]
					point.y = numbers[j + 6]
					control.x = point.x
					control.y = point.y
					parseArcCommand(
						path,
						numbers[j],
						numbers[j + 1],
						numbers[j + 2],
						numbers[j + 3],
						numbers[j + 4],
						start,
						point,
					)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'm':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 2) {
					point.x += numbers[j + 0]
					point.y += numbers[j + 1]
					control.x = point.x
					control.y = point.y

					if (j === 0) {
						path.moveTo(point.x, point.y)
					} else {
						path.lineTo(point.x, point.y)
					}

					if (j === 0) firstPoint.copy(point)
				}

				break

			case 'h':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j++) {
					point.x += numbers[j]
					control.x = point.x
					control.y = point.y
					path.lineTo(point.x, point.y)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'v':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j++) {
					point.y += numbers[j]
					control.x = point.x
					control.y = point.y
					path.lineTo(point.x, point.y)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'l':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 2) {
					point.x += numbers[j + 0]
					point.y += numbers[j + 1]
					control.x = point.x
					control.y = point.y
					path.lineTo(point.x, point.y)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'c':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 6) {
					path.bezierCurveTo(
						point.x + numbers[j + 0],
						point.y + numbers[j + 1],
						point.x + numbers[j + 2],
						point.y + numbers[j + 3],
						point.x + numbers[j + 4],
						point.y + numbers[j + 5],
					)
					control.x = point.x + numbers[j + 2]
					control.y = point.y + numbers[j + 3]
					point.x += numbers[j + 4]
					point.y += numbers[j + 5]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 's':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 4) {
					path.bezierCurveTo(
						getReflection(point.x, control.x),
						getReflection(point.y, control.y),
						point.x + numbers[j + 0],
						point.y + numbers[j + 1],
						point.x + numbers[j + 2],
						point.y + numbers[j + 3],
					)
					control.x = point.x + numbers[j + 0]
					control.y = point.y + numbers[j + 1]
					point.x += numbers[j + 2]
					point.y += numbers[j + 3]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'q':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 4) {
					path.quadraticCurveTo(
						point.x + numbers[j + 0],
						point.y + numbers[j + 1],
						point.x + numbers[j + 2],
						point.y + numbers[j + 3],
					)
					control.x = point.x + numbers[j + 0]
					control.y = point.y + numbers[j + 1]
					point.x += numbers[j + 2]
					point.y += numbers[j + 3]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 't':
				numbers = parseFloats(data)

				for (let j = 0, jl = numbers.length; j < jl; j += 2) {
					const rx = getReflection(point.x, control.x)
					const ry = getReflection(point.y, control.y)
					path.quadraticCurveTo(rx, ry, point.x + numbers[j + 0], point.y + numbers[j + 1])
					control.x = rx
					control.y = ry
					point.x = point.x + numbers[j + 0]
					point.y = point.y + numbers[j + 1]

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'a':
				numbers = parseFloats(data, [3, 4], 7)

				for (let j = 0, jl = numbers.length; j < jl; j += 7) {
					// skip command if no displacement
					if (numbers[j + 5] == 0 && numbers[j + 6] == 0) continue

					const start = point.clone()
					point.x += numbers[j + 5]
					point.y += numbers[j + 6]
					control.x = point.x
					control.y = point.y
					parseArcCommand(
						path,
						numbers[j],
						numbers[j + 1],
						numbers[j + 2],
						numbers[j + 3],
						numbers[j + 4],
						start,
						point,
					)

					if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point)
				}

				break

			case 'Z':
			case 'z':
				path.currentPath.autoClose = true

				if (path.currentPath.curves.length > 0) {
					// Reset point to beginning of Path
					point.copy(firstPoint)
					path.currentPath.currentPoint.copy(point)
					isFirstPoint = true
				}

				break

			default:
				console.warn(command)
		}

		doSetFirstPoint = false
	}

	return path
}

// from https://github.com/ppvg/svg-numbers (MIT License)

function parseFloats(input: string): number[]
function parseFloats(input: string, flags: number[], stride: number): number[]
function parseFloats(input: string, flags?: number[], stride?: number): number[] {
	if (typeof input !== 'string') {
		throw new TypeError('Invalid input: ' + typeof input)
	}

	// Character groups
	const RE = {
		SEPARATOR: /[ \t\r\n\,.\-+]/,
		WHITESPACE: /[ \t\r\n]/,
		DIGIT: /[\d]/,
		SIGN: /[-+]/,
		POINT: /\./,
		COMMA: /,/,
		EXP: /e/i,
		FLAGS: /[01]/,
	}

	// States
	const SEP = 0
	const INT = 1
	const FLOAT = 2
	const EXP = 3

	let state = SEP
	let seenComma = true
	let number = '',
		exponent = ''
	const result: number[] = []

	class NumberSyntaxError extends SyntaxError {
		partial: any
	}

	function throwSyntaxError(current: string, i: number, partial: number[]) {
		const error = new NumberSyntaxError('Unexpected character "' + current + '" at index ' + i + '.')
		error.partial = partial
		throw error
	}

	function newNumber() {
		if (number !== '') {
			if (exponent === '') result.push(Number(number))
			else result.push(Number(number) * Math.pow(10, Number(exponent)))
		}

		number = ''
		exponent = ''
	}

	let current
	const length = input.length

	for (let i = 0; i < length; i++) {
		current = input[i]

		// check for flags
		if (Array.isArray(flags) && flags.includes(result.length % stride!) && RE.FLAGS.test(current)) {
			state = INT
			number = current
			newNumber()
			continue
		}

		// parse until next number
		if (state === SEP) {
			// eat whitespace
			if (RE.WHITESPACE.test(current)) {
				continue
			}

			// start new number
			if (RE.DIGIT.test(current) || RE.SIGN.test(current)) {
				state = INT
				number = current
				continue
			}

			if (RE.POINT.test(current)) {
				state = FLOAT
				number = current
				continue
			}

			// throw on double commas (e.g. "1, , 2")
			if (RE.COMMA.test(current)) {
				if (seenComma) {
					throwSyntaxError(current, i, result)
				}

				seenComma = true
			}
		}

		// parse integer part
		if (state === INT) {
			if (RE.DIGIT.test(current)) {
				number += current
				continue
			}

			if (RE.POINT.test(current)) {
				number += current
				state = FLOAT
				continue
			}

			if (RE.EXP.test(current)) {
				state = EXP
				continue
			}

			// throw on double signs ("-+1"), but not on sign as separator ("-1-2")
			if (RE.SIGN.test(current) && number.length === 1 && RE.SIGN.test(number[0])) {
				throwSyntaxError(current, i, result)
			}
		}

		// parse decimal part
		if (state === FLOAT) {
			if (RE.DIGIT.test(current)) {
				number += current
				continue
			}

			if (RE.EXP.test(current)) {
				state = EXP
				continue
			}

			// throw on double decimal points (e.g. "1..2")
			if (RE.POINT.test(current) && number[number.length - 1] === '.') {
				throwSyntaxError(current, i, result)
			}
		}

		// parse exponent part
		if (state === EXP) {
			if (RE.DIGIT.test(current)) {
				exponent += current
				continue
			}

			if (RE.SIGN.test(current)) {
				if (exponent === '') {
					exponent += current
					continue
				}

				if (exponent.length === 1 && RE.SIGN.test(exponent)) {
					throwSyntaxError(current, i, result)
				}
			}
		}

		// end of number
		if (RE.WHITESPACE.test(current)) {
			newNumber()
			state = SEP
			seenComma = false
		} else if (RE.COMMA.test(current)) {
			newNumber()
			state = SEP
			seenComma = true
		} else if (RE.SIGN.test(current)) {
			newNumber()
			state = INT
			number = current
		} else if (RE.POINT.test(current)) {
			newNumber()
			state = FLOAT
			number = current
		} else {
			throwSyntaxError(current, i, result)
		}
	}

	// add the last number found (if any)
	newNumber()

	return result
}

/**
 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
 * https://mortoray.com/2017/02/16/rendering-an-svg-elliptical-arc-as-bezier-curves/ Appendix: Endpoint to center arc conversion
 * From
 * rx ry x-axis-rotation large-arc-flag sweep-flag x y
 * To
 * aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
 */

function parseArcCommand(
	path: ShapePath,
	rx: number,
	ry: number,
	x_axis_rotation: number,
	large_arc_flag: number,
	sweep_flag: number,
	start: Vector2,
	end: Vector2,
) {
	if (rx == 0 || ry == 0) {
		// draw a line if either of the radii == 0
		path.lineTo(end.x, end.y)
		return
	}

	x_axis_rotation = (x_axis_rotation * Math.PI) / 180

	// Ensure radii are positive
	rx = Math.abs(rx)
	ry = Math.abs(ry)

	// Compute (x1', y1')
	const dx2 = (start.x - end.x) / 2.0
	const dy2 = (start.y - end.y) / 2.0
	const x1p = Math.cos(x_axis_rotation) * dx2 + Math.sin(x_axis_rotation) * dy2
	const y1p = -Math.sin(x_axis_rotation) * dx2 + Math.cos(x_axis_rotation) * dy2

	// Compute (cx', cy')
	let rxs = rx * rx
	let rys = ry * ry
	const x1ps = x1p * x1p
	const y1ps = y1p * y1p

	// Ensure radii are large enough
	const cr = x1ps / rxs + y1ps / rys

	if (cr > 1) {
		// scale up rx,ry equally so cr == 1
		const s = Math.sqrt(cr)
		rx = s * rx
		ry = s * ry
		rxs = rx * rx
		rys = ry * ry
	}

	const dq = rxs * y1ps + rys * x1ps
	const pq = (rxs * rys - dq) / dq
	let q = Math.sqrt(Math.max(0, pq))
	if (large_arc_flag === sweep_flag) q = -q
	const cxp = (q * rx * y1p) / ry
	const cyp = (-q * ry * x1p) / rx

	// Step 3: Compute (cx, cy) from (cx', cy')
	const cx = Math.cos(x_axis_rotation) * cxp - Math.sin(x_axis_rotation) * cyp + (start.x + end.x) / 2
	const cy = Math.sin(x_axis_rotation) * cxp + Math.cos(x_axis_rotation) * cyp + (start.y + end.y) / 2

	// Step 4: Compute θ1 and Δθ
	const theta = svgAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
	const delta = svgAngle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry) % (Math.PI * 2)

	path.currentPath.absellipse(cx, cy, rx, ry, theta, theta + delta, sweep_flag === 0, x_axis_rotation)
}

// http://www.w3.org/TR/SVG11/implnote.html#PathElementImplementationNotes

function getReflection(a: number, b: number) {
	return a - (b - a)
}

function svgAngle(ux: number, uy: number, vx: number, vy: number) {
	const dot = ux * vx + uy * vy
	const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy)
	let ang = Math.acos(Math.max(-1, Math.min(1, dot / len))) // floating point precision, slightly over values appear
	if (ux * vy - uy * vx < 0) ang = -ang
	return ang
}
