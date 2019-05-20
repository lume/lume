import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'

const Brand = {}

export default Mixin(Base =>
    Class('Observable').extends(
        Base,
        ({Super, Private}) => ({
            on(eventName, callback, context) {
                if (!Private(this).__eventMap) Private(this).__eventMap = new Map()

                let callbacks = Private(this).__eventMap.get(eventName)

                if (!callbacks) Private(this).__eventMap.set(eventName, (callbacks = []))

                if (typeof callback == 'function') callbacks.push([callback, context])
                // save callback associated with context
                else throw new Error('Expected a function in callback argument of Observable#on.')
            },

            off(eventName, callback) {
                if (!Private(this).__eventMap || !Private(this).__eventMap.has(eventName)) return

                const callbacks = Private(this).__eventMap.get(eventName)

                const index = callbacks.findIndex(tuple => tuple[0] === callback)

                if (index == -1) return

                callbacks.splice(index, 1)

                if (callbacks.length === 0) Private(this).__eventMap.delete(eventName)

                if (Private(this).__eventMap.size === 0) Private(this).__eventMap = null
            },

            emit(eventName, data) {
                if (!Private(this).__eventMap || !Private(this).__eventMap.has(eventName)) return

                const callbacks = Private(this).__eventMap.get(eventName)

                let tuple = undefined
                let callback = undefined
                let context = undefined

                for (let i = 0, len = callbacks.length; i < len; i += 1) {
                    tuple = callbacks[i]
                    callback = tuple[0]
                    context = tuple[1]
                    callback.call(context, data)
                }
            },

            // alias for emit
            trigger(...args) {
                return this.emit(...args)
            },

            // alias for emit
            triggerEvent(...args) {
                return this.emit(...args)
            },

            protected: {Observable: 'Observable'},

            private: {
                __eventMap: null, // Map
            },
        }),
        Brand
    )
)
