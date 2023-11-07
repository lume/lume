import type { Constructor } from 'lowclass';
export declare function Settable<T extends Constructor>(Base?: T): {
    new (...a: any[]): {
        set<T extends any, K extends keyof T, V extends T[K]>(props: Partial<Record<K, V>>): any;
    };
} & T;
export type SettableInstance = InstanceType<ReturnType<typeof Settable>>;
//# sourceMappingURL=Settable.d.ts.map