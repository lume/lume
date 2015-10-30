import Class        from 'lowclass'
import randomstring from 'randomstring'

import env from '../utilities/environment'

/**
 * The InternalNode class is used on both the UI-side and the Worker-side. On
 * the UI-side, InternalNode is exposed for the end user via tne Node and Scene
 * classes, which are public, while InternalNode is private for internal use by
 * the library.
 *
 * @private
 * @class InternalNode
 */
export default
Class ('InternalNode', {

    /**
     * This constructor simply calls init or worker__init depending on
     * which environment an instance of this class is running in.
     *
     * @constructor
     */
    InternalNode() {
        if (env.isWeb) this.init.apply(this, arguments)
        else if (env.isWebWorker) this.worker__init.apply(this, arguments)
    },

    /**
     * Constructor logic for the UI thread.
     */
    init() {

        // new Nodes get a new random ID, used to associate the UI InternalNode with a
        // twin WorkerNode.
        this.id = this._idPrefix + '#' + randomstring.generate()
        // TODO: detect ID collisions.
    },

    /**
     * Don't override this unless you know what you're doing. This returns a
     * string that becomes the prefix of the ID of this InternalNode. The ID prefix is
     * used so that the SceneWorker can determine what type of object to
     * instantiate to pair with a UI-side instance of this class.
     *
     * @private
     * @return {string} The ID prefix for this InternalNode.
     */
    get _idPrefix() { return "Node" },

    /**
     * If this getter returns true, then default components are created for
     * this InternalNode. It can be overriden in subclasses.
     */
    get useDefaultComponents() { return true },

    /**
     * Add a child InternalNode to this InternalNode.
     */
    addChild() {
        console.log('add child')
    },

    /**
     * Add a NodeComponent to this InternalNode.
     *
     * @param {NodeComponent} component The component to add to this InternalNode.
     */
    addComponent(component) {
        component.addTo(this)
    },

    /*
     * Worker stuff --------------------------------------------------
     */

    /**
     * Constructor logic for the worker thread.
     *
     * @param {string} id The ID of a UI-side InternalNode instance that the current
     * worker-side InternalNode instance will be associated with.
     */
    worker__init(id) {
        this.id = id
    },
    worker__addChild() {},
    worker__addComponent() {},
})
