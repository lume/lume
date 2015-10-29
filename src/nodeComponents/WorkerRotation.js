import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerRotation') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'rotation' },
})
