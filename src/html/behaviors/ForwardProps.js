
import { observe, unobserve } from 'james-bond'
import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import {getInheritedDescriptor} from 'lowclass/utils'

export default
Mixin(Base => Class( 'ForwardProps' ).extends( Base, ({ Super, Public, Protected, Private }) => ({
    constructor() {
        Super( this ).constructor()
        Private( this ).__propChangedCallback = Private( this ).__propChangedCallback.bind( this )
    },

    connectedCallback() {
        Super( this ).connectedCallback && Super( this ).connectedCallback()
        Private( this ).__forwardInitialProps()
        Private( this ).__observeProps()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback && Super( this ).disconnectedCallback()
        Private( this ).__unobserveProps()
    },

    private: {
        __propChangedCallback( propName, value ) {
            // `this` here is `Public(this)`, it gets bound in `constructor`
            this[ propName ] = value
        },

        __observeProps() {
            observe( Protected( this )._observedObject, this.__getProps(), this.__propChangedCallback, {
                // inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
            } )
        },

        __unobserveProps() {
            unobserve(Protected( this )._observedObject, this.__getProps(), this.__propChangedCallback )
        },

        __getProps() {
            let result
            const props = Public( this ).constructor.props

            if ( Array.isArray( props ) ) result = props
            else {
                result = []
                if ( typeof props === 'object' )
                    for ( const prop in props )
                        result.push( prop )
            }

            return result
        },

        __forwardInitialProps() {
            const observed = Protected( this )._observedObject

            for ( const prop of this.__getProps() ) {
                prop in observed && this.__propChangedCallback( prop, observed[ prop ] )
            }
        },
        // FIXME, for some reason elements are getting unrelated props on them.
        // For example a "texture" prop on Scene elements is being observed
        // (therefore the getter exists on Scene instances, maybe on the
        // prototype) although Scenes don't have "texture" props. We have the
        // temporary `prop in observed` code here to avoid calling
        // __propChangedCallback on those props, but this is brittle.
    },

    protected: {
        get _observedObject() {
            throw new TypeError(`
                The subclass using ForwardProps must define a protected
                _observedObject property defining the object from which props
                are forwarded.
            `)
        },
    }

})))
