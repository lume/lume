import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerOpacity') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'opacity' },
})
