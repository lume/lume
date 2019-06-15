import Class from 'lowclass'
import BaseMeshBehavior from './BaseMeshBehavior'
import {props, changePropContext} from '../../core/props'

// base class for geometry behaviors
export default Class('BaseGeometryBehavior').extends(BaseMeshBehavior, ({Public, Private, Super}) => ({
    static: {
        type: 'geometry',

        props: {
            // if we have no props defined here, WithUpdate breaks
            size: changePropContext(props.XYZNonNegativeValues, self => self.element),
            sizeMode: changePropContext(props.XYZSizeModeValues, self => self.element),
        },
    },

    updated(oldProps, modifiedProps) {
        const {size, sizeMode} = modifiedProps

        if (size || sizeMode) {
            Private(this).__updateGeometryOnSizeChange(this.size)
        }
    },

    protected: {
        _listenToElement() {
            Super(this)._listenToElement()

            // TODO the following three events can be replaced with a single propchange:size event
            Public(this).element.on('sizechange', Private(this).__onSizeValueChanged, Private(this))
            Public(this).element.size.on('valuechanged', Private(this).__onSizeValueChanged, Private(this))
            Public(this).element.sizeMode.on('valuechanged', Private(this).__onSizeValueChanged, Private(this))
        },

        _unlistenToElement() {
            Super(this)._unlistenToElement()

            Public(this).element.off('sizechange', Private(this).__onSizeValueChanged)
            Public(this).element.size.off('valuechanged', Private(this).__onSizeValueChanged)
            Public(this).element.sizeMode.off('valuechanged', Private(this).__onSizeValueChanged)
        },
    },

    private: {
        __onSizeValueChanged() {
            // tells WithUpdate (from BaseMeshBehavior) which prop
            // changed and makes it finally trigger our updated method
            // Public(this).size = Public(this).size
            Public(this).triggerUpdateForProp('size')
        },

        // NOTE we may use the x, y, z args to calculate scale when/if we
        // implement size under the hood as an Object3D.scale.
        __updateGeometryOnSizeChange({x, y, z}) {
            // TODO PERFORMANCE, resetMeshComponent creates a new geometry.
            // Re-creating geometries is wasteful, re-use them when possible, and
            // add instancing. Maybe we use Object3D.scale as an implementation
            // detail of our `size` prop.
            Public(this).resetMeshComponent()
        },
    },
}))
