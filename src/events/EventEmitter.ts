// 8:13 - 8:35
// 8:00 - 8:38
// 10:57 - 11:17
// 7:35 - 8:00

export type Handler = (s: string, o: object) => void

/**
 * EventEmitter represents a channel for events.
 *
 * @class EventEmitter
 * @constructor
 */
export class EventEmitter {
    listeners: any
    private _owner: any

    constructor() {
        this.listeners = {}
        this._owner = this
    }

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    emit(type: string, event: any) {
        var handlers = this.listeners[type]
        if (handlers) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].call(this._owner, event)
            }
        }
        return this
    }

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    on(type: string, handler: Handler) {
        if (!(type in this.listeners)) this.listeners[type] = []
        var index = this.listeners[type].indexOf(handler)
        if (index < 0) this.listeners[type].push(handler)
        return this
    }

    /**
     * Alias for "on".
     * @method addListener
     */
    addListener = this.on

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventEmitter} this
     */
    removeListener(type: string, handler: Handler) {
        var listener = this.listeners[type]
        if (listener !== undefined) {
            var index = listener.indexOf(handler)
            if (index >= 0) listener.splice(index, 1)
        }
        return this
    }

    /**
     * Call event handlers with this set to owner.
     *
     * @method bindThis
     *
     * @param {Object} owner object this EventEmitter belongs to
     */
    bindThis(owner: any) {
        this._owner = owner
    }
}
