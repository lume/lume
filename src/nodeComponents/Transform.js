import Class     from 'lowclass'
import NodeComponent from './NodeComponent'

export default
Class ('Transform') .extends (NodeComponent, {
    Transform() {
    },

    /**
     * @override
     */
    get referenceName() { return 'transform' },
})
