const tasks = new Set();
let microtask = false;
export function queueMicrotaskOnceOnly(task) {
    tasks.add(task);
    if (microtask)
        return;
    microtask = true;
    queueMicrotask(() => {
        microtask = false;
        const _tasks = [...tasks];
        tasks.clear();
        for (const task of _tasks)
            task();
    });
}
//# sourceMappingURL=queueMicrotaskOnceOnly.js.map