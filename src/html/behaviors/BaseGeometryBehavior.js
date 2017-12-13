import BaseMeshBehavior from './BaseMeshBehavior'

// base class for geometry behaviors
export default
class BaseGeometryBehavior extends BaseMeshBehavior {

    static get type() { return 'geometry' }

    async connectedCallback( element ) {
        if (! ( await super.connectedCallback( element ) ) ) return

        element.on('sizechange', ({ x, y, z }) => {
            this.setMeshComponent( element, 'geometry', this.createComponent(element) )
        })
    }

}
