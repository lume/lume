const instanceofSymbol = Symbol('instanceofSymbol')

// This class needs to be the base most class of any APIs that are to be used
// imperatively.
//
// All constructors assume an object (options) was passed in, but due to using
// document-register-element that isn't always the case, so we instead start
// handling of options after all the constructors have been called
// (this.construct here in the base-most imperative class). If the DOM
// instantiated our class, there won't be an options argument passed in, but
// rather there will be an Element instance passed in, and we detect this to
// call super() appropriately for document-register-element to function
// properly.
//
// If the constructor doesn't receive an Element argument, then it means the
// class is being used imperatively, or that native Custom Elements v1 is being
// used. In either of these two cases, we don't need to pass anything to
// super().
const ImperativeDeclarativeAdapterMixin = base => {
    class ImperativeDeclarativeAdapter extends base {
        constructor(options = {}) {
            let _this = null

            // call super in a way that works for document-register-element,
            // but still works with native Custom Elements.
            // If `options` has `.nodeName`, then it is an Element.
            if (options.nodeName) {
                _this = super(options)
                _this.construct()
            }
            else {
                // else we're using the class imperatively or with native CE v1.
                _this = super()
                _this.construct(options)
            }

            return _this
        }

        // subclasses extend this, and they should not use `constructor`
        // directly.
        construct() {}
    }

    Object.defineProperty(ImperativeDeclarativeAdapter, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== ImperativeDeclarativeAdapter) return Object.getPrototypeOf(ImperativeDeclarativeAdapter)[Symbol.hasInstance].call(this, obj)

            let currentProto = obj

            while(currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                    return true

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    ImperativeDeclarativeAdapter[instanceofSymbol] = true

    return ImperativeDeclarativeAdapter
}

const ImperativeDeclarativeAdapter = ImperativeDeclarativeAdapterMixin(class{})
ImperativeDeclarativeAdapter.mixin = ImperativeDeclarativeAdapterMixin

export {ImperativeDeclarativeAdapter as default}
