import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerSize') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'size' },
})
