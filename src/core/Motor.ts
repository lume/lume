import Class from 'lowclass'
import {getImperativeBaseProtectedHelper} from './ImperativeBase'

// TODO import and use animation-loop

type RenderTask = (timestamp?: number) => unknown

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
    addRenderTask(fn: RenderTask) {
        if (typeof fn != 'function')
            throw new Error('Render task must be a function.')

        const self = Private(this)

        if (self.__allRenderTasks.includes(fn)) return fn

        self.__allRenderTasks.push(fn)
        self.__numberOfTasks += 1

        // If the render loop isn't started, start it.
        if (!self.__loopStarted)
            self.__startAnimationLoop()

        return fn
    },

    removeRenderTask(fn: RenderTask) {
        const self = Private(this)

        const taskIndex = self.__allRenderTasks.indexOf(fn)

        if (taskIndex == -1) return

        self.__allRenderTasks.splice(taskIndex, 1)
        self.__numberOfTasks -= 1

        if ( taskIndex <= self.__taskIterationIndex )
            self.__taskIterationIndex -= 1
    },

    once(fn: RenderTask) {
        return this.addRenderTask(time => (fn(time), false))
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
        __taskIterationIndex: 0,
        __numberOfTasks: 0,

        __allRenderTasks: [] as RenderTask[],
        __nodesToUpdate: [] as any[], // TODO as ImperativeBase[]
        __modifiedScenes: [] as any[], // TODO as Scene[]

        // A set of nodes that are the root nodes of subtrees where all nodes
        // in each subtree need to have their world matrices updated.
        __treesToUpdate: [] as any[], // TODO as ImperativeBase[]

        // default to requestAnimationFrame for regular non-VR/AR scenes.
        __requestFrame: window.requestAnimationFrame.bind( window ) as (...args: any) => void, // TODO rAF signature

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

            if (Private(this).__loopStarted) return

            Private(this).__loopStarted = true

            let timestamp: number = null!

            while (Private(this).__loopStarted) {
                timestamp = await Private(this).__animationFrame()

                Private(this).__runRenderTasks(timestamp)

                // wait for the next microtask before continuing so that SkateJS
                // updated methods (or any other microtask handlers) have a
                // chance to handle changes before the next __renderNodes call.
                //
                // TODO add test to make sure behavior size change doesn't
                // happen after render
                await Promise.resolve()

                Private(this).__renderNodes(timestamp)

                // If no tasks are left, stop the animation loop.
                if (!Private(this).__allRenderTasks.length)
                    Private(this).__loopStarted = false
            }
        },

        __animationFrame(): Promise<number> {
            return new Promise(r => Private(this).__requestFrame(r))
        },

        __runRenderTasks(timestamp: number) {
            for (Private(this).__taskIterationIndex = 0; Private(this).__taskIterationIndex < Private(this).__numberOfTasks; Private(this).__taskIterationIndex += 1) {
                const task = Private(this).__allRenderTasks[Private(this).__taskIterationIndex]

                if (task(timestamp) === false)
                    Public(this).removeRenderTask(task)
            }
        },

        __renderNodes(timestamp) {
            if (!Private(this).__nodesToUpdate.length) return

            for (let i=0, l=Private(this).__nodesToUpdate.length; i<l; i+=1) {
                const node = Private(this).__nodesToUpdate[i]

                ImperativeBaseProtected()(node)._render(timestamp)

                // if there is no ancestor of the current node that should be
                // rendered, then the current node is a root node of a subtree
                // that needs to be updated
                if (
                    !ImperativeBaseProtected()(node)._getNearestAncestorThatShouldBeRendered() &&
                    !Private(this).__treesToUpdate.includes(node)
                ) {
                    Private(this).__treesToUpdate.push(node)
                }

                // keep track of which scenes are modified so we can render webgl
                // only for those scenes.
                if (!Private(this).__modifiedScenes.includes(node.scene))
                    Private(this).__modifiedScenes.push(node.scene)
            }

            // Update world matrices of the subtrees.
            const treesToUpdate = Private(this).__treesToUpdate
            for (let i=0, l=treesToUpdate.length; i<l; i+=1) {
                ImperativeBaseProtected()(treesToUpdate[i])._calculateWorldMatricesInSubtree()
            }
            treesToUpdate.length = 0

            // render webgl of modified scenes.
            const modifiedScenes = Private(this).__modifiedScenes
            for (let i=0, l=modifiedScenes.length; i<l; i+=1) {
                modifiedScenes[i].drawScene()
            }
            modifiedScenes.length = 0

            const nodesToUpdate = Private(this).__nodesToUpdate
            for (let i=0, l=nodesToUpdate.length; i<l; i+=1) {
                ImperativeBaseProtected()(nodesToUpdate[i])._willBeRendered = false
            }
            nodesToUpdate.length = 0
        },
    },

}))

type Motor = InstanceType<typeof Motor>

// export a singleton instance rather than the class directly.
export default new Motor
