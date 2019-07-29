import {EventHandler} from './EventHandler'

/**
 *  A collection of methods for setting options which can be extended
 *  onto other classes.
 *
 *
 *  **** WARNING ****
 *  You can only pass through objects that will compile into valid JSON.
 *
 *  Valid options:
 *      Strings,
 *      Arrays,
 *      Objects,
 *      Numbers,
 *      Nested Objects,
 *      Nested Arrays.
 *
 *    This excludes:
 *        Document Fragments,
 *        Functions
 * @class OptionsManager
 * @constructor
 * @param {Object} value options dictionary
 */
export class OptionsManager {
    _value: any
    eventOutput: EventHandler | null

    constructor(value: any) {
        this._value = value
        this.eventOutput = null
    }

    /**
     * Create options manager from source dictionary with arguments overriden by patch dictionary.
     *
     * @static
     * @method OptionsManager.patch
     *
     * @param {Object} source source arguments
     * @param {...Object} data argument additions and overwrites
     * @return {Object} source object
     */
    static patch(source: any, _data: any) {
        var manager = new OptionsManager(source)
        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i])
        return source
    }

    private _createEventOutput() {
        this.eventOutput = new EventHandler()
        this.eventOutput.bindThis(this)
        EventHandler.setOutputHandler(this, this.eventOutput)
    }

    /**
     * Create OptionsManager from source with arguments overriden by patches.
     *   Triggers 'change' event on this object's event handler if the state of
     *   the OptionsManager changes as a result.
     *
     * @method patch
     *
     * @param {...Object} arguments list of patch objects
     * @return {OptionsManager} this
     */
    patch(..._args: any[]) {
        var myState = this._value
        for (var i = 0; i < arguments.length; i++) {
            var data = arguments[i]
            for (var k in data) {
                if (
                    k in myState &&
                    (data[k] && data[k].constructor === Object) &&
                    (myState[k] && myState[k].constructor === Object)
                ) {
                    if (!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k])
                    this.key(k).patch(data[k])
                    if (this.eventOutput) this.eventOutput.emit('change', {id: k, value: this.key(k).value()})
                } else this.set(k, data[k])
            }
        }
        return this
    }
    value() {
        throw new Error('Method not implemented.')
    }

    /**
     * Alias for patch
     *
     * @method setOptions
     *
     */
    setOptions = this.patch

    /**
     * Return OptionsManager based on sub-object retrieved by key
     *
     * @method key
     *
     * @param {string} identifier key
     * @return {OptionsManager} new options manager with the value
     */
    key(identifier: string) {
        var result = new OptionsManager(this._value[identifier])
        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {}
        return result
    }

    /**
     * Look up value by key or get the full options hash
     * @method get
     *
     * @param {string} key key
     * @return {Object} associated object or full options hash
     */
    get(key: string) {
        return key ? this._value[key] : this._value
    }

    /**
     * Alias for get
     * @method getOptions
     */
    getOptions = this.get

    /**
     * Set key to value.  Outputs 'change' event if a value is overwritten.
     *
     * @method set
     *
     * @param {string} key key string
     * @param {Object} value value object
     * @return {OptionsManager} new options manager based on the value object
     */
    set(key: string, value: any) {
        var originalValue = this.get(key)
        this._value[key] = value
        if (this.eventOutput && value !== originalValue) this.eventOutput.emit('change', {id: key, value: value})
        return this
    }

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    on(): any {
        this._createEventOutput()
        return this.on.apply(this, arguments as any)
    }

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    removeListener(): any {
        this._createEventOutput()
        return this.removeListener.apply(this, arguments as any)
    }

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    pipe(): any {
        this._createEventOutput()
        return this.pipe.apply(this, arguments as any)
    }

    /**
     * Remove handler object from set of downstream handlers.
     * Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    unpipe(): any {
        this._createEventOutput()
        return this.unpipe.apply(this, arguments as any)
    }
}
