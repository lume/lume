import Class from 'lowclass'
import BaseMeshBehavior from './BaseMeshBehavior'
import { props } from '../../core/props'

// base class for geometry behaviors
export default
Class( 'BaseGeometryBehavior' ).extends( BaseMeshBehavior, ({ Public, Private, Super }) => ({

    static: {
        type: 'geometry',

        props: {
            // if we have no props defined here, SkateJS breaks
            // https://github.com/skatejs/skatejs/issues/1482
            size: props.XYZNonNegativeValues,
            sizeMode: props.XYZSizeModeValues,
        },
    },

    updated( oldProps, oldState, modifiedProps ) {
        const { size, sizeMode } = modifiedProps

        if ( size || sizeMode ) {
            Private(this).__updateGeometryOnSizeChange(this.size)
        }
    },

    connectedCallback() {
        Super(this).connectedCallback()

        // TODO the following three events can be replaced with a single propchange:size event
        this.element.on('sizechange', Private(this).__onSizeValueChanged, Private(this))
        this.element.size.on('valuechanged', Private(this).__onSizeValueChanged, Private(this))
        this.element.sizeMode.on('valuechanged', Private(this).__onSizeValueChanged, Private(this))
    },

    disconnectedCallback() {
        Super(this).disconnectedCallback()

        this.element.off('sizechange', Private(this).__onSizeValueChanged)
        this.element.size.off('valuechanged', Private(this).__onSizeValueChanged)
        this.element.sizeMode.off('valuechanged', Private(this).__onSizeValueChanged)
    },

    private: {
        __onSizeValueChanged() {
            // tells SkateJS' withUpdate (from BaseMeshBehavior) which prop
            // changed and makes it finally trigger our updated method
            // Public(this).size = Public(this).size

            // tells withUpdate (from BaseMeshBehavior) which prop
            // changed and makes it finally trigger our updated method
            Public(this)._modifiedProps.size = true
            Public(this).triggerUpdate()
        },

        // NOTE we may use the x, y, z args to calculate scale when/if we
        // implement size under the hood as an Object3D.scale.
        __updateGeometryOnSizeChange({ x, y, z }) {
            // TODO PERFORMANCE, resetMeshComponent creates a new geometry.
            // Re-creating geometries is wasteful, re-use them when possible, and
            // add instancing. Maybe we use Object3D.scale as an implementation
            // detail of our `size` prop.
            Public(this).resetMeshComponent()
        },
    },

}))
