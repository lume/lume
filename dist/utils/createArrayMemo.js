import { createMemo } from 'solid-js';
import { arraysEqual } from './arraysEqual.js';
export function createArrayMemo(fn, initial = []) {
    return createMemo(fn, initial, { equals: arraysEqual });
}
//# sourceMappingURL=createArrayMemo.js.map