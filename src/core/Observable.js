import Mixin from './Mixin'
import Class from 'lowclass'

export default
Mixin(Base =>

    Class('Observable').extends( Base, ({ Super }) => ({

        construct(...args) {
            Super(this).construct(...args)
        },

        on(eventName, callback, context) {
            if (!this._eventMap)
                this._eventMap = new Map

            let callbacks = this._eventMap.get(eventName)

            if (!callbacks)
                this._eventMap.set(eventName, callbacks = [])

            if (typeof callback == 'function')
                callbacks.push([callback, context]) // save callback associated with context
            else
                throw new Error('Expected a function in callback argument of Observable#on.')
        },

        off(eventName, callback) {
            if (!this._eventMap || !this._eventMap.has(eventName)) return

            const callbacks = this._eventMap.get(eventName)

            const index = callbacks.findIndex(tuple => tuple[0] === callback)

            if (index == -1) return

            callbacks.splice(index, 1)

            if (callbacks.length === 0) this._eventMap.delete(eventName)

            if (this._eventMap.size === 0) this._eventMap = null
        },

        trigger(eventName, data) {
            if (!this._eventMap || !this._eventMap.has(eventName)) return

            const callbacks = this._eventMap.get(eventName)

            let tuple = undefined
            let callback = undefined
            let context = undefined

            for (let i=0, len=callbacks.length; i<len; i+=1) {
                tuple = callbacks[i]
                callback = tuple[0]
                context = tuple[1]
                callback.call(context, data)
            }
        },

        // alias for trigger
        triggerEvent(...args) {
            return this.trigger(...args)
        },
    }))

)
