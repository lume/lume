class _Motor {
    addRenderTask(fn) {
        if (typeof fn != 'function')
            throw new Error('Render task must be a function.');
        if (this.#allRenderTasks.includes(fn))
            return fn;
        this.#allRenderTasks.push(fn);
        this.#numberOfTasks += 1;
        if (!this.#loopStarted)
            this.#startAnimationLoop();
        return fn;
    }
    removeRenderTask(fn) {
        const taskIndex = this.#allRenderTasks.indexOf(fn);
        if (taskIndex == -1)
            return;
        this.#allRenderTasks.splice(taskIndex, 1);
        this.#numberOfTasks -= 1;
        if (taskIndex <= this.#taskIterationIndex)
            this.#taskIterationIndex -= 1;
    }
    #onces = new Set();
    once(fn, allowDuplicates = true) {
        if (!allowDuplicates && this.#onces.has(fn))
            return;
        this.#onces.add(fn);
        return this.addRenderTask((time, dt) => (fn(time, dt), false));
    }
    needsUpdate(element) {
        if (this.#elementsToUpdate.has(element))
            this.#elementsToUpdate.delete(element);
        this.#elementsToUpdate.add(element);
        this.#startAnimationLoop();
    }
    setFrameRequester(requester) {
        this.#requestFrame = requester;
    }
    #loopStarted = false;
    #taskIterationIndex = 0;
    #numberOfTasks = 0;
    #allRenderTasks = [];
    #elementsToUpdate = new Set();
    #modifiedScenes = new Set();
    #treesToUpdate = new Set();
    #requestFrame = globalThis.requestAnimationFrame?.bind(globalThis);
    async #startAnimationLoop() {
        if (document.readyState === 'loading')
            await new Promise(resolve => setTimeout(resolve));
        if (this.#loopStarted)
            return;
        this.#loopStarted = true;
        let lastTime = performance.now();
        while (this.#loopStarted) {
            const timestamp = await this.#animationFrame();
            const deltaTime = timestamp - lastTime;
            this.#runRenderTasks(timestamp, deltaTime);
            this.#onces.clear();
            await null;
            this.#updateElements(timestamp, deltaTime);
            if (!this.#allRenderTasks.length)
                this.#loopStarted = false;
            lastTime = timestamp;
        }
    }
    #animationFrame() {
        return new Promise(r => this.#requestFrame(r));
    }
    #runRenderTasks(timestamp, deltaTime) {
        for (this.#taskIterationIndex = 0; this.#taskIterationIndex < this.#numberOfTasks; this.#taskIterationIndex += 1) {
            const task = this.#allRenderTasks[this.#taskIterationIndex];
            if (task(timestamp, deltaTime) === false)
                this.removeRenderTask(task);
        }
    }
    #updateElements(timestamp, deltaTime) {
        if (this.#elementsToUpdate.size === 0)
            return;
        for (const el of this.#elementsToUpdate) {
            if (!el.scene)
                continue;
            el.update(timestamp, deltaTime);
            if (!el.__getNearestAncestorThatShouldBeUpdated())
                this.#treesToUpdate.add(el);
            this.#modifiedScenes.add(el.scene);
        }
        for (const el of this.#treesToUpdate)
            el.updateWorldMatrices();
        this.#treesToUpdate.clear();
        for (const scene of this.#modifiedScenes)
            scene.drawScene();
        this.#modifiedScenes.clear();
        for (const el of this.#elementsToUpdate)
            el.__willBeRendered = false;
        this.#elementsToUpdate.clear();
    }
}
export const Motor = new _Motor();
//# sourceMappingURL=Motor.js.map