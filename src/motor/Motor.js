import documentReady from 'awaitbox/dom/documentReady'

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
        this._nodesToBeRendered = new Map
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

        this._allRenderTasks.push(fn)

        // If the render loop isn't started, start it.
        if (!this._animationLoopStarted)
            this._startAnimationLoop()

        return fn
    }

    removeRenderTask(fn) {
        this._allRenderTasks.splice(this._allRenderTasks.indexOf(fn), 1)
    }

    _runRenderTasks(timestamp) {
        for (let task of this._allRenderTasks) {
            task(timestamp)
        }
    }

    _setNodeToBeRendered(node) {
        if (!this._nodesToBeRendered.has(node))
            this._nodesToBeRendered.set(node)
    }

    // currently unused, as the list is cleared after each frame.
    // TODO: prevent GC by clearing a linked list instead of Array, Set or Map?
    _unsetNodeToBeRendered(node) {
        this._nodesToBeRendered.delete(node)
    }

    _renderNodes(timestamp) {
        for (let [node] of this._nodesToBeRendered) {
            node._render(timestamp)
        }
        this._nodesToBeRendered.clear()
    }
}

// export a singleton instance rather than the class directly.
export default new Motor
