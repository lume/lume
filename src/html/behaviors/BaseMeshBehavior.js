import { BoxGeometry, MeshPhongMaterial } from 'three'
import Class from 'lowclass'
import Behavior from './Behavior'
import { Events } from '../../core/Events'
import Mesh from '../../core/Mesh'

/**
 * Base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a geometry or material instance.
 */
export default
Class( 'BaseMeshBehavior' ).extends( Behavior, ({ Public, Protected, Private, Super }) => ({
    static: {
        // use a getter because Mesh is undefined at module evaluation time due
        // to a circular dependency.
        get requiredElementType() { return Mesh },
    },

    get glLoaded() {
        return Protected(this)._glLoaded
    },

    get cssLoaded() {
        return Protected(this)._cssLoaded
    },

    connectedCallback() {
        Super( this ).connectedCallback()
        this.loadGL()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback()
        this.unloadGL()
    },

    loadGL() {
        if (!this.element.three) return

        if (Protected(this)._glLoaded) return
        Protected(this)._glLoaded = true

        this.resetMeshComponent()

        this.triggerUpdateForAllProps()
        this.element.needsUpdate()
    },

    unloadGL() {
        if (!Protected(this)._glLoaded) return
        Protected(this)._glLoaded = false

        // if the behavior is being disconnected, but the element still has GL
        // mode (.three), then leave the element with a default mesh GL
        // component to be rendered.
        if (this.element.three)
            Private(this).__setDefaultComponent( this.element, this.constructor.type )
        else
            Private(this).__disposeMeshComponent( this.element, this.constructor.type )

        this.element.needsUpdate()
    },

    resetMeshComponent() {
        // TODO We might have to defer so that calculatedSize is already calculated
        // (note, resetMeshComponent is only called when the size prop has
        // changed)
        Private(this).__setMeshComponent(
            this.element,
            this.constructor.type,
            Protected(this)._createComponent(this.element)
        )
        this.element.needsUpdate()
    },

    getMeshComponent(name) {
        return this.element.three[name]
    },

    protected: {
        _glLoaded: false,
        _cssLoaded: false,

        _createComponent() {
            throw new Error('`_createComponent()` is not implemented by subclass.')
        },

        _listenToElement() {
            Super(this)._listenToElement()

            Public(this).element.on(Events.BEHAVIOR_GL_LOAD, Public(this).loadGL, Public(this))
            Public(this).element.on(Events.BEHAVIOR_GL_UNLOAD, Public(this).unloadGL, Public(this))
        },

        _unlistenToElement() {
            Super(this)._unlistenToElement()

            Public(this).element.off(Events.BEHAVIOR_GL_LOAD, Public(this).loadGL)
            Public(this).element.off(Events.BEHAVIOR_GL_UNLOAD, Public(this).unloadGL)
        },
    },

    private: {
        // records the initial size of the geometry, so that we have a
        // reference for how much scale to apply when accepting new sizes from
        // the user.
        initialSize: null,

        __disposeMeshComponent(element, name) {
            if ( element.three[ name ] )
                element.three[ name ].dispose()
        },

        __setMeshComponent(element, name, newComponent) {
            this.__disposeMeshComponent(element, name)

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
