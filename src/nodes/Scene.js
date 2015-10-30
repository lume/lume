import Class        from 'lowclass'

import Node from './Node'
console.log(' ------------ Node class?', Node, Object.getOwnPropertyDescriptor(Node, 'addChild'))
import registerNodeWithMotor from '../utilities/registerNodeWithMotor'

import Privates from '../utilities/Privates'
let __ = new Privates()

/**
 * @public
 * @class Scene
 * @extends Node
 */
export default
Class ('Scene') .extends (Node, {
    Scene(mountPoint) {
        console.log(' -- Scene constructor')
        Node.call(this, mountPoint)
    },

    /**
     * @override
     *
     * Registers this Node with the singleton Motor. Assigns the mountPoint for
     * the this Scene.
     *
     * @param {HTMLElement} mountPoint The HTMLElement in which this scene will
     * be mounted. The scene will place the HTMLElements for the DOMRenderer
     * and/or WebGLRenderer in this element.
     */
    init(mountPoint) {
        Node.prototype.init.call(this)

        __(this).mountPoint = mountPoint

        console.log(' --- private in Scene', __(this))
    },

    /**
     * Don't override this unless you know what you're doing.
     * @override
     */
    get _idPrefix() { return "Node#Scene" },
})
