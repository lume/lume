import BaseMeshBehavior from './BaseMeshBehavior'
import Class from 'lowclass'

// base class for geometry behaviors
export default
Class( 'BaseGeometryBehavior' ).extends( BaseMeshBehavior, ({ Protected, Super }) => ({

    static: {
        type: 'geometry',
    },

    async connectedCallback( element ) {
        if (! ( await Super(this).connectedCallback( element ) ) ) return
        this.element = element
        element.on('sizechange', this._updateGeometryOnSizeChange, this)
    },

    _updateGeometryOnSizeChange({ x, y, z }) {
        // TODO PERFORMANCE, re-creating geometries is wasteful, re-use them
        // when possible, and add instancing
        Protected(this).setMeshComponent( this.element, 'geometry', Protected(this).createComponent(this.element) )
    },

    async disconnectedCallback( element ) {
        if (! ( await Super(this).disconnectedCallback( element ) ) ) return

        element.off('sizechange', this._updateGeometryOnSizeChange)
    },

}))
