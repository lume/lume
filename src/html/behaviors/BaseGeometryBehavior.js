import Class from 'lowclass'
import BaseMeshBehavior from './BaseMeshBehavior'
import { props } from '../../core/props'

// base class for geometry behaviors
export default
Class( 'BaseGeometryBehavior' ).extends( BaseMeshBehavior, ({ Public, Protected, Private, Super }) => ({

    static: {
        type: 'geometry',

        props: {
            // if we have no props defined here, SkateJS breaks
            // https://github.com/skatejs/skatejs/issues/1482
            size: props.XYZNonNegativeValues,
            sizeMode: props.XYZSizeModeValues,
        },
    },

    async updated( oldProps, oldState, modifiedProps ) {
        const { size, sizeMode } = modifiedProps

        if (! ( await Super( this ).elementIsMesh() ) ) return

        if ( size || sizeMode ) {
            this._updateGeometryOnSizeChange(this.size)
        }
    },

    async connectedCallback() {
        if (!Super(this).connectedCallback()) return

        this.element.size.on('valuechanged', Private(this).onSizeValueChanged, Private(this))
        this.element.sizeMode.on('valuechanged', Private(this).onSizeValueChanged, Private(this))
    },

    disconnectedCallback() {
        if (!Super(this).disconnectedCallback()) return

        this.element.size.off('valuechanged', Private(this).onSizeValueChanged)
        this.element.sizeMode.off('valuechanged', Private(this).onSizeValueChanged)
    },

    private: {
        onSizeValueChanged() {
            // tells SkateJS' withUpdate (from BaseMeshBehavior) which prop
            // changed and makes it finally trigger our updated method
            // Public(this).size = Public(this).size

            // tells withUpdate (from BaseMeshBehavior) which prop
            // changed and makes it finally trigger our updated method
            Public(this)._modifiedProps.size = true
            Public(this).triggerUpdate()
        },
    },

    _updateGeometryOnSizeChange({ x, y, z }) {
        // TODO PERFORMANCE, re-creating geometries is wasteful, re-use them
        // when possible, and add instancing
        Protected(this).setMeshComponent( this.element, 'geometry', Protected(this).createComponent(this.element) )
    },

}))
