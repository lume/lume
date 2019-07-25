import {EventHandler} from './EventHandler'

// Global registry of sync classes. Append only.
var registry: any = {}

/**
 * Combines multiple types of sync classes (e.g. mouse, touch,
 *  scrolling) into one standardized interface for inclusion in widgets.
 *
 *  Sync classes are first registered with a key, and then can be accessed
 *  globally by key.
 *
 *  Emits 'start', 'update' and 'end' events as a union of the sync class
 *  providers.
 *
 * @class GenericSync
 * @constructor
 * @param syncs {Object|Array} object with fields {sync key : sync options}
 *    or an array of registered sync keys
 * @param [options] {Object|Array} options object to set on all syncs
 */
export class GenericSync {
    static DIRECTION_X = 0
    static DIRECTION_Y = 1
    static DIRECTION_Z = 2

    _eventInput: EventHandler
    _eventOutput: EventHandler
    _syncs: any

    /**
     * Register a global sync class with an identifying key
     *
     * @static
     * @method register
     *
     * @param syncObject {Object} an object of {sync key : sync options} fields
     */
    static register(syncObject: any) {
        for (var key in syncObject) {
            if (registry[key]) {
                // skip redundant registration
                if (registry[key] !== syncObject[key])
                    // only if same registered class
                    throw new Error('Conflicting sync classes for key: ' + key)
            } else registry[key] = syncObject[key]
        }
    }

    constructor(syncs: any, options?: any) {
        this._eventInput = new EventHandler()
        this._eventOutput = new EventHandler()

        EventHandler.setInputHandler(this, this._eventInput)
        EventHandler.setOutputHandler(this, this._eventOutput)

        this._syncs = {}
        if (syncs) this.addSync(syncs)
        if (options) this.setOptions(options)
    }

    /**
     * Helper to set options on all sync instances
     *
     * @method setOptions
     * @param options {Object} options object
     */
    setOptions(options: any) {
        for (var key in this._syncs) {
            this._syncs[key].setOptions(options)
        }
    }

    /**
     * Pipe events to a sync class
     *
     * @method pipeSync
     * @param key {String} identifier for sync class
     */
    pipeSync(key: string) {
        var sync = this._syncs[key]
        this._eventInput.pipe(sync)
        sync.pipe(this._eventOutput)
    }

    /**
     * Unpipe events from a sync class
     *
     * @method unpipeSync
     * @param key {String} identifier for sync class
     */
    unpipeSync(key: string) {
        var sync = this._syncs[key]
        this._eventInput.unpipe(sync)
        sync.unpipe(this._eventOutput)
    }

    private _addSingleSync(key: any, options?: any) {
        if (!registry[key]) return
        this._syncs[key] = new registry[key](options)
        this.pipeSync(key)
    }

    /**
     * Add a sync class to from the registered classes
     *
     * @method addSync
     * @param syncs {Object|Array.String} an array of registered sync keys
     *    or an object with fields {sync key : sync options}
     */
    addSync(syncs: any) {
        if (syncs instanceof Array) for (var i = 0; i < syncs.length; i++) this._addSingleSync(syncs[i])
        else if (syncs instanceof Object) for (var key in syncs) this._addSingleSync(key, syncs[key])
    }
}
