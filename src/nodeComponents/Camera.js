import Class from 'lowclass'

import NodeComponent from './NodeComponent'

import Privates from '../utilities/Privates'
let __ = new Privates()

export default
Class ('Camera') .extends (NodeComponent, {

    /**
     * @constructor
     */
    Camera() {
        this.super.apply(this, arguments)

        this.test = 'test'
    },

    /**
     * @override
     */
    get referenceName() { return 'camera' },

    // TODO: perspective needs to be set on the worker side.
    get perspective() {
        return __(this).perspective
    },
    set perspective(newValue) {
        __(this).perspective = newValue
    },
})
