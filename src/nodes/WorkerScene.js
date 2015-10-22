import Class from 'lowclass'

import WorkerNode from './WorkerNode'

/**
 * @private
 * @class WorkerScene
 */
export default
Class ('WorkerScene') .extends (WorkerNode, {

    /**
     * @constructor
     */
    WorkerScene(id) {
        this.super.call(this, id)
    },
})
