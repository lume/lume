// TODO import and use animation-loop

import type {ImperativeBase} from './ImperativeBase'
import type {Scene} from './Scene'

export type RenderTask = (timestamp: number) => false | void

class _Motor {
	/**
	 * When a render tasks is added a new requestAnimationFrame loop will be
	 * started if there isn't one currently.
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
	 *
	 * @return {Function} A reference to the render task. Useful for saving to
	 * a variable so that it can later be passed to Motor.removeRenderTask().
	 */
	addRenderTask(fn: RenderTask) {
		if (typeof fn != 'function') throw new Error('Render task must be a function.')

		if (this.__allRenderTasks.includes(fn)) return fn

		this.__allRenderTasks.push(fn)
		this.__numberOfTasks += 1

		// If the render loop isn't started, start it.
		if (!this.__loopStarted) this.__startAnimationLoop()

		return fn
	}

	removeRenderTask(fn: RenderTask) {
		const taskIndex = this.__allRenderTasks.indexOf(fn)

		if (taskIndex == -1) return

		this.__allRenderTasks.splice(taskIndex, 1)
		this.__numberOfTasks -= 1

		if (taskIndex <= this.__taskIterationIndex) this.__taskIterationIndex -= 1
	}

	/** Adds a render task that executes only once instead of repeatedly. */
	once(fn: RenderTask) {
		// The `false` return value of the task tells Motor not to re-run it.
		return this.addRenderTask(time => (fn(time), false))
	}

	// A Node calls this any time its properties have been modified (f.e. by the end user).
	setNodeToBeRendered(node: ImperativeBase) {
		if (this.__nodesToUpdate.includes(node)) return
		this.__nodesToUpdate.push(node)

		// noop if the loop's already started
		this.__startAnimationLoop()
	}

	// TODO better typing for fn
	setFrameRequester(requester: (fn: FrameRequestCallback) => any) {
		this.__requestFrame = requester
	}

	private __loopStarted = false
	private __taskIterationIndex = 0
	private __numberOfTasks = 0

	private __allRenderTasks = [] as RenderTask[]
	private __nodesToUpdate = [] as ImperativeBase[]
	private __modifiedScenes = [] as Scene[]

	// A set of nodes that are the root nodes of subtrees where all nodes
	// in each subtree need to have their world matrices updated.
	private __treesToUpdate = [] as ImperativeBase[]

	// default to requestAnimationFrame for regular non-VR/AR scenes.
	private __requestFrame = window.requestAnimationFrame.bind(window)

	/**
	 * Starts a requestAnimationFrame loop and runs the render tasks in the __allRenderTasks stack.
	 * As long as there are tasks in the stack, the loop continues. When the
	 * stack becomes empty due to removal of tasks, the
	 * requestAnimationFrame loop stops and the app sits there doing nothing
	 * -- silence, crickets.
	 */
	private async __startAnimationLoop() {
		if (document.readyState === 'loading') await new Promise(resolve => setTimeout(resolve))

		if (this.__loopStarted) return

		this.__loopStarted = true

		let timestamp: number = null!

		while (this.__loopStarted) {
			timestamp = await this.__animationFrame()

			this.__runRenderTasks(timestamp)
			this.__renderNodes(timestamp)

			// If no tasks are left, stop the animation loop.
			if (!this.__allRenderTasks.length) this.__loopStarted = false
		}
	}

	private __animationFrame(): Promise<number> {
		return new Promise(r => this.__requestFrame(r))
	}

	private __runRenderTasks(timestamp: number) {
		for (
			this.__taskIterationIndex = 0;
			this.__taskIterationIndex < this.__numberOfTasks;
			this.__taskIterationIndex += 1
		) {
			const task = this.__allRenderTasks[this.__taskIterationIndex]

			if (task(timestamp) === false) this.removeRenderTask(task)
		}
	}

	private __renderNodes(timestamp: number) {
		if (!this.__nodesToUpdate.length) return

		for (let i = 0, l = this.__nodesToUpdate.length; i < l; i += 1) {
			const node = this.__nodesToUpdate[i]

			// We removed the early return in ImperativeBase and replaced it
			// with this early continue, because otherwise
			// ImperativeBase.needsUpdate can be called during an autorun in
			// which case it causes an infinite autorun loop because it would
			// read this.scene which would then set this.scene.
			if (!node.scene) continue

			// @ts-ignore: call protected method
			node._render(
				//
				timestamp,
			)

			// if there is no ancestor of the current node that should be
			// rendered, then the current node is a root node of a subtree
			// that needs to be updated
			if (
				// @ts-ignore: call protected method
				!node._getNearestAncestorThatShouldBeRendered() &&
				!this.__treesToUpdate.includes(node)
			) {
				this.__treesToUpdate.push(node)
			}

			// keep track of which scenes are modified so we can render webgl
			// only for those scenes.
			if (!this.__modifiedScenes.includes(node.scene)) this.__modifiedScenes.push(node.scene)
		}

		// Update world matrices of the subtrees.
		const treesToUpdate = this.__treesToUpdate
		for (let i = 0, l = treesToUpdate.length; i < l; i += 1) {
			treesToUpdate[i]
				// @ts-ignore: call protected method
				._calculateWorldMatricesInSubtree()
		}
		treesToUpdate.length = 0

		// render webgl of modified scenes.
		const modifiedScenes = this.__modifiedScenes
		for (let i = 0, l = modifiedScenes.length; i < l; i += 1) {
			modifiedScenes[i].drawScene()
		}
		modifiedScenes.length = 0

		const nodesToUpdate = this.__nodesToUpdate
		for (let i = 0, l = nodesToUpdate.length; i < l; i += 1) {
			// prettier-ignore
			nodesToUpdate[i]
                // @ts-ignore: access protected property
                ._willBeRendered = false
		}
		nodesToUpdate.length = 0
	}
}

// export a singleton instance rather than the class directly.
export const Motor = new _Motor()
export default Motor
