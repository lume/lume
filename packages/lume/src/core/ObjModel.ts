import Node from './Node.js'

/**
 * @element lume-obj-model
 * @class GltfModel - Defines the `<lume-obj-model>` element, which is short for `<lume-node has="obj-model">`.
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene>
 *   <lume-obj-model obj="path/to/model.obj" mtl="path/to/model.mtl"></lume-obj-model>
 * </lume-scene>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * document.body.append(scene)
 * const model = new GltfModel
 * model.obj = 'path/to/model.obj'
 * model.mtl = 'path/to/model.mtl'
 * scene.add(model)
 * ```
 */
export default class ObjModel extends Node {
	static defaultElementName = 'lume-obj-model'
	static defaultBehaviors = ['obj-model']
}

export {ObjModel}
