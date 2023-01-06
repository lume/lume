// TODO import and use animation-loop

import type {SharedAPI} from './SharedAPI.js'
import type {Scene} from './Scene.js'

export type RenderTask = (timestamp: number, deltaTime: number) => false | void

class _Motor {
	/**
	 * When a render tasks is added a new requestAnimationFrame loop will be
	 * started if there isn't one currently.
	 *
	 * A render task is simply a function that will be called over and over
	 * again, in the Motor's animation loop. That's all, nothing special.
	 * However, if a Element3D setter is used inside of a render task, then the Element3D
	 * will tell Motor that it needs to be re-rendered, which will happen at
	 * the end of the current frame. If a Element3D setter is used outside of a
	 * render task (i.e. outside of the Motor's animation loop), then the Element3D
	 * tells Motor to re-render the Element3D on the next animation loop tick.
	 * Basically, regardless of where the Element3D's setters are used (inside or
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

	#onces = new Set<RenderTask>()

	/**
	 * Adds a render task that executes only once instead of repeatedly. Set
	 * `allowDuplicates` to `false` to skip queueing a function if it is already
	 * queued.
	 */
	once(fn: RenderTask, allowDuplicates = true) {
		if (!allowDuplicates && this.#onces.has(fn)) return

		this.#onces.add(fn)

		// The `false` return value of the task tells Motor not to re-run it.
		return this.addRenderTask((time, dt) => (fn(time, dt), false))
	}

	// An Element3D calls this any time its properties have been modified (f.e. by the end user).
	needsUpdate(element: SharedAPI) {
		// delete so it goes to the end
		if (this.#elementsToUpdate.has(element)) this.#elementsToUpdate.delete(element)

		this.#elementsToUpdate.add(element)

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

	// This is an array so that it is possible to add a task function more than once.
	#allRenderTasks = [] as RenderTask[]

	#elementsToUpdate = new Set<SharedAPI>()
	#modifiedScenes = new Set<Scene>()

	// A set of elements that are the root elements of subtrees where all elements
	// in subtrees need their world matrices updated.
	#treesToUpdate = new Set<SharedAPI>()

	// default to requestAnimationFrame for regular non-VR/AR scenes.
	// Using ?. here in case of a non-DOM env.
	#requestFrame = globalThis.requestAnimationFrame?.bind(globalThis)

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
			this.#onces.clear()

			// Wait one more microtask in case reactivity (f.e. not just lume
			// reactivity, but any reactivity outside of lume that may be
			// microtask deferred like Vue's, Svelte's, React's, etc) needs
			// another chance to run.
			//
			// TODO continue to queue element updates with a microtasks until tasks
			// settle, similar to ResizeObserver, with a loop limit, before running all
			// element updates.
			await null

			this.#updateElements(timestamp, deltaTime)

			// If no tasks are left, stop the animation loop.
			if (!this.#allRenderTasks.length) this.#loopStarted = false

			lastTime = timestamp
		}
	}

	#animationFrame(): Promise<number> {
		return new Promise(r => this.#requestFrame(r))
	}

	#runRenderTasks(timestamp: number, deltaTime: number) {
		for (this.#taskIterationIndex = 0; this.#taskIterationIndex < this.#numberOfTasks; this.#taskIterationIndex += 1) {
			const task = this.#allRenderTasks[this.#taskIterationIndex]

			if (task(timestamp, deltaTime) === false) this.removeRenderTask(task)
		}
	}

	#updateElements(timestamp: number, deltaTime: number) {
		if (this.#elementsToUpdate.size === 0) return

		for (const el of this.#elementsToUpdate) {
			// Skip any element that no longer participates in rendering of a scene.
			if (!el.scene) continue

			el.update(timestamp, deltaTime)

			// if there is no ancestor of the current element that should be
			// updated, then the current element is a root element of a subtree
			// that needs to be updated
			if (!el.__getNearestAncestorThatShouldBeUpdated()) this.#treesToUpdate.add(el)

			// keep track of which scenes are modified so we can render webgl
			// only for those scenes.
			this.#modifiedScenes.add(el.scene)
		}

		// Update world matrices of the subtrees.
		for (const el of this.#treesToUpdate) el.updateWorldMatrices()
		this.#treesToUpdate.clear()

		// render webgl of modified scenes.
		for (const scene of this.#modifiedScenes) scene.drawScene()
		this.#modifiedScenes.clear()

		for (const el of this.#elementsToUpdate) el.__willBeRendered = false
		this.#elementsToUpdate.clear()
	}
}

// export a singleton instance rather than the class directly.
export const Motor = new _Motor()
