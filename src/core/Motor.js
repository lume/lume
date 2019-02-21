import Class from 'lowclass'
import Transformable from './Transformable'
import {isInstanceof} from './Utility'

const Motor = Class('Motor', ({ Public, Private }) => ({

    constructor() {
        Private(this).allRenderTasks = []
        Private(this).nodesToBeRendered = []
        Private(this).modifiedScenes = []
        Private(this).treesToUpdate = []
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

        if (self.allRenderTasks.includes(fn)) return

        self.allRenderTasks.push(fn)
        self.numberOfTasks += 1

        // If the render loop isn't started, start it.
        if (!self.animationLoopStarted)
            self.startAnimationLoop()

        return fn
    },

    removeRenderTask(fn) {
        const self = Private(this)

        const taskIndex = self.allRenderTasks.indexOf(fn)

        if (taskIndex == -1) return

        self.allRenderTasks.splice(taskIndex, 1)
        self.numberOfTasks -= 1

        if ( taskIndex <= self.taskIterationIndex )
            self.taskIterationIndex -= 1
    },

    once(fn) {
        this.addRenderTask(time => (fn(time), false))
    },

    // A Node calls this any time its properties have been modified (f.e. by the end user).
    setNodeToBeRendered(node) {
        const self = Private(this)
        if (self.nodesToBeRendered.includes(node)) return
        self.nodesToBeRendered.push(node)

        // noop if the loop's already started
        self.startAnimationLoop()
    },

    setFrameRequester( requester ) {
        Private( this ).requestFrame = requester
    },

    private: {

        animationLoopStarted: false,
        taskIterationIndex: null,
        numberOfTasks: 0,

        allRenderTasks: [],
        nodesToBeRendered: [],
        modifiedScenes: [],

        // A set of nodes that are the root nodes of subtrees where all nodes
        // in each subtree need to have their world matrices updated.
        treesToUpdate: [],

        // default to requestAnimationFrame for regular non-VR/AR scenes.
        requestFrame: window.requestAnimationFrame.bind( window ),

        /**
         * Starts a requestAnimationFrame loop and runs the render tasks in the allRenderTasks stack.
         * As long as there are tasks in the stack, the loop continues. When the
         * stack becomes empty due to removal of tasks, the
         * requestAnimationFrame loop stops and the app sits there doing nothing
         * -- silence, crickets.
         */
        async startAnimationLoop() {
            if (this.animationLoopStarted) return

            this.animationLoopStarted = true

            let timestamp = null

            while (this.animationLoopStarted) {
                timestamp = await this.animationFrame()

                this.runRenderTasks(timestamp)

                // wait for the next microtask before continuing so that SkateJS
                // updated methods (or any other microtask handlers) have a
                // chance to handle changes before the next renderNodes call.
                //
                // TODO add test to make sure behavior size change doesn't
                // happen after render
                await Promise.resolve()

                this.renderNodes(timestamp)

                // If no tasks are left, stop the animation loop.
                if (!this.allRenderTasks.length)
                    this.animationLoopStarted = false
            }
        },

        animationFrame() {
            return new Promise(r => this.requestFrame(r))
        },

        runRenderTasks(timestamp) {
            for (this.taskIterationIndex = 0; this.taskIterationIndex < this.numberOfTasks; this.taskIterationIndex += 1) {
                const task = this.allRenderTasks[this.taskIterationIndex]

                if (task(timestamp) === false)
                    Public(this).removeRenderTask(task)
            }
        },

        renderNodes(timestamp) {
            if (!this.nodesToBeRendered.length) return

            for (let i=0, l=this.nodesToBeRendered.length; i<l; i+=1) {
                const node = this.nodesToBeRendered[i]

                node._render(timestamp)

                // if there is no ancestor of the current node that should be
                // rendered, then the current node is a root node of a subtree
                // that needs to be updated
                if (
                    !node._getNearestAncestorThatShouldBeRendered() &&
                    !this.treesToUpdate.includes(node)
                ) {
                    this.treesToUpdate.push(node)
                }

                // keep track of which scenes are modified so we can render webgl
                // only for those scenes.
                if (!this.modifiedScenes.includes(node.scene))
                    this.modifiedScenes.push(node.scene)
            }

            // Update world matrices of the subtrees.
            const treesToUpdate = this.treesToUpdate
            for (let i=0, l=treesToUpdate.length; i<l; i+=1) {
                treesToUpdate[i]._calculateWorldMatricesInSubtree()
            }
            treesToUpdate.length = 0

            // render webgl of modified scenes.
            const modifiedScenes = this.modifiedScenes
            for (let i=0, l=modifiedScenes.length; i<l; i+=1) {
                modifiedScenes[i].drawScene()
            }
            modifiedScenes.length = 0

            const nodesToBeRendered = this.nodesToBeRendered
            for (let i=0, l=nodesToBeRendered.length; i<l; i+=1) {
                nodesToBeRendered[i]._willBeRendered = false
            }
            nodesToBeRendered.length = 0
        },
    },

}))

// export a singleton instance rather than the class directly.
export default new Motor
