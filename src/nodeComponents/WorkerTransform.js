import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerTransform') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'transform' },
})
