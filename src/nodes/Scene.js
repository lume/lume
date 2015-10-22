import Class from 'lowclass'

import Node from './Node'

/**
 * @public
 * @class Scene
 */
export default
Class ('Scene') .extends (Node, {

    /**
     * @constructor
     */
    Scene(mountPoint) {
        this.super.call(this)
    },
})
