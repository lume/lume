/**
 * @function clamp - Clamp the given number `n` between min and max.
 * @param {number} n - The number to clamp.
 * @param {number} min - The lower limit to clamp `n` by.
 * @param {number} max - The upper limit to clamp `n` by.
 * @returns {number} - If `n` is equal to `min` or `max`, or between `min` and
 * `max`, `n` is returned. If `n` is smaller than `min`, `min` is returned. If
 * `n` is bigger than `max`, `max` is returned. The result can never be
 * outside of the range from `min` to `max`.
 */
export function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}
//# sourceMappingURL=clamp.js.map