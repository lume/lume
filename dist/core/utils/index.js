export * from './observeChildren.js';
export function epsilon(value) {
    return Math.abs(value) < 0.000001 ? 0 : value;
}
export function toRadians(degrees) {
    return (degrees / 180) * Math.PI;
}
export function toDegrees(radians) {
    return (radians / Math.PI) * 180;
}
//# sourceMappingURL=index.js.map