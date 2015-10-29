import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerMountPoint') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'mountPoint' },
})
