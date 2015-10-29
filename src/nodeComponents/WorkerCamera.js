import Class from 'lowclass'

import WorkerNodeComponent from './WorkerNodeComponent'

import Privates from '../utilities/Privates'
let __ = new Privates()

export default
Class ('WorkerCamera') .extends (WorkerNodeComponent, {

    /**
     * @constructor
     */
    WorkerCamera(id) {
        this.super.call(this, id)

        this.perspective = null
    },

    /**
     * @override
     */
    get referenceName() { return 'camera' },
})
