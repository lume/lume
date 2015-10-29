import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerPosition') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'position' },
})
