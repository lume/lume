import documentReady from 'awaitbox/dom/documentReady'
import Transformable from './Transformable'
import getWebGlRenderer from './WebGlRenderer'

import {
    //animationFrame,
} from './Utility'

let documentIsReady = false

class Motor {
    constructor() {
        this._inFrame = false // true when inside a requested animation frame.
        this._rAF = null // the current animation frame, or null.
        this._animationLoopStarted = false
        this._allRenderTasks = []
        this._taskIterationIndex = 0
        this._numberOfTasks = 0
        this._nodesToBeRendered = []
        this._modifiedScenes = []

        // A set of nodes that are the root nodes of subtrees where all nodes
        // in each subtree need to have their world matrices updated.
        this._worldMatrixRootNodes = []
    }

    /**
     * Starts an rAF loop and runs the render tasks in the _renderTasks stack.
     * As long as there are tasks in the stack, the loop continues. When the
     * stack becomes empty due to removal of tasks, the rAF stops and the app
     * sits there doing nothing -- silence, crickets.
     */
    async _startAnimationLoop() {
        if (this._animationLoopStarted) return

        this._animationLoopStarted = true

        if (!documentIsReady) {
            await documentReady()
            documentIsReady = true
        }

        // DIRECT ANIMATION LOOP ///////////////////////////////////
        // So now we can render after the scene is mounted.
        const motorLoop = timestamp => {
            this._inFrame = true

            this._runRenderTasks(timestamp)
            this._renderNodes(timestamp)

            // If any tasks are left to run, continue the animation loop.
            if (this._allRenderTasks.length)
                this._rAF = requestAnimationFrame(motorLoop)
            else {
                this._rAF = null
                this._animationLoopStarted = false
            }

            this._inFrame = false
        }

        this._rAF = requestAnimationFrame(motorLoop)

        // ANIMATION LOOP USING WHILE AND AWAIT ///////////////////////////////////
        //this._rAF = true
        //let timestamp = null
        //while (this._rAF) {
            //timestamp = await animationFrame()
            //this._inFrame = true

            //this._runRenderTasks(timestamp)
            //this._renderNodes(timestamp)

            //// If any tasks are left to run, continue the animation loop.
            //if (!this._allRenderTasks.length) {
                //this._rAF = null
                //this._animationLoopStarted = false
            //}

            //this._inFrame = false
        //}
    }

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

        if (this._allRenderTasks.includes(fn)) return

        this._allRenderTasks.push(fn)
        this._numberOfTasks += 1

        // If the render loop isn't started, start it.
        if (!this._animationLoopStarted)
            this._startAnimationLoop()

        return fn
    }

    removeRenderTask(fn) {
        const taskIndex = this._allRenderTasks.indexOf(fn)

        if (taskIndex == -1) return

        this._allRenderTasks.splice(taskIndex, 1)
        this._numberOfTasks -= 1
        this._taskIterationIndex -= 1
    }

    _runRenderTasks(timestamp) {
        for (this._taskIterationIndex = 0; this._taskIterationIndex < this._numberOfTasks; this._taskIterationIndex += 1) {
            const task = this._allRenderTasks[this._taskIterationIndex]

            if (task(timestamp) === false)
                this.removeRenderTask(task)
        }
    }

    _setNodeToBeRendered(node) {
        if (this._nodesToBeRendered.includes(node)) return
        this._nodesToBeRendered.push(node)
        if (!this._inFrame) this._startAnimationLoop()
    }

    _renderNodes(timestamp) {
        if (!this._nodesToBeRendered.length) return

        for (let i=0, l=this._nodesToBeRendered.length; i<l; i+=1) {
            const node = this._nodesToBeRendered[i]

            node._render(timestamp)

            // If the node is root of a subtree containing updated nodes and
            // has no ancestors that were modified, then add it to the
            // _worldMatrixRootNodes set so we can update the world matrices of
            // all the nodes in the root node's subtree.
            if (
                // a node could be a Scene, which is not Transformable
                node instanceof Transformable &&

                // and if ancestor is not instanceof Transformable, f.e.
                // `false` if there is no ancestor to be rendered, or Sizeable
                // if the Scene is returned.
                !(node._getAncestorToBeRendered() instanceof Transformable) &&

                // and the node isn't already added.
                !this._worldMatrixRootNodes.includes(node)
            ) {
                this._worldMatrixRootNodes.push(node)
            }

            // keep track of which scenes are modified so we can render webgl
            // only for those scenes.
            // TODO FIXME: at this point, a node should always have a scene,
            // otherwise it should not ever be rendered here, but turns out
            // some nodes are getting into this queue without a scene. We
            // shouldn't need the conditional check for node._scene, and it
            // will save CPU by not allowing the code to get here in that case.
            if (node._scene && !this._modifiedScenes.includes(node._scene))
                this._modifiedScenes.push(node._scene)
        }

        // Update world matrices of the subtrees.
        const worldMatrixRootNodes = this._worldMatrixRootNodes
        for (let i=0, l=worldMatrixRootNodes.length; i<l; i+=1) {
            const subtreeRoot = worldMatrixRootNodes[i]
            subtreeRoot._calculateWorldMatricesInSubtree()
        }
        worldMatrixRootNodes.length = 0

        // render webgl of modified scenes.
        const modifiedScenes = this._modifiedScenes
        for (let i=0, l=modifiedScenes.length; i<l; i+=1) {
            const scene = modifiedScenes[i]
            // TODO we're temporarily storing stuff on the .element, but we
            // don't want that, we will move it to WebGLRenderer.
            if (scene.element.webglEnabled) getWebGlRenderer().drawScene(scene.element)
        }
        modifiedScenes.length = 0

        const nodesToBeRendered = this._nodesToBeRendered
        for (let i=0, l=nodesToBeRendered.length; i<l; i+=1) {
            nodesToBeRendered[i]._willBeRendered = false
        }
        nodesToBeRendered.length = 0
    }
}

// export a singleton instance rather than the class directly.
export default new Motor
