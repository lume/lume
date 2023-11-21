let UserConfig;
// Doing it with the try-catch this way is the most robust: if we rely on
// `globalThis.$lume`, then if someone defines global `$lume` using `let` or
// `const`, it will be global but not added ass a property on `globalThis`. But
// if we read `$lume` and not `globalThis.$lume` and it is not defined, standard
// behavior for undefined variables is to through, hence we have to try-catch.
// (using `?.` property access on the possibly undefined variable also does not
// help, it will still throw).
try {
    UserConfig = $lume ?? {};
}
catch {
    UserConfig = {};
}
export const autoDefineElements = UserConfig.autoDefineElements ?? true;
//# sourceMappingURL=LumeConfig.js.map