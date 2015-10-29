import Class        from 'lowclass'

export default
Class ('WorkerNodeComponent', {

    /**
     * @constructor
     */
    WorkerNodeComponent(id) {
        this.id = id
    },

    /**
     * Must return a valid JavaScript identifier string. The value defined here
     * is the name of the property that will contain a reference to this
     * component, and that gets attached onto the Node that this component gets
     * added to.
     *
     * @return {string} A valid JavaScript identifier that will be attached to
     * the Node that this component gets added to.
     */
    get referenceName() {
        throw new Error('The NodeComponent getter must be overwritten in extending components in order to define the name of the extending component.')
        return 'validName'
    },

    /**
     * Add this component to the given Node.
     * @param {../nodes/Node} node The Node this component will be added to.
     */
    addTo(node) {
        let thisComponent = this

        // if the property named this.referenceName already exists on the Node,
        // throw and error and describe which component creted the property.
        if (_.has(node, this.referenceName)) {
            throw new Error('This Node already has a component at node.'+this.referenceName+'')
        }

        // save the node for use by the component.
        this.node = node

        Object.defineProperty(node, this.referenceName, {
            configurable: true,
            enumerable: true,

            get: function() {
                return thisComponent
            },

            // if someone does something like node.component = "foo", let them overwrite it like a normal property.
            set: function(newValue) {
                delete node[thisComponent.referenceName]
                Object.defineProperty(node, this.referenceName, {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: newValue,
                })
            },

        })
    },
})
