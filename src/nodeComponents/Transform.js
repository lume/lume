import Class     from 'lowclass'
import NodeComponent from './NodeComponent'

export default
Class ('Transform') .extends (NodeComponent, {

    // don't override this unless you know what you're doing.
    get _idPrefix() { return "Transform" },

    /**
     * @override
     */
    get referenceName() { return 'transform' },
})
