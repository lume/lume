import { Owner } from 'solid-js';
import type { Constructor } from 'lowclass';
export declare function Effectful<T extends Constructor | AbstractConstructor>(Base: T): {
    new (...a: any[]): {
        "__#8@#owner": Owner | null;
        "__#8@#dispose": StopFunction | null;
        createEffect(fn: () => void): void;
        stopEffects(): void;
    };
} & T;
declare type StopFunction = () => void;
export declare type AbstractConstructor<T = object, A extends any[] = any[], Static = {}> = (abstract new (...a: A) => T) & Static;
export {};
//# sourceMappingURL=Effectful.d.ts.map