export function testWithSeparator(a, separator, ...values) {
    let string = `${values[0]}${separator} ${values[1]}${separator} ${values[2]}`;
    expect(() => a.fromString(string, separator)).not.toThrow();
    // a.fromString(string, separator)
    checkValues(a, ...values);
    string = `${values[0]}${separator}      ${values[1]}${separator}${values[2]}    `;
    expect(() => a.fromString(string, separator)).not.toThrow();
    checkValues(a, ...values);
    string = `  ${values[0]}  ${values[1]}${separator}     ${values[2]}  `;
    expect(() => a.fromString(string, separator)).not.toThrow();
    checkValues(a, ...values);
}
export function checkValues(v, x, y, z) {
    expect(v.x).toBe(x);
    expect(v.y).toBe(y);
    expect(v.z).toBe(z);
}
//# sourceMappingURL=XYZValues.test.common.js.map