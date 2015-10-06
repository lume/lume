import Class from 'lowclass'

import Motor from '../core/Motor'
import Node from './Node'

/**
 * @class Scene
 */
export default
Class ('Scene') .extends (Node, {

    /**
     * @constructor
     */
    Scene(mountPoint) {
        this.super.call(this)

        this.motor = new Motor
    },
})
