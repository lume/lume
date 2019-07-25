import {EventHandler} from './EventHandler'
import {EventEmitter} from 'events'
import {Handler} from './EventEmitter'

var _now = Date.now

interface EventHandlerMixin {
    trigger: (type: string, event: any) => this
    emit: (type: string, event: any) => this
    subscribe: (source: EventEmitter) => void
    unsubscribe: (source: EventEmitter) => void
    pipe: (target: EventHandler) => EventHandler
    unpipe: (target: EventHandler) => false | EventHandler
    on: (type: string, handler: Handler) => this
    addListener: (type: string, handler: Handler) => this
    removeListener: (type: string, handler: Handler) => void
}

/**
 * Helper to TouchSync – tracks piped in touch events, organizes touch
 *   events by ID, and emits track events back to TouchSync.
 *   Emits 'trackstart', 'trackmove', and 'trackend' events upstream.
 *
 * @class TouchTracker
 * @constructor
 * @param {Object} options default options overrides
 * @param [options.selective] {Boolean} selective if false, saves state for each touch
 * @param [options.touchLimit] {Number} touchLimit upper bound for emitting events based on number of touches
 */
export interface TouchTracker extends EventHandlerMixin {}
export class TouchTracker {
    selective: boolean
    touchLimit: number
    touchHistory: any
    eventInput: EventHandler
    eventOutput: EventHandler
    isTouched: boolean

    constructor(options: any) {
        this.selective = options.selective
        this.touchLimit = options.touchLimit || 1

        this.touchHistory = {}

        this.eventInput = new EventHandler()
        this.eventOutput = new EventHandler()

        EventHandler.setInputHandler(this, this.eventInput)
        EventHandler.setOutputHandler(this, this.eventOutput)

        this.eventInput.on('touchstart', this._handleStart.bind(this))
        this.eventInput.on('touchmove', this._handleMove.bind(this))
        this.eventInput.on('touchend', this._handleEnd.bind(this))
        this.eventInput.on('touchcancel', this._handleEnd.bind(this))
        this.eventInput.on('unpipe', this._handleUnpipe.bind(this))

        this.isTouched = false
    }

    /**
     * Record touch data, if selective is false.
     * @private
     * @method track
     * @param {Object} data touch data
     */
    private track(data: any) {
        this.touchHistory[data.identifier] = [data]
    }

    private _timestampTouch(touch: any, event: any, history: any) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier: touch.identifier,
            origin: event.origin,
            timestamp: _now(),
            count: event.touches.length,
            history: history,
        }
    }

    private _handleStart(event: any) {
        if (event.touches.length > this.touchLimit) return
        this.isTouched = true

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i]
            var data = this._timestampTouch(touch, event, null)
            this.eventOutput.emit('trackstart', data)
            if (!this.selective && !this.touchHistory[touch.identifier]) this.track(data)
        }
    }

    private _handleMove(event: any) {
        if (event.touches.length > this.touchLimit) return

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i]
            var history = this.touchHistory[touch.identifier]
            if (history) {
                var data = this._timestampTouch(touch, event, history)
                this.touchHistory[touch.identifier].push(data)
                this.eventOutput.emit('trackmove', data)
            }
        }
    }

    private _handleEnd(event: any) {
        if (!this.isTouched) return

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i]
            var history = this.touchHistory[touch.identifier]
            if (history) {
                var data = this._timestampTouch(touch, event, history)
                this.eventOutput.emit('trackend', data)
                delete this.touchHistory[touch.identifier]
            }
        }

        this.isTouched = false
    }

    private _handleUnpipe() {
        for (var i in this.touchHistory) {
            var history = this.touchHistory[i]
            this.eventOutput.emit('trackend', {
                touch: history[history.length - 1].touch,
                timestamp: Date.now(),
                count: 0,
                history: history,
            })
            delete this.touchHistory[i]
        }
    }
}
