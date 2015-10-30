import Class        from 'lowclass'

import InternalNode from './InternalNode'
import registerNodeWithMotor from '../utilities/registerNodeWithMotor'

import Transform from '../nodeComponents/Transform'

import Privates from '../utilities/Privates'
let __ = new Privates()

/**
 * @public
 * @class Node
 * @extends InternalNode
 */
export default
Class ('Node') .extends (InternalNode, {

    /**
     * @override
     *
     * Registers this Node with the singleton Motor.
     */
    init() {
        InternalNode.prototype.init.call(this)

        registerNodeWithMotor(this, __)

        if (this.useDefaultComponents) {
            // TODO: Scenes will have different default components than Nodes?
            this.addComponent(new Transform)
        }
    },
})
