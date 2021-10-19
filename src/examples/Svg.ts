import {attribute, autorun, element} from '@lume/element'
import {Group} from 'three/src/objects/Group.js'
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {Color} from 'three/src/math/Color.js'
import {ShapeBufferGeometry} from 'three/src/geometries/ShapeBufferGeometry.js'
import {Mesh} from 'three/src/objects/Mesh.js'
import {DoubleSide} from 'three/src/constants.js'
import {Node} from '../core/Node.js'
import {autoDefineElements} from '../LumeConfig.js'

@element('lume-svg', autoDefineElements)
export class Svg extends Node {
	// Super class `observedAttributes` are automatically inherited thanks to the `element` decorator.
	static observedAttributes = {
		src: attribute.string(''),
	}

	src = ''

	loader?: SVGLoader

	// connectedCallback() {
	// 	super.connectedCallback()

	// 	// FIXME: Why is _loadGL not being called automatically like it should be when svg.js is loaded *after* the lume-scene markup?
	// 	this._loadGL()
	// }

	_loadGL() {
		if (!super._loadGL()) return false

		this.loader = new SVGLoader()

		this._glStopFns.push(
			autorun(() => {
				this.loader!.load(this.src, data => {
					const paths = data.paths

					const group = new Group()
					group.scale.set(0.25, -0.25, 0.25)
					// group.position.x = -70
					// group.position.y = 70
					// group.scale.y *= -1

					for (let i = 0; i < paths.length; i++) {
						const path = paths[i]

						// @ts-ignore
						const fillColor = path.userData.style.fill

						if (fillColor !== undefined && fillColor !== 'none') {
							const material = new MeshBasicMaterial({
								color: new Color().setStyle(fillColor),
								// @ts-ignore
								opacity: path.userData.style.fillOpacity,
								// @ts-ignore
								transparent: path.userData.style.fillOpacity < 1,
								side: DoubleSide,
								depthWrite: false,
							})

							const shapes = path.toShapes(true)

							for (let j = 0; j < shapes.length; j++) {
								const shape = shapes[j]

								const geometry = new ShapeBufferGeometry(shape)
								const mesh = new Mesh(geometry, material)

								group.add(mesh)
							}
						}

						// @ts-ignore
						const strokeColor = path.userData.style.stroke

						if (strokeColor !== undefined && strokeColor !== 'none') {
							const material = new MeshBasicMaterial({
								color: new Color().setStyle(strokeColor),
								// @ts-ignore
								opacity: path.userData.style.strokeOpacity,
								// @ts-ignore
								transparent: path.userData.style.strokeOpacity < 1,
								side: DoubleSide,
								depthWrite: false,
							})

							for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
								const subPath = path.subPaths[j]

								const geometry = SVGLoader.pointsToStroke(
									subPath.getPoints(),
									// @ts-ignore
									path.userData.style,
								)

								if (geometry) {
									const mesh = new Mesh(geometry, material)

									group.add(mesh)
								}
							}
						}
					}

					this.three.add(group)
				})
			}),
		)

		return true
	}
}
