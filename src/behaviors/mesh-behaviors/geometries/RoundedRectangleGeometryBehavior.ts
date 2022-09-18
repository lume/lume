import 'element-behaviors'
import {attribute} from '@lume/element'
import {Shape} from 'three/src/extras/core/Shape.js'
import {ExtrudeGeometry} from 'three/src/geometries/ExtrudeGeometry.js'
import {ShapeGeometry} from 'three/src/geometries/ShapeGeometry.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {GeometryBehavior} from './GeometryBehavior.js'

import type {BufferGeometry} from 'three/src/core/BufferGeometry.js'

export type RoundedRectangleGeometryBehaviorAttributes = 'cornerRadius' | 'thickness' | 'quadraticCorners'

export {RoundedRectangleGeometryBehavior}
@behavior
class RoundedRectangleGeometryBehavior extends GeometryBehavior {
	@attribute({from: Number}) @receiver cornerRadius = 0
	@attribute({from: Number}) @receiver thickness = 0

	#quadraticCorners = false

	@attribute
	@receiver
	get quadraticCorners() {
		return this.#quadraticCorners
	}
	set quadraticCorners(val: boolean) {
		// @ts-ignore handle incoming attribute values
		if (val === null || val === 'false') this.#quadraticCorners = false
		else this.#quadraticCorners = true
	}

	override _createComponent() {
		let thickness = this.thickness
		let geom: BufferGeometry

		const roundedRectShape = new RoundedRectShape(
			0,
			0,
			this.element.calculatedSize.x,
			this.element.calculatedSize.y,
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

		geom.translate(-this.element.calculatedSize.x / 2, -this.element.calculatedSize.y / 2, -thickness / 2)

		return geom
	}
}

if (!elementBehaviors.has('rounded-rectangle-geometry'))
	elementBehaviors.define('rounded-rectangle-geometry', RoundedRectangleGeometryBehavior)

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
