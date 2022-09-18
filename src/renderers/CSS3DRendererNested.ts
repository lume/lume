// based on THREE.CSS3DRenderer from https://github.com/mrdoob/three.js/blob/51ac0084709d4d3795ccb7119ee24e6a808618df/examples/js/renderers/CSS3DRenderer.js

import {Matrix4} from 'three/src/math/Matrix4.js'
import {Object3DWithPivot} from '../core/Object3DWithPivot.js'
import {isPerspectiveCamera, isOrthographicCamera} from '../utils/three.js'

import type {Object3D} from 'three/src/core/Object3D.js'
import type {Scene} from 'three/src/scenes/Scene.js'
import type {Camera} from 'three/src/cameras/Camera.js'

export class CSS3DObjectNested extends Object3DWithPivot {
	override type = 'CSS3DObjectNested'

	#initialFrame = requestAnimationFrame(() => {
		// delay to the next frame because attributes are not allowed be set
		// inside Custom Element (i.e. Web Component) constructors, otherwise
		// this can throw an error if called inside a Custom Element
		// constructor.

		this.element.style.position = 'absolute'
	})

	constructor(public element: HTMLElement) {
		super()
	}

	dispose() {
		cancelAnimationFrame(this.#initialFrame)
	}
}

// TODO Sprite is still untested in this new nested renderer
export class CSS3DNestedSprite extends CSS3DObjectNested {}

//

export class CSS3DRendererNested {
	domElement: HTMLDivElement
	#matrix = new Matrix4()

	#cache = {
		camera: {fov: 0, style: ''},
		objects: new WeakMap(),
	}

	#width = 0
	#height = 0
	#widthHalf = 0
	#heightHalf = 0
	#cameraElement: HTMLDivElement

	constructor() {
		const domElement = document.createElement('div')
		domElement.classList.add('CSS3DRendererNested')
		domElement.style.overflow = 'hidden'

		this.domElement = domElement

		const cameraElement = document.createElement('div')
		cameraElement.classList.add('cameraElement')
		cameraElement.appendChild(document.createElement('slot'))

		cameraElement.style.transformStyle = 'preserve-3d'

		domElement.appendChild(cameraElement)

		this.#cameraElement = cameraElement
	}

	getSize() {
		return {
			width: this.#width,
			height: this.#height,
		}
	}

	setSize(width: number, height: number) {
		this.#width = width
		this.#height = height
		this.#widthHalf = width / 2
		this.#heightHalf = height / 2

		this.domElement.style.width = width + 'px'
		this.domElement.style.height = height + 'px'

		this.#cameraElement.style.width = width + 'px'
		this.#cameraElement.style.height = height + 'px'
	}

	#renderObject(object: Object3D, camera: Camera) {
		if (object instanceof CSS3DObjectNested) {
			let style: string = ''

			if (object instanceof CSS3DNestedSprite) {
				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				this.#matrix.copy(camera.matrixWorldInverse)
				this.#matrix.transpose()
				this.#matrix.copyPosition(object.matrixWorld)
				this.#matrix.scale(object.scale)

				this.#matrix.elements[3] = 0
				this.#matrix.elements[7] = 0
				this.#matrix.elements[11] = 0
				this.#matrix.elements[15] = 1

				style = getObjectCSSMatrix(object, this.#matrix)
			} else {
				style = getObjectCSSMatrix(object, object.matrix)
			}

			const element = object.element
			const cachedStyle = this.#cache.objects.get(object)

			// if ( cachedStyle === undefined || cachedStyle !== style ) { // BUG, https://github.com/mrdoob/three.js/pull/15470
			if (cachedStyle === undefined || cachedStyle.style !== style) {
				// TODO use CSSOM for speed in production, style attribute in dev mode
				element.style.transform = style

				const objectData = {style: style}

				this.#cache.objects.set(object, objectData)
			}
		}

		for (let i = 0, l = object.children.length; i < l; i++) {
			this.#renderObject(object.children[i], camera)
		}
	}

	render(scene: Scene, camera: Camera) {
		const fov = camera.projectionMatrix.elements[5] * this.#heightHalf

		if (this.#cache.camera.fov !== fov) {
			if (isPerspectiveCamera(camera)) {
				this.domElement.style.perspective = fov + 'px'
			}

			this.#cache.camera.fov = fov
		}

		scene.updateMatrixWorld()

		if (camera.parent === null) camera.updateMatrixWorld((void 0)!)

		let tx = 0
		let ty = 0
		if (isOrthographicCamera(camera)) {
			tx = -(camera.right + camera.left) / 2
			ty = (camera.top + camera.bottom) / 2
		}

		// prettier-ignore
		const cameraCSSMatrix = isOrthographicCamera(camera)
            ? 'scale(' + fov + ')' + 'translate(' + epsilon(tx) + 'px,' + epsilon(ty) + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse)
            : 'translateZ(' + fov + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse)

		const style = cameraCSSMatrix + 'translate(' + this.#widthHalf + 'px,' + this.#heightHalf + 'px)'

		if (this.#cache.camera.style !== style) {
			this.#cameraElement.style.transform = style

			this.#cache.camera.style = style
		}

		this.#renderObject(scene, camera)
	}
}

function getCameraCSSMatrix(matrix: Matrix4) {
	const elements = matrix.elements

	return (
		'matrix3d(' +
		epsilon(elements[0]) +
		',' +
		epsilon(-elements[1]) +
		',' +
		epsilon(elements[2]) +
		',' +
		epsilon(elements[3]) +
		',' +
		epsilon(elements[4]) +
		',' +
		epsilon(-elements[5]) +
		',' +
		epsilon(elements[6]) +
		',' +
		epsilon(elements[7]) +
		',' +
		epsilon(elements[8]) +
		',' +
		epsilon(-elements[9]) +
		',' +
		epsilon(elements[10]) +
		',' +
		epsilon(elements[11]) +
		',' +
		epsilon(elements[12]) +
		',' +
		epsilon(-elements[13]) +
		',' +
		epsilon(elements[14]) +
		',' +
		epsilon(elements[15]) +
		')'
	)
}

function getObjectCSSMatrix(object: Object3D, matrix: Matrix4) {
	const parent = object.parent
	const childOfScene = parent && parent.type === 'Scene'

	// TODO I don't remember why we negate values based on childOfScene below.
	// It's been a while and I forgot. This should be documented.

	const elements = matrix.elements
	const matrix3d =
		'matrix3d(' +
		epsilon(elements[0]) +
		',' +
		epsilon(elements[1]) +
		',' +
		epsilon(elements[2]) +
		',' +
		epsilon(elements[3]) +
		',' +
		epsilon((childOfScene ? -1 : 1) * elements[4]) +
		',' +
		epsilon((childOfScene ? -1 : 1) * elements[5]) +
		',' +
		epsilon((childOfScene ? -1 : 1) * elements[6]) +
		',' +
		epsilon((childOfScene ? -1 : 1) * elements[7]) +
		',' +
		epsilon(elements[8]) +
		',' +
		epsilon(elements[9]) +
		',' +
		epsilon(elements[10]) +
		',' +
		epsilon(elements[11]) +
		',' +
		epsilon(elements[12]) +
		',' /* X position */ +
		epsilon((childOfScene ? 1 : -1) * elements[13]) +
		',' /* Y position */ +
		epsilon(elements[14]) +
		',' /* Z position */ +
		epsilon(elements[15]) +
		')'

	// similar to mountPoint
	return `${childOfScene ? 'translate(-50%, -50%)' : ''} ${matrix3d}`
}

function epsilon(value: number) {
	return Math.abs(value) < 1e-10 ? 0 : value
}
