// @ts-check

{
	/** @type {import('../../src/index')} */
	const LUME = window.LUME

	const {element, autorun, THREE, disposeObjectTree} = LUME

	class Svg extends LUME.Node {
		constructor() {
			super()

			this.src = ''
			this.loader
		}

		// FIXME Why is _loadGL, etc, not being called automatically when svg.js is loaded after the scene markup?
		_loadGL() {
			if (!super._loadGL()) return false

			this.loader = new THREE.SVGLoader()

			let currentVersion = 0

			this._glStopFns.push(
				autorun(() => {
					currentVersion++
					let loadVersion = currentVersion

					this.loader.load(this.src, data => {
						if (loadVersion !== currentVersion) return

						// Clear the old SVG content
						for (const child of this.three.children) disposeObjectTree(child)

						const paths = data.paths

						const group = new THREE.Group()
						group.scale.multiplyScalar(0.5)
						// group.position.x = -70
						// group.position.y = 70
						group.scale.y *= -1

						// // TODO get the natural size of the loaded SVG, and apply scale so that it matches the LUME element size.
						// this.stopSizeUpdate = autorun(() => {
						// 	this.calculatedSize
						// })

						for (let i = 0; i < paths.length; i++) {
							const path = paths[i]

							const fillColor = path.userData.style.fill
							if (fillColor !== undefined && fillColor !== 'none') {
								const material = new THREE.MeshPhongMaterial({
									color: new THREE.Color().setStyle(fillColor),
									// color: new THREE.Color('white'),
									opacity: path.userData.style.fillOpacity,
									transparent: path.userData.style.fillOpacity < 1,
									side: THREE.DoubleSide,
									depthWrite: false,
								})

								const shapes = path.toShapes(true)

								for (let j = 0; j < shapes.length; j++) {
									const shape = shapes[j]

									const geometry = new THREE.ShapeBufferGeometry(shape)
									const mesh = new THREE.Mesh(geometry, material)

									group.add(mesh)
								}
							}

							const strokeColor = path.userData.style.stroke

							if (strokeColor !== undefined && strokeColor !== 'none') {
								const material = new THREE.MeshPhongMaterial({
									color: new THREE.Color().setStyle(strokeColor),
									// color: new THREE.Color('white'),
									opacity: path.userData.style.strokeOpacity,
									transparent: path.userData.style.strokeOpacity < 1,
									side: THREE.DoubleSide,
									depthWrite: false,
								})

								for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
									const subPath = path.subPaths[j]

									const geometry = THREE.SVGLoader.pointsToStroke(
										subPath.getPoints(),
										path.userData.style,
									)

									if (geometry) {
										const mesh = new THREE.Mesh(geometry, material)

										group.add(mesh)
									}
								}
							}
						}

						group.traverse(n => {
							if (n.isMesh) {
								n.geometry.center()
							}
						})

						this.three.add(group)
					})
				}),
			)

			return true
		}
	}

	// Super class `observedAttributes` are automatically inherited thanks to the `element` decorator.
	Svg.observedAttributes = {
		src: LUME.attribute.string(''),
	}

	element('lume-svg-2')(Svg)
}
