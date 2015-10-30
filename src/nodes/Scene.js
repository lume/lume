import Class        from 'lowclass'

import Node from './Node'

import Privates from '../utilities/Privates'
let __ = new Privates()

/**
 * @public
 * @class Scene
 * @extends Node
 */
export default
Class ('Scene') .extends (Node, {

    /**
     * @override
     *
     * @param {HTMLElement} mountPoint The HTMLElement in which this scene will
     * be mounted. The scene will place the HTMLElements for the DOMRenderer
     * and/or WebGLRenderer in this element.
     */
    init(mountPoint) {
        Node.prototype.init.call(this)

        __(this).mountPoint = mountPoint
    },

    /**
     * Don't override this unless you know what you're doing.
     * @override
     */
    get _idPrefix() { return "Node#Scene" },
})
