import Class from 'lowclass'
import Node from './Node'

// defines the `<i-obj-model>` element, which is short for `<i-node has="obj-model">`
export default Class('ObjModel').extends(Node, ({Super}) => ({
    static: {
        defaultElementName: 'i-obj-model',
        defaultBehaviors: ['obj-model'],
    },
}))
