import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerScale') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'scale' },
})
