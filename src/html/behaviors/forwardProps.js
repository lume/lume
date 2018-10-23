
import { observe, unobserve } from 'james-bond'
import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import {getInheritedDescriptor} from 'lowclass/utils'

export default
Mixin(Base => Class( 'forwardProps' ).extends( Base, ({ Super, Public, Protected, Private }) => ({

    connectedCallback() {
        Super( this ).connectedCallback && Super( this ).connectedCallback()
        Private( this ).receivePropsFromObject()
    },

    disconnectedCallback() {
        Super( this ).disconnectedCallback && Super( this ).disconnectedCallback()
        Private( this ).unreceivePropsFromObject()
    },

    private: {
        propChangedCallback: ( propName, value ) => undefined,

        receivePropsFromObject() {
            const publicThis = Public( this )
            this.propChangedCallback = ( propName, value ) => publicThis[ propName ] = value
            observe( Protected( this ).observedObject, this.getProps(), this.propChangedCallback, {
                // inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
            } )
        },

        unreceivePropsFromObject() {
            unobserve(Protected( this ).observedObject, this.getProps(), this.propChangedCallback )
        },

        getProps() {
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
    },

    protected: {
        get observedObject() {
            throw new TypeError(`
                The subclass using forwardProps must define a protected
                observedObject property defining the object from which props
                are forwarded.
            `)
        },
    }

})))
