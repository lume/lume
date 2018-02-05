import BaseMeshBehavior from './BaseMeshBehavior'

// base class for geometry behaviors
export default
class BaseGeometryBehavior extends BaseMeshBehavior {

    static get type() { return 'geometry' }

    async connectedCallback( element ) {
        if (! ( await super.connectedCallback( element ) ) ) return

        element.on('sizechange', this._updateGeometryOnSizeChange, this)
    }

    _updateGeometryOnSizeChange({ x, y, z }) {
        // TODO PERFORMANCE, re-creating geometries is wasteful, re-use them
        // when possible, and add instancing
        this.setMeshComponent( element, 'geometry', this.createComponent(element) )
    }

    async disconnectedCallback( element ) {
        if (! ( await super.disconnectedCallback( element ) ) ) return

        element.off('sizechange', this._updateGeometryOnSizeChange)
    }

}
