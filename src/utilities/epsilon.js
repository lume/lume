/**
 * @param  {number} value A number to round down to zero if small enough.
 * @return {number}       The original number or zero.
 */
export default
function epsilon(value) {
    return Math.abs(value) < 0.000001 ? 0 : value;
}
