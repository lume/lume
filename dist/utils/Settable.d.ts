import type { Constructor } from 'lowclass';
export declare function Settable<T extends Constructor>(Base?: T): {
    new (...a: any[]): {
        set<T_1 extends any, K extends keyof T_1, V extends T_1[K]>(props: Partial<Record<K, V>>): any;
    };
} & T;
export declare type SettableInstance = InstanceType<ReturnType<typeof Settable>>;
//# sourceMappingURL=Settable.d.ts.map