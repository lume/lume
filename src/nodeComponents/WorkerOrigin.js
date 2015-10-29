import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerOrigin') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'origin' },
})
