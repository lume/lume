// TODO import and use animation-loop

import type {ImperativeBase} from './ImperativeBase.js'
import type {Scene} from './Scene.js'

export type RenderTask = (timestamp: number, deltaTime: number) => false | void

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

		if (this.#allRenderTasks.includes(fn)) return fn

		this.#allRenderTasks.push(fn)
		this.#numberOfTasks += 1

		// If the render loop isn't started, start it.
		if (!this.#loopStarted) this.#startAnimationLoop()

		return fn
	}

	removeRenderTask(fn: RenderTask) {
		const taskIndex = this.#allRenderTasks.indexOf(fn)

		if (taskIndex == -1) return

		this.#allRenderTasks.splice(taskIndex, 1)
		this.#numberOfTasks -= 1

		if (taskIndex <= this.#taskIterationIndex) this.#taskIterationIndex -= 1
	}

	/** Adds a render task that executes only once instead of repeatedly. */
	once(fn: RenderTask) {
		// The `false` return value of the task tells Motor not to re-run it.
		return this.addRenderTask((time, dt) => (fn(time, dt), false))
	}

	// A Node calls this any time its properties have been modified (f.e. by the end user).
	setNodeToBeRendered(node: ImperativeBase) {
		if (this.#nodesToUpdate.includes(node)) return
		this.#nodesToUpdate.push(node)

		// noop if the loop's already started
		this.#startAnimationLoop()
	}

	/**
	 * Set the function that is used for requesting animation frames. The
	 * default is `globalThis.requestAnimationFrame`. A Scene with WebXR enabled
	 * will pass in the XRSession's requester that controls animation frames for
	 * the XR headset.
	 */
	setFrameRequester(requester: (fn: FrameRequestCallback) => number) {
		this.#requestFrame = requester
	}

	#loopStarted = false
	#taskIterationIndex = 0
	#numberOfTasks = 0

	#allRenderTasks = [] as RenderTask[]
	#nodesToUpdate = [] as ImperativeBase[]
	#modifiedScenes = [] as Scene[]

	// A set of nodes that are the root nodes of subtrees where all nodes
	// in each subtree need to have their world matrices updated.
	#treesToUpdate = [] as ImperativeBase[]

	// default to requestAnimationFrame for regular non-VR/AR scenes.
	#requestFrame = window.requestAnimationFrame.bind(window)

	/**
	 * Starts a requestAnimationFrame loop and runs the render tasks in the __allRenderTasks stack.
	 * As long as there are tasks in the stack, the loop continues. When the
	 * stack becomes empty due to removal of tasks, the
	 * requestAnimationFrame loop stops and the app sits there doing nothing
	 * -- silence, crickets.
	 */
	async #startAnimationLoop() {
		if (document.readyState === 'loading') await new Promise(resolve => setTimeout(resolve))

		if (this.#loopStarted) return

		this.#loopStarted = true

		let lastTime: number = performance.now()

		while (this.#loopStarted) {
			const timestamp: number = await this.#animationFrame()
			const deltaTime: number = timestamp - lastTime

			this.#runRenderTasks(timestamp, deltaTime)
			this.#renderNodes(timestamp, deltaTime)

			// If no tasks are left, stop the animation loop.
			if (!this.#allRenderTasks.length) this.#loopStarted = false

			lastTime = timestamp
		}
	}

	#animationFrame(): Promise<number> {
		return new Promise(r => this.#requestFrame(r))
	}

	#runRenderTasks(timestamp: number, deltaTime: number) {
		for (
			this.#taskIterationIndex = 0;
			this.#taskIterationIndex < this.#numberOfTasks;
			this.#taskIterationIndex += 1
		) {
			const task = this.#allRenderTasks[this.#taskIterationIndex]

			if (task(timestamp, deltaTime) === false) this.removeRenderTask(task)
		}
	}

	#renderNodes(timestamp: number, deltaTime: number) {
		if (!this.#nodesToUpdate.length) return

		for (let i = 0, l = this.#nodesToUpdate.length; i < l; i += 1) {
			const node = this.#nodesToUpdate[i]

			// We removed the early return in ImperativeBase and replaced it
			// with this early continue, because otherwise
			// ImperativeBase.needsUpdate can be called during an autorun in
			// which case it causes an infinite autorun loop because it would
			// read this.scene which would then set this.scene.
			if (!node.scene) continue

			node.update(timestamp, deltaTime)

			// if there is no ancestor of the current node that should be
			// rendered, then the current node is a root node of a subtree
			// that needs to be updated
			if (!node.getNearestAncestorThatShouldBeRendered() && !this.#treesToUpdate.includes(node)) {
				this.#treesToUpdate.push(node)
			}

			// keep track of which scenes are modified so we can render webgl
			// only for those scenes.
			if (!this.#modifiedScenes.includes(node.scene)) this.#modifiedScenes.push(node.scene)
		}

		// Update world matrices of the subtrees.
		const treesToUpdate = this.#treesToUpdate
		for (let i = 0, l = treesToUpdate.length; i < l; i += 1) {
			treesToUpdate[i].updateWorldMatrices()
		}
		treesToUpdate.length = 0

		// render webgl of modified scenes.
		const modifiedScenes = this.#modifiedScenes
		for (let i = 0, l = modifiedScenes.length; i < l; i += 1) {
			modifiedScenes[i].drawScene()
		}
		modifiedScenes.length = 0

		const nodesToUpdate = this.#nodesToUpdate
		for (let i = 0, l = nodesToUpdate.length; i < l; i += 1) {
			nodesToUpdate[i].__willBeRendered = false
		}
		nodesToUpdate.length = 0
	}
}

// export a singleton instance rather than the class directly.
export const Motor = new _Motor()
