import {observe, unobserve} from 'james-bond'
import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'

const Brand = {}

export default Mixin(Base =>
    Class('ForwardProps').extends(
        Base,
        ({Super, Public, Protected, Private}) => ({
            constructor() {
                super()
                this.__propChangedCallback = this.__propChangedCallback.bind(this)
            },

            connectedCallback() {
                super.connectedCallback && super.connectedCallback()
                this.__forwardInitialProps()
                this.__observeProps()
            },

            disconnectedCallback() {
                super.disconnectedCallback && super.disconnectedCallback()
                this.__unobserveProps()
            },

            private: {
                __propChangedCallback(propName, value) {
                    // `this` here is `this`, it gets bound in `constructor`
                    this[propName] = value
                },

                __observeProps() {
                    observe(this._observedObject, this.__getProps(), this.__propChangedCallback, {
                        // inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
                    })
                },

                __unobserveProps() {
                    unobserve(this._observedObject, this.__getProps(), this.__propChangedCallback)
                },

                __getProps() {
                    let result
                    const props = this.constructor.props

                    if (Array.isArray(props)) result = props
                    else {
                        result = []
                        if (typeof props === 'object') for (const prop in props) result.push(prop)
                    }

                    return result
                },

                __forwardInitialProps() {
                    const observed = this._observedObject

                    for (const prop of this.__getProps()) {
                        prop in observed && this.__propChangedCallback(prop, observed[prop])
                    }
                },
            },

            protected: {
                get _observedObject() {
                    throw new TypeError(`
                The subclass using ForwardProps must define a protected
                _observedObject property defining the object from which props
                are forwarded.
            `)
                },
            },
        }),
        Brand
    )
)
