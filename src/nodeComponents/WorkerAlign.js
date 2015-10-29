import Class     from 'lowclass'
import WorkerNodeComponent from './WorkerNodeComponent'

export default
Class ('WorkerAlign') .extends (WorkerNodeComponent, {

    /**
     * @override
     */
    get referenceName() { return 'align' },
})
