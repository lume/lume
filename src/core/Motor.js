import documentReady from '@awaitbox/document-ready'
import Transformable from './Transformable'
import {getWebGLRendererThree, destroyWebGLRendererThree} from './WebGLRendererThree'
import {isInstanceof} from './Utility'
import Class from 'lowclass'

import {
    //animationFrame,
} from './Utility'

let documentIsReady = false

// TODO use Array if IE11 doesn't have Map.
const webGLRenderers = new Map

const Motor = Class('Motor', (Public, Protected, Private) => ({

    constructor() {
        const self = Private(this)

        self.inFrame = false // true when inside a requested animation frame.
        self.rAF = null // the current animation frame, or null.
        self.animationLoopStarted = false
        self.allRenderTasks = []
        self.taskIterationIndex = 0
        self.numberOfTasks = 0
        self.nodesToBeRendered = []
        self.modifiedScenes = []

        // A set of nodes that are the root nodes of subtrees where all nodes
        // in each subtree need to have their world matrices updated.
        self.worldMatrixRootNodes = []
    },

    /**
     * When a render tasks is added a new rAF loop will be started if there
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

        if (Private(this).allRenderTasks.includes(fn)) return

        Private(this).allRenderTasks.push(fn)
        Private(this).numberOfTasks += 1

        // If the render loop isn't started, start it.
        if (!Private(this).animationLoopStarted)
            Private(this).startAnimationLoop()

        return fn
    },

    removeRenderTask(fn) {
        const taskIndex = Private(this).allRenderTasks.indexOf(fn)

        if (taskIndex == -1) return

        Private(this).allRenderTasks.splice(taskIndex, 1)
        Private(this).numberOfTasks -= 1
        Private(this).taskIterationIndex -= 1
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

    setNodeToBeRendered(node) {
        if (Private(this).nodesToBeRendered.includes(node)) return
        Private(this).nodesToBeRendered.push(node)
        if (!Private(this).inFrame) Private(this).startAnimationLoop()
    },

    private: {

        /**
         * Starts an rAF loop and runs the render tasks in the _renderTasks stack.
         * As long as there are tasks in the stack, the loop continues. When the
         * stack becomes empty due to removal of tasks, the rAF stops and the app
         * sits there doing nothing -- silence, crickets.
         */
        async startAnimationLoop() {
            if (this.animationLoopStarted) return

            this.animationLoopStarted = true

            if (!documentIsReady) {
                await documentReady()
                documentIsReady = true
            }

            // DIRECT ANIMATION LOOP ///////////////////////////////////
            // So now we can render after the scene is mounted.
            const motorLoop = timestamp => {
                this.inFrame = true

                this.runRenderTasks(timestamp)
                this.renderNodes(timestamp)

                // If any tasks are left to run, continue the animation loop.
                if (this.allRenderTasks.length)
                    this.rAF = requestAnimationFrame(motorLoop)
                else {
                    this.rAF = null
                    this.animationLoopStarted = false
                }

                this.inFrame = false
            }

            this.rAF = requestAnimationFrame(motorLoop)
        },
        //async startAnimationLoop() {
            //if (this.animationLoopStarted) return

            //this.animationLoopStarted = true

            //if (!documentIsReady) {
                //await documentReady()
                //documentIsReady = true
            //}

            //// ANIMATION LOOP USING WHILE AND AWAIT ///////////////////////////////////
            //this.rAF = true
            //let timestamp = null
            //while (this.rAF) {
                //timestamp = await animationFrame()
                //this.inFrame = true

                //this.runRenderTasks(timestamp)
                //this.renderNodes(timestamp)

                //// If any tasks are left to run, continue the animation loop.
                //if (!this.allRenderTasks.length) {
                    //this.rAF = null
                    //this.animationLoopStarted = false
                //}

                //this.inFrame = false
            //}
        //},

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
                // worldMatrixRootNodes set so we can update the world matrices of
                // all the nodes in the root node's subtree.
                if (
                    // a node could be a Scene, which is not Transformable
                    isInstanceof(node, Transformable) &&

                    // and if ancestor is not instanceof Transformable, f.e.
                    // `false` if there is no ancestor that should be rendered or
                    // no Transformable parent which means the current node is the
                    // root node
                    !isInstanceof(node._getAncestorThatShouldBeRendered(), Transformable) &&

                    // and the node isn't already added.
                    !this.worldMatrixRootNodes.includes(node)
                ) {
                    this.worldMatrixRootNodes.push(node)
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
            const worldMatrixRootNodes = this.worldMatrixRootNodes
            for (let i=0, l=worldMatrixRootNodes.length; i<l; i+=1) {
                worldMatrixRootNodes[i]._calculateWorldMatricesInSubtree()
            }
            worldMatrixRootNodes.length = 0

            // render webgl of modified scenes.
            // TODO PERFORMANCE: store a list of webgl-enabled modified scenes, and
            // iterate only through those so we don't iterate over non-webgl
            // scenes.
            const modifiedScenes = this.modifiedScenes
            for (let i=0, l=modifiedScenes.length; i<l; i+=1) {
                const scene = modifiedScenes[i]
                if (scene.webglEnabled)
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
