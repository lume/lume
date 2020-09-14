import Node from './Node'

// defines the `<lume-obj-model>` element, which is short for `<lume-node has="obj-model">`
export default class ObjModel extends Node {
	static defaultElementName = 'lume-obj-model'
	static defaultBehaviors = ['obj-model']
}

export {ObjModel}
