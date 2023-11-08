import type { AttributeHandler } from '@lume/element';
export { reactive } from '@lume/element';
export declare function attribute(prototype: any, propName: string, descriptor?: PropertyDescriptor): any;
export declare function attribute(handler?: AttributeHandler): (proto: any, propName: string) => any;
export declare namespace attribute {
    var string: (defaultValue?: string | undefined) => AttributeHandler<string>;
    var number: (defaultValue?: number | undefined) => AttributeHandler<number>;
    var boolean: (defaultValue?: boolean | undefined) => AttributeHandler<boolean>;
}
export declare function stringAttribute(defaultValue?: string): (proto: any, propName: string) => any;
export declare function numberAttribute(defaultValue?: number): (proto: any, propName: string) => any;
export declare function booleanAttribute(defaultValue?: boolean): (proto: any, propName: string) => any;
//# sourceMappingURL=attribute.d.ts.map