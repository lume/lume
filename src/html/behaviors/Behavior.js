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

        Private(_this).__checkElementIsLibraryElement(element)

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

    // We use __elementDefined in the following methods so we can delay prop
    // handling until the elements are upgraded and their APIs exist.
    //
    // NOTE, another way we could've achieved this is to let elements emit an
    // event in connectedCallback, at which point the element is guaranteed to
    // be upgraded. We currently do emit the GL_LOAD event. Which can only
    // happen when the element is upgrade AND has loaded GL objects (and these
    // behaviors only care about GL obbjects at the moment) so it'd be possible
    // to rely only on that event for the GL behaviors (which they all currently
    // are). If we have behaviors that work with CSS, not GL, then we could rely
    // on the CSS_LOAD event. In any case, the current solution is more generic,
    // for use with any type of custom elements.

    async attributeChangedCallback(...args) {
        if (!Private(this).__elementDefined)
            await Private(this).__whenDefined

        Super(this).attributeChangedCallback(...args)
    },

    async connectedCallback() {
        if (!Private(this).__elementDefined)
            await Private(this).__whenDefined

        Super( this ).connectedCallback()

        Protected(this)._listenToElement()
    },

    async disconnectedCallback() {
        if (!Private(this).__elementDefined)
            await Private(this).__whenDefined

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
        // a promise resolved when an element is upgraded
        __whenDefined: null,

        // we need to wait for __elementDefined to be true because running the
        // superclass logic, otherwise `updated()` calls can happen before the
        // element is upgraded (i.e. before any APIs are available).
        __elementDefined: false,

        // TODO add a test to make sure this check works
        async __checkElementIsLibraryElement(element) {
            const pub = Public(this)
            const BaseClass = Public(this).constructor.requiredElementType

            if ( element.nodeName.includes('-') ) {
                this.__whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())

                // We use `.then` here on purpose, so that setting
                // __elementDefined happens in the very first microtask after
                // __whenDefined is resolved. Otherwise if we set
                // __elementDefined after awaiting the following Promise.race,
                // then it will happen on the second microtask after
                // __whenDefined is resolved. Our goal is to have APIs ready as
                // soon as possible in the methods above that wait for
                // __whenDefined.
                this.__whenDefined.then(() => {
                    this.__elementDefined = element instanceof BaseClass
                })

                await Promise.race([
                    this.__whenDefined,
                    new Promise(r => setTimeout(r, 1000))
                ])

                if (!this.__elementDefined) throw new Error(`
                    Either the element you're using the behavior on is not an
                    instance of ${BaseClass.name}, or there was a 1-second
                    timeout waiting for the element to be defined. Please make
                    sure all elements you intend to use are defined.
                `)
            }
            else {
                throw new Error(`
                    The element you're using the mesh behavior on (<${element.tagName.toLowerCase()}>)
                    is not an instance of ${BaseClass.name}.
                `)
            }
        },

    },

}))
