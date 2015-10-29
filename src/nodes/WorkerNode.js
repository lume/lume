import Class from 'lowclass'

import env from '../utilities/environment'

/**
 * @private
 * @class WorkerNode
 */
export default
Class ('WorkerNode', {

    /**
     * @constructor
     */
    WorkerNode(id) {
        this.id = id

        if (env.isWeb) {
            console.log(' --- UI thread')
        }
        else if (env.isWebWorker) {
            console.log(' --- Web worker')
        }
    },

    addChild() {},

    addComponent() {},
})
