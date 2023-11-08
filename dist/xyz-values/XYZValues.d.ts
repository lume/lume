export type XYZValuesArray<T> = [T, T, T];
export type XYZPartialValuesArray<T> = [T] | [T, T] | [T, T, T];
export type XYZValuesObject<T> = {
    x: T;
    y: T;
    z: T;
};
export type XYZPartialValuesObject<T> = Partial<XYZValuesObject<T>>;
export type XYZValuesParameters<T> = XYZPartialValuesArray<T> | XYZPartialValuesObject<T> | string | T;
export declare abstract class XYZValues<T = any> extends Object {
    #private;
    set x(value: T);
    get x(): T;
    set y(value: T);
    get y(): T;
    set z(value: T);
    get z(): T;
    constructor(x?: XYZValuesParameters<T>, y?: T, z?: T);
    abstract get default(): XYZValuesParameters<T>;
    fromDefault(): this;
    from(x: XYZValuesParameters<T>, y?: T, z?: T): this;
    set(x: T, y: T, z: T): this;
    fromArray(array: XYZPartialValuesArray<T>): this;
    toArray(): XYZValuesArray<T>;
    fromObject(object: XYZPartialValuesObject<T>): this;
    toObject(): XYZValuesObject<T>;
    fromString(string: string, separator?: string): this;
    toString(separator?: string): string;
    deserializeValue(_prop: 'x' | 'y' | 'z', value: string): T;
    checkValue(_prop: 'x' | 'y' | 'z', _value: T): boolean;
    asDependency: () => void;
}
//# sourceMappingURL=XYZValues.d.ts.map