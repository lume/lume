import Class from 'lowclass'
import {getImperativeBaseProtectedHelper} from './ImperativeBase'

// TODO import and use animation-loop

const ImperativeBaseProtected = getImperativeBaseProtectedHelper()

const Motor = Class('Motor', ({ Public, Private }) => ({

    constructor() {
        Private(this).__allRenderTasks = []
        Private(this).__nodesToUpdate = []
        Private(this).__modifiedScenes = []
        Private(this).__treesToUpdate = []
    },

    /**
     * When a render tasks is added a new requestAnimationFrame loop will be started if there
     * isn't one currently.
     *
     * A render task is simply a function that will be called over and over
     * again, in the Motor's animation loop. That's all, nothing special.
     * However, if a Node setter is used inside of a render task, then the Node
     * will tell Motor that it needs to be re-rendered, which will happen at
     * the end of the current frame. If a Node setter is used outside of a
     * render task (i.e. outside of the Motor's animation loop), then the Node
     * tells Motor to re-render the Node on the next animation loop tick.
     * Basically, regardless of where the Node's setters are used (inside or
     * outside of the Motor's animation loop), rendering always happens inside
     * the loop.
     *
     * @param {Function} fn The render task to add.
     * @return {Function} A reference to the render task. Useful for saving to
     * a variable so that it can later be passed to Motor.removeRenderTask().
     */
    addRenderTask(fn) {
        if (typeof fn != 'function')
            throw new Error('Render task must be a function.')

        const self = Private(this)

        if (self.__allRenderTasks.includes(fn)) return

        self.__allRenderTasks.push(fn)
        self.__numberOfTasks += 1

        // If the render loop isn't started, start it.
        if (!self.__loopStarted)
            self.__startAnimationLoop()

        return fn
    },

    removeRenderTask(fn) {
        const self = Private(this)

        const taskIndex = self.__allRenderTasks.indexOf(fn)

        if (taskIndex == -1) return

        self.__allRenderTasks.splice(taskIndex, 1)
        self.__numberOfTasks -= 1

        if ( taskIndex <= self.__taskIterationIndex )
            self.__taskIterationIndex -= 1
    },

    once(fn) {
        this.addRenderTask(time => (fn(time), false))
    },

    // A Node calls this any time its properties have been modified (f.e. by the end user).
    setNodeToBeRendered(node) {
        const self = Private(this)
        if (self.__nodesToUpdate.includes(node)) return
        self.__nodesToUpdate.push(node)

        // noop if the loop's already started
        self.__startAnimationLoop()
    },

    setFrameRequester( requester ) {
        Private( this ).__requestFrame = requester
    },

    private: {

        __loopStarted: false,
        __taskIterationIndex: null,
        __numberOfTasks: 0,

        __allRenderTasks: [],
        __nodesToUpdate: [],
        __modifiedScenes: [],

        // A set of nodes that are the root nodes of subtrees where all nodes
        // in each subtree need to have their world matrices updated.
        __treesToUpdate: [],

        // default to requestAnimationFrame for regular non-VR/AR scenes.
        __requestFrame: window.requestAnimationFrame.bind( window ),

        /**
         * Starts a requestAnimationFrame loop and runs the render tasks in the __allRenderTasks stack.
         * As long as there are tasks in the stack, the loop continues. When the
         * stack becomes empty due to removal of tasks, the
         * requestAnimationFrame loop stops and the app sits there doing nothing
         * -- silence, crickets.
         */
        async __startAnimationLoop() {
            if (document.readyState === 'loading')
                await new Promise(resolve => setTimeout(resolve))

            if (this.__loopStarted) return

            this.__loopStarted = true

            let timestamp = null

            while (this.__loopStarted) {
                timestamp = await this.__animationFrame()

                this.__runRenderTasks(timestamp)

                // wait for the next microtask before continuing so that SkateJS
                // updated methods (or any other microtask handlers) have a
                // chance to handle changes before the next __renderNodes call.
                //
                // TODO add test to make sure behavior size change doesn't
                // happen after render
                await Promise.resolve()

                this.__renderNodes(timestamp)

                // If no tasks are left, stop the animation loop.
                if (!this.__allRenderTasks.length)
                    this.__loopStarted = false
            }
        },

        __animationFrame() {
            return new Promise(r => this.__requestFrame(r))
        },

        __runRenderTasks(timestamp) {
            for (this.__taskIterationIndex = 0; this.__taskIterationIndex < this.__numberOfTasks; this.__taskIterationIndex += 1) {
                const task = this.__allRenderTasks[this.__taskIterationIndex]

                if (task(timestamp) === false)
                    Public(this).removeRenderTask(task)
            }
        },

        __renderNodes(timestamp) {
            if (!this.__nodesToUpdate.length) return

            for (let i=0, l=this.__nodesToUpdate.length; i<l; i+=1) {
                const node = this.__nodesToUpdate[i]

                ImperativeBaseProtected(node)._render(timestamp)

                // if there is no ancestor of the current node that should be
                // rendered, then the current node is a root node of a subtree
                // that needs to be updated
                if (
                    !ImperativeBaseProtected(node)._getNearestAncestorThatShouldBeRendered() &&
                    !this.__treesToUpdate.includes(node)
                ) {
                    this.__treesToUpdate.push(node)
                }

                // keep track of which scenes are modified so we can render webgl
                // only for those scenes.
                if (!this.__modifiedScenes.includes(node.scene))
                    this.__modifiedScenes.push(node.scene)
            }

            // Update world matrices of the subtrees.
            const treesToUpdate = this.__treesToUpdate
            for (let i=0, l=treesToUpdate.length; i<l; i+=1) {
                ImperativeBaseProtected(treesToUpdate[i])._calculateWorldMatricesInSubtree()
            }
            treesToUpdate.length = 0

            // render webgl of modified scenes.
            const modifiedScenes = this.__modifiedScenes
            for (let i=0, l=modifiedScenes.length; i<l; i+=1) {
                modifiedScenes[i].drawScene()
            }
            modifiedScenes.length = 0

            const nodesToUpdate = this.__nodesToUpdate
            for (let i=0, l=nodesToUpdate.length; i<l; i+=1) {
                ImperativeBaseProtected(nodesToUpdate[i])._willBeRendered = false
            }
            nodesToUpdate.length = 0
        },
    },

}))

// export a singleton instance rather than the class directly.
export default new Motor
