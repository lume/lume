import Node from './Node'

// defines the `<i-obj-model>` element, which is short for `<i-node has="obj-model">`
export default class ObjModel extends Node {
    static defaultElementName = 'i-obj-model'
    static defaultBehaviors = ['obj-model']
}

export {ObjModel}
