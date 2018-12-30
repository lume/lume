import { BoxGeometry, MeshPhongMaterial } from 'three'
import Class from 'lowclass'
import Mesh from '../../core/Mesh'
import Behavior from './Behavior'

/**
 * Base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * createComponent() - return a geometry or material instance.
 */
export default
Class( 'BaseMeshBehavior' ).extends( Behavior, ({ Public, Protected, Private, Super }) => ({
    static: {
        // use a getter because Mesh is undefined at module evaluation time due
        // to a circular dependency.
        get requiredElementType() { return Mesh },
    },

    connectedCallback() {
        Super( this ).connectedCallback()

        // TODO might have to defer so that calculatedSize is already calculated
        Protected(this).setMeshComponent(
            this.element,
            this.constructor.type,
            Protected(this).createComponent(this.element)
        )
        this.element._needsToBeRendered()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback()

        Protected(this).setDefaultComponent( this.element, this.constructor.type )
        this.element._needsToBeRendered()
    },

    getMeshComponent(name) {
        return this.element.threeObject3d[name]
    },

    private: {
        // records the initial size of the geometry, so that we have a
        // reference for how much scale to apply when accepting new sizes from
        // the user.
        initialSize: null,
    },

    protected: {
        createComponent() {
            throw new Error('`createComponent()` is not implemented by subclass.')
        },

        setMeshComponent(element, name, newComponent) {
            if ( element.threeObject3d[ name ] )
                element.threeObject3d[ name ].dispose()

            element.threeObject3d[name] = newComponent
        },

        setDefaultComponent( element, name ) {
            this.setMeshComponent( element, name, this.makeDefaultComponent( element, name ) )
        },

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
        },
    },
}))
