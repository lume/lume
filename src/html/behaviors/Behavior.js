import 'element-behaviors'
import Class from 'lowclass'
import {withUpdate} from '@trusktr/skatejs'
import native from 'lowclass/native'
import ForwardProps from './ForwardProps'
import Node from '../../core/Node'

/**
 * Base class for all behaviors
 *
 */
export default
Class( 'Behavior' ).extends( native( withUpdate( ForwardProps ) ), ({ Public, Protected, Private, Super }) => ({
    static: {
        // use a getter because Mesh is undefined at module evaluation time due
        // to a circular dependency.
        get requiredElementType() { return Node },
    },

    constructor(element) {
        let _this = Super(this).constructor()

        _this.element = element

        Private(this).__checkElementIsLibraryElement(element)

        return _this
    },

    // This could be useful, but at the moment we only need this because if it
    // returns falsey (i.e. undefined) then skatejs won't fire `updated` because
    // it returns early if !this.parentNode in triggerUpdate.
    get parentNode() {
        return this.element.parentNode
    },

    // proxy setAttribute to this.element so that SkateJS withUpdate works in certain cases
    setAttribute(name, value) {
        this.element.setAttribute(name, value)
    },

    refreshAllProps() {
        if (!this.constructor.props) return

        for (const prop in this.constructor.props) {
            this._modifiedProps[prop] = true
        }

        this.triggerUpdate()
    },

    connectedCallback() {
        Super( this ).connectedCallback()
        Protected(this)._listenToElement()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback()
        Protected(this)._unlistenToElement()
    },

    protected: {
        // used by ForwardProps. See ForwardProps.js
        get _observedObject() {
            return Public( this ).element
        },

        _listenToElement() {
            // subclasses: add event listeners
        },

        _unlistenToElement() {
            // subclasses: remove event listeners
        },
    },

    private: {

        // TODO add a test to make sure this check works
        async __checkElementIsLibraryElement(element) {
            const pub = Public(this)
            const BaseClass = Public(this).constructor.requiredElementType

            if ( element.nodeName.includes('-') ) {
                const whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())
                    .then(() => {
                        if (element instanceof BaseClass) return true
                        else return false
                    })

                const timeout = new Promise(r => setTimeout(r, 10000))

                const isNode = await Promise.race([whenDefined, timeout])

                if (!isNode) throw new Error(`
                    Either the element you're using the behavior on is not an
                    instance of ${BaseClass.name}, or there was a 10-second timeout
                    waiting for the element to be defined.
                `)
            }
            else {
                throw new Error(`
                    The element you're using the mesh behavior on is not an
                    instance of ${BaseClass.name}.
                `)
            }
        },

    },

}))
