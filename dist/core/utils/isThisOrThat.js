// The following isScene and isElement3D functions are used in order to avoid
// using instanceof, which would mean that we would need to import Element3D and
// Scene as references, which would cause a circular depdency problem.
// We can look into the "internal module" pattern to solve the issue if we wish
// to switch back to using instanceof:
// https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de
export const isScene = (el) => !!el.isScene;
export const isElement3D = (el) => !!el.isElement3D;
// Avoid errors trying to use DOM APIs in non-DOM environments (f.e. server-side rendering).
export const isDomEnvironment = () => !!globalThis.window?.document;
//# sourceMappingURL=isThisOrThat.js.map