import { BoxGeometry, MeshPhongMaterial } from 'three'
import Mesh from '../../core/Mesh'
import ValueProcessor from '../../core/ValueProcessor'
import Class from 'lowclass'

// base class for Geometry and Material behaviors, not to be used directly
export default
Class( 'BaseMeshBehavior' ).extends( ValueProcessor, ({ Protected, Private, Super }) => ({
    constructor(element) {
        Super(this).constructor()

        this.element = element

        let resolveIsMeshPromise = null
        // TODO cancellable promise, or it may leak

        if ( element.nodeName.includes('-') ) {
            Private(this).isMeshPromise = new Promise(r => resolveIsMeshPromise = r)
            customElements.whenDefined(element.nodeName.toLowerCase())
            .then(() => {
                if (element instanceof Mesh) resolveIsMeshPromise(true)
                else resolveIsMeshPromise(false)
            })
        }
        else Private(this).isMeshPromise = Promise.resolve(false)
    },

    async connectedCallback() {
        const self = Private(this)

        if ( ! self.checkedElementIsMesh ) await self.checkElementIsMesh(this.element)
        if ( ! self.elementIsMesh ) return false

        // TODO might have to defer so that calculatedSize is already calculated
        //console.log('hmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
        Protected(this).setMeshComponent(
            this.element,
            this.constructor.type,
            Protected(this).createComponent(this.element)
        )
        this.element._needsToBeRendered()

        return true
    },

    async disconnectedCallback() {
        const self = Private(this)

        if ( ! self.checkedElementIsMesh ) await self.checkElementIsMesh(this.element)
        if ( ! self.elementIsMesh ) return false

        Protected(this).setDefaultComponent( this.element, this.constructor.type )
        this.element._needsToBeRendered()

        return true
    },

    async attributeChangedCallback( attr, oldValue, newValue ) {
        const self = Private(this)

        if ( ! self.checkedElementIsMesh ) await self.checkElementIsMesh(this.element)
        if ( ! self.elementIsMesh ) return false
        return true
    },

    private: {
        checkedElementIsMesh: false,
        elementIsMesh: false,

        // records the initial size of the geometry, so that we have a
        // reference for how much scale to apply when accepting new sizes from
        // the user.
        initialSize: null,

        isMeshPromise: null,

        async checkElementIsMesh(element) {
            const self = Private(this)

            self.elementIsMesh = await self.isMeshPromise
            self.checkedElementIsMesh = true

            if ( ! self.elementIsMesh ) {
                console.warn( `${this.constructor.name} is only for use on elements of type Mesh, otherwise it won't do anything. You element was:`, element )
            }
        },
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
