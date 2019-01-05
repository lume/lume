import { BoxGeometry, MeshPhongMaterial } from 'three'
import Class from 'lowclass'
import Mesh from '../../core/Mesh'
import Behavior from './Behavior'

/**
 * Base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a geometry or material instance.
 */
export default
Class( 'BaseMeshBehavior' ).extends( Behavior, ({ Protected, Private, Super }) => ({
    static: {
        // use a getter because Mesh is undefined at module evaluation time due
        // to a circular dependency.
        get requiredElementType() { return Mesh },
    },

    connectedCallback() {
        Super( this ).connectedCallback()
        this.resetMeshComponent()
    },

    resetMeshComponent() {
        // TODO might have to defer so that calculatedSize is already calculated
        Private(this).__setMeshComponent(
            this.element,
            this.constructor.type,
            Protected(this)._createComponent(this.element)
        )
        this.element._needsToBeRendered()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback()

        Private(this).__setDefaultComponent( this.element, this.constructor.type )
        this.element._needsToBeRendered()
    },

    getMeshComponent(name) {
        return this.element.three[name]
    },

    protected: {
        _createComponent() {
            throw new Error('`_createComponent()` is not implemented by subclass.')
        },
    },

    private: {
        // records the initial size of the geometry, so that we have a
        // reference for how much scale to apply when accepting new sizes from
        // the user.
        initialSize: null,

        __setMeshComponent(element, name, newComponent) {
            if ( element.three[ name ] )
                element.three[ name ].dispose()

            element.three[name] = newComponent
        },

        __setDefaultComponent( element, name ) {
            this.__setMeshComponent( element, name, this.__makeDefaultComponent( element, name ) )
        },

        __makeDefaultComponent( element, name ) {
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
