import BaseMeshBehavior from './BaseMeshBehavior'

// base class for geometry behaviors
export default
class BaseGeometryBehavior extends BaseMeshBehavior {

    static get type() { return 'geometry' }

    constructor( element ) {
        super( element )
        this._updateGeometryOnSizeChange = null
    }

    async connectedCallback( element ) {
        if (! ( await super.connectedCallback( element ) ) ) return

        this._updateGeometryOnSizeChange = ({ x, y, z }) => {
            this.setMeshComponent( element, 'geometry', this.createComponent(element) )
        }
        element.on('sizechange', this._updateGeometryOnSizeChange)
    }

    async disconnectedCallback( element ) {
        if (! ( await super.disconnectedCallback( element ) ) ) return

        element.off('sizechange', this._updateGeometryOnSizeChange)
        this._updateGeometryOnSizeChange = null
    }

}
