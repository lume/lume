import Class from 'lowclass'
import Node from '../core/Node'

export default
Class('PushPaneLayout').extends( Node, ({ Super }) => ({
    constructor(...args) {
        console.log(' -- PushPaneLayout created')
        const self = Super(this).constructor(...args)
        return self
    }
}))
