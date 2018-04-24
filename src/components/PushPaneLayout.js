import Class from 'lowclass'
import Node from '../core/Node'

export default
Class('PushPaneLayout').extends( Node, ({ Super }) => ({
    construct(...args) {
        console.log(' -- PushPaneLayout created')
        Super(this).construct(...args)
    }
}))
