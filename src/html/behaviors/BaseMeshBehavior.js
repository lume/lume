import { BoxGeometry, MeshPhongMaterial } from 'three'
import Mesh from '../../core/Mesh'

// base class for Geometry and Material behaviors
export default
class BaseMeshBehavior {
    constructor(element) {

        // records the initial size of the geometry, so that we have a
        // reference for how much scale to apply when accepting new sizes from
        // the user.
        this.initialSize = null;

        this.isMeshPromise = null
        this.resolveIsMeshPromise = null
        // TODO cancellable promise, or it may leak

        if ( element.nodeName.includes('-') ) {
            this.isMeshPromise = new Promise(r => this.resolveIsMeshPromise = r)
            customElements.whenDefined(element.nodeName.toLowerCase())
            .then(() => {
                if (element instanceof Mesh) this.resolveIsMeshPromise(true)
                else this.resolveIsMeshPromise(false)
            })
        }
        else this.isMeshPromise = Promise.resolve(false)
    }

    async checkElementIsMesh(element) {
        const isMesh = await this.isMeshPromise
        if ( ! isMesh ) {
            console.warn( `${this.constructor.name} is only for use on elements of type Mesh, otherwise it won't do anything. You element was:`, element )
        }
        return isMesh
    }

    setMeshComponent(element, name, newComponent) {
        if ( element.threeObject3d[ name ] )
            element.threeObject3d[ name ].dispose()

        element.threeObject3d[name] = newComponent
    }

    setDefaultComponent( element, name ) {
        this.setMeshComponent( element, name, this.makeDefaultComponent( element, name ) )
    }

    makeDefaultComponent( element, name ) {
        if (name == 'geometry') {
            return new BoxGeometry(
                element.calculatedSize.x,
                element.calculatedSize.y,
                element.calculatedSize.z,
            )
        }
        else if (name == 'material') {
            return new MeshPhongMaterial( { color: 0xff6600 } )
        }
    }
}
