import Class from 'lowclass'
import documentReady from '@awaitbox/document-ready'
import Transformable from './Transformable'
import {getWebGLRendererThree, destroyWebGLRendererThree} from './WebGLRendererThree'
import {isInstanceof} from './Utility'

let documentIsReady = false

// TODO use Array if IE11 doesn't have Map.
const webGLRenderers = new Map

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

    // in the future we might have "babylon", "playcanvas", etc, on a
    // per scene basis.
    getWebGLRenderer(scene, type) {
        if ( webGLRenderers.has(scene) ) return webGLRenderers.get(scene)

        let rendererGetter = null

        if (type === "three")
            rendererGetter = getWebGLRendererThree
        else throw new Error('invalid WebGL renderer')

        const renderer = rendererGetter(scene)
        webGLRenderers.set(scene, renderer)
        renderer.initGl(scene)

        return renderer
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

            if (!documentIsReady) {
                await documentReady()
                documentIsReady = true
            }

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

                // If the node is root of a subtree containing updated nodes and
                // has no ancestors that were modified, then add it to the
                // treesToUpdate set so we can update the world matrices of
                // all the nodes in the subtree.
                if (
                    // a node could be a Scene, which is not Transformable
                    isInstanceof(node, Transformable) &&

                    // and if ancestor is not instanceof Transformable, f.e.
                    // `false` if there is no ancestor that should be rendered or
                    // no Transformable parent which means the current node is the
                    // root node
                    !isInstanceof(node._getAncestorThatShouldBeRendered(), Transformable) &&

                    // and the node isn't already added.
                    !this.treesToUpdate.includes(node)
                ) {
                    this.treesToUpdate.push(node)
                }

                // keep track of which scenes are modified so we can render webgl
                // only for those scenes.
                // TODO FIXME: at this point, a node should always have a scene,
                // otherwise it should not ever be rendered here, but turns out
                // some nodes are getting into this queue without a scene. We
                // shouldn't need the conditional check for node._scene, and it
                // will save CPU by not allowing the code to get here in that case.
                // UPDATE: it may be because we're using `node._scene` which is
                // null unless `node.scene` was first used. Maybe we just need to
                // use `node.scene`.
                if (node._scene && !this.modifiedScenes.includes(node._scene))
                    this.modifiedScenes.push(node._scene)
            }

            // Update world matrices of the subtrees.
            const treesToUpdate = this.treesToUpdate
            for (let i=0, l=treesToUpdate.length; i<l; i+=1) {
                treesToUpdate[i]._calculateWorldMatricesInSubtree()
            }
            treesToUpdate.length = 0

            // render webgl of modified scenes.
            // TODO PERFORMANCE: store a list of webgl-enabled modified scenes, and
            // iterate only through those so we don't iterate over non-webgl
            // scenes.
            const modifiedScenes = this.modifiedScenes
            for (let i=0, l=modifiedScenes.length; i<l; i+=1) {
                const scene = modifiedScenes[i]
                if (scene.experimentalWebgl)
                    webGLRenderers.get(scene).drawScene(scene)
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
