import {ShapePath} from 'three/src/extras/core/ShapePath.js'
import {Vector2} from 'three/src/math/Vector2.js'

// Functions adapted from https://github.com/mrdoob/three.js/blob/c7d06c02e302ab9c20fe8b33eade4b61c6712654/examples/jsm/loaders/SVGLoader.js#L207

export function parseSvgPathElement(path: SVGPathElement) {
	return parseSvgPathDAttribute(path.getAttribute('d'))
}

export function parseSvgPathDAttribute(d: string | null) {
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
