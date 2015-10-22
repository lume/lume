import Class from 'lowclass'

import WorkerNode from './WorkerNode'

/**
 * @private
 * @class WorkerNode
 */
export default
Class ('WorkerNode') .extends (WorkerNode, {

    /**
     * @constructor
     */
    WorkerNode(mountPoint) {
        this.super.call(this)
    },
})
