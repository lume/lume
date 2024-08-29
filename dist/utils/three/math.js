export function quaternionApproximateEquals(a, b, epsilon) {
    return (Math.abs(a.x - b.x) < epsilon &&
        Math.abs(a.y - b.y) < epsilon &&
        Math.abs(a.z - b.z) < epsilon &&
        Math.abs(a.w - b.w) < epsilon);
}
//# sourceMappingURL=math.js.map