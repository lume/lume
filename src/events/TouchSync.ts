import {TouchTracker} from './TouchTracker'
import {EventHandler} from './EventHandler'
import {OptionsManager} from './OptionsManager'

var MINIMUM_TICK_TIME = 8

/**
 * Handles piped in touch events. Emits 'start', 'update', and 'events'
 *   events with delta, position, velocity, acceleration, clientX, clientY, count, and touch id.
 *   Useful for dealing with inputs on touch devices. Designed to be used either as standalone, or
 *   included in a GenericSync.
 *
 * @class TouchSync
 * @constructor
 *
 * @example
 *   var Surface = require('../core/Surface');
 *   var TouchSync = require('../inputs/TouchSync');
 *
 *   var surface = new Surface({ size: [100, 100] });
 *   var touchSync = new TouchSync();
 *   surface.pipe(touchSync);
 *
 *   touchSync.on('start', function (e) { // react to start });
 *   touchSync.on('update', function (e) { // react to update });
 *   touchSync.on('end', function (e) { // react to end });*
 *
 * @param [options] {Object}             default options overrides
 * @param [options.direction] {Number}   read from a particular axis
 * @param [options.rails] {Boolean}      read from axis with greatest differential
 * @param [options.velocitySampleLength] {Number}  Number of previous frames to check velocity against.
 * @param [options.scale] {Number}       constant factor to scale velocity output
 * @param [options.touchLimit] {Number}  touchLimit upper bound for emitting events based on number of touches
 */
export class TouchSync {
    static DEFAULT_OPTIONS = {
        direction: undefined,
        rails: false,
        touchLimit: 1,
        velocitySampleLength: 10,
        scale: 1,
    }

    static DIRECTION_X = 0
    static DIRECTION_Y = 1

    options: any
    _optionsManager: OptionsManager
    _eventOutput: EventHandler
    _touchTracker: TouchTracker

    _payload: {
        delta: any
        position: any
        velocity: any
        clientX: any
        clientY: any
        count: any
        touch: any
    }

    _position: any

    constructor(options: any) {
        this.options = Object.create(TouchSync.DEFAULT_OPTIONS)
        this._optionsManager = new OptionsManager(this.options)
        if (options) this.setOptions(options)

        this._eventOutput = new EventHandler()
        this._touchTracker = new TouchTracker({
            touchLimit: this.options.touchLimit,
        })

        EventHandler.setOutputHandler(this, this._eventOutput)
        EventHandler.setInputHandler(this, this._touchTracker)

        this._touchTracker.on('trackstart', this._handleStart.bind(this))
        this._touchTracker.on('trackmove', this._handleMove.bind(this))
        this._touchTracker.on('trackend', this._handleEnd.bind(this))

        this._payload = {
            delta: null,
            position: null,
            velocity: null,
            clientX: undefined,
            clientY: undefined,
            count: 0,
            touch: undefined,
        }

        this._position = null // to be deprecated
    }

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.scale] {Number}       constant factor to scale velocity output
     */
    setOptions(options: any) {
        return this._optionsManager.setOptions(options)
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    getOptions() {
        return this.options
    }

    /**
     *  Triggered by trackstart.
     *  @method _handleStart
     *  @private
     */
    private _handleStart(data: any) {
        var velocity
        var delta
        if (this.options.direction !== undefined) {
            this._position = 0
            velocity = 0
            delta = 0
        } else {
            this._position = [0, 0]
            velocity = [0, 0]
            delta = [0, 0]
        }

        var payload = this._payload
        payload.delta = delta
        payload.position = this._position
        payload.velocity = velocity
        payload.clientX = data.x
        payload.clientY = data.y
        payload.count = data.count
        payload.touch = data.identifier

        this._eventOutput.emit('start', payload)
    }

    /**
     *  Triggered by trackmove.
     *  @method _handleMove
     *  @private
     */
    private _handleMove(data: any) {
        var history = data.history

        var currHistory = history[history.length - 1]
        var prevHistory = history[history.length - 2]

        var distantHistory = history[history.length - this.options.velocitySampleLength]
            ? history[history.length - this.options.velocitySampleLength]
            : history[history.length - 2]

        var distantTime = distantHistory.timestamp
        var currTime = currHistory.timestamp

        var diffX = currHistory.x - prevHistory.x
        var diffY = currHistory.y - prevHistory.y

        var velDiffX = currHistory.x - distantHistory.x
        var velDiffY = currHistory.y - distantHistory.y

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0
            else diffX = 0

            if (Math.abs(velDiffX) > Math.abs(velDiffY)) velDiffY = 0
            else velDiffX = 0
        }

        var diffTime = Math.max(currTime - distantTime, MINIMUM_TICK_TIME)

        var velX = velDiffX / diffTime
        var velY = velDiffY / diffTime

        var scale = this.options.scale
        var nextVel
        var nextDelta

        if (this.options.direction === TouchSync.DIRECTION_X) {
            nextDelta = scale * diffX
            nextVel = scale * velX
            this._position += nextDelta
        } else if (this.options.direction === TouchSync.DIRECTION_Y) {
            nextDelta = scale * diffY
            nextVel = scale * velY
            this._position += nextDelta
        } else {
            nextDelta = [scale * diffX, scale * diffY]
            nextVel = [scale * velX, scale * velY]
            this._position[0] += nextDelta[0]
            this._position[1] += nextDelta[1]
        }

        var payload = this._payload
        payload.delta = nextDelta
        payload.velocity = nextVel
        payload.position = this._position
        payload.clientX = data.x
        payload.clientY = data.y
        payload.count = data.count
        payload.touch = data.identifier

        this._eventOutput.emit('update', payload)
    }

    /**
     *  Triggered by trackend.
     *  @method _handleEnd
     *  @private
     */
    private _handleEnd(data: any) {
        this._payload.count = data.count
        this._eventOutput.emit('end', this._payload)
    }
}
