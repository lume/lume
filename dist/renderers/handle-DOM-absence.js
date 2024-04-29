"use strict";
if (!globalThis.navigator) {
    // VRButton tries to access navigator, leave empty to make it no-op.
    // @ts-expect-error
    globalThis.navigator = {};
}
//# sourceMappingURL=handle-DOM-absence.js.map