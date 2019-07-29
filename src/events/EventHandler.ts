import {EventEmitter, Handler} from './EventEmitter'
import {TouchTracker} from './TouchTracker'

/**
 * EventHandler forwards received events to a set of provided callback functions.
 * It allows events to be captured, processed, and optionally piped through to other event handlers.
 *
 * @class EventHandler
 * @extends EventEmitter
 * @constructor
 */
export class EventHandler extends EventEmitter {
    private downstream: any[]
    private downstreamFn: any[]
    private upstream: any[]
    private upstreamListeners: any

    /**
     * Assign an event handler to receive an object's input events.
     *
     * @method setInputHandler
     * @static
     *
     * @param {Object} object object to mix trigger, subscribe, and unsubscribe functions into
     * @param {EventHandler} handler assigned event handler
     */
    static setInputHandler(object: any, handler: EventHandler | TouchTracker) {
        object.emit = handler.trigger.bind(handler)
        object.trigger = handler.trigger.bind(handler)
        if (handler.subscribe && handler.unsubscribe) {
            object.subscribe = handler.subscribe.bind(handler)
            object.unsubscribe = handler.unsubscribe.bind(handler)
        }
    }

    /**
     * Assign an event handler to receive an object's output events.
     *
     * @method setOutputHandler
     * @static
     *
     * @param {Object} object object to mix pipe, unpipe, on, addListener, and removeListener functions into
     * @param {EventHandler} handler assigned event handler
     */
    static setOutputHandler(object: any, handler: EventHandler) {
        if (handler instanceof EventHandler) handler.bindThis(object)
        object.pipe = handler.pipe.bind(handler)
        object.unpipe = handler.unpipe.bind(handler)
        object.on = handler.on.bind(handler)
        object.addListener = object.on
        object.removeListener = handler.removeListener.bind(handler)
    }

    constructor() {
        super()

        this.downstream = [] // downstream event handlers
        this.downstreamFn = [] // downstream functions

        this.upstream = [] // upstream event handlers
        this.upstreamListeners = {} // upstream listeners
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
    emit(type: string, event: any): this {
        super.emit.apply(type, event)
        var i = 0
        for (i = 0; i < this.downstream.length; i++) {
            if (this.downstream[i].trigger) this.downstream[i].trigger(type, event)
        }
        for (i = 0; i < this.downstreamFn.length; i++) {
            this.downstreamFn[i](type, event)
        }
        return this
    }

    /**
     * Alias for emit
     * @method addListener
     */
    trigger = this.emit

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    pipe(target: EventHandler): EventHandler {
        if (target.subscribe instanceof Function) return target.subscribe(this)

        var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream
        var index = downstreamCtx.indexOf(target)
        if (index < 0) downstreamCtx.push(target)

        if (target instanceof Function) target('pipe', null)
        else if (target.trigger) target.trigger('pipe', null)

        return target
    }

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    unpipe(target: EventHandler): false | EventHandler {
        if (target.unsubscribe instanceof Function) return target.unsubscribe(this)

        var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream
        var index = downstreamCtx.indexOf(target)
        if (index >= 0) {
            downstreamCtx.splice(index, 1)
            if (target instanceof Function) target('unpipe', null)
            else if (target.trigger) target.trigger('unpipe', null)
            return target
        } else return false
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
    on(type: string, handler: Handler): this {
        super.on(type, handler)
        if (!(type in this.upstreamListeners)) {
            var upstreamListener = this.trigger.bind(this, type)
            this.upstreamListeners[type] = upstreamListener
            for (var i = 0; i < this.upstream.length; i++) {
                this.upstream[i].on(type, upstreamListener)
            }
        }
        return this
    }

    /**
     * Alias for "on"
     * @method addListener
     */
    addListener = this.on

    /**
     * Listen for events from an upstream event handler.
     *
     * @method subscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    subscribe(source: EventEmitter) {
        var index = this.upstream.indexOf(source)
        if (index < 0) {
            this.upstream.push(source)
            for (var type in this.upstreamListeners) {
                source.on(type, this.upstreamListeners[type])
            }
        }
        return this
    }

    /**
     * Stop listening to events from an upstream event handler.
     *
     * @method unsubscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    unsubscribe(source: EventEmitter) {
        var index = this.upstream.indexOf(source)
        if (index >= 0) {
            this.upstream.splice(index, 1)
            for (var type in this.upstreamListeners) {
                source.removeListener(type, this.upstreamListeners[type])
            }
        }
        return this
    }
}
