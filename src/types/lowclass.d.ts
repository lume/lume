declare module 'lowclass' {
    type ImplementationKeys = 'static' | 'private' | 'protected'

    type FunctionToConstructor<T, TReturn> = T extends (...a: infer A) => void ? new (...a: A) => TReturn : never

    // Note, void also works the same in place of unknown
    type ReplaceCtorReturn<T, TReturn> = T extends new (...a: infer A) => unknown ? new (...a: A) => TReturn : never

    type ConstructorOrDefault<T> = T extends {constructor: infer TCtor} ? TCtor : (() => void)

    // Although the SuperType type definiton already checks that T extends from
    // Constructor, the additional check in the generic paramters is useful so
    // that we don't get an error about "never" which is hard to track down. The
    // generic paramter will cause a more helpful and understandable error.
    // TODO ensure that T is InstanceType of TBase
    // prettier-ignore
    type SuperType<T, TSuper extends Constructor<any>> = TSuper extends Constructor<infer I, infer A>
        ? {constructor: (...a: A) => I} & InstanceType<TSuper>
        : never
    // type SuperType<
    //     T extends InstanceType<TSuper>,
    //     TSuper extends Constructor<any>
    // > = TSuper extends Constructor<infer I, infer A>
    //     ? T extends InstanceType<TSuper>
    //         ? {constructor: (...a: A) => I} & Id<InstanceType<TSuper>>
    //         : never
    //     : never

    type SuperHelper<TSuper extends Constructor> = <T>(self: T) => SuperType<T, TSuper>
    type PrivateHelper = <T>(self: T) => T extends {__: {private: infer TPrivate}} ? TPrivate : never
    type PublicHelper = <T>(self: T) => Omit<T, ImplementationKeys> // TODO validate instance is public?
    type ProtectedHelper = <T>(self: T) => T extends {__: {protected: infer TProtected}} ? TProtected : never
    // type ProtectedHelper = <T>(self: T) => T extends {protected: infer TProtected} ? TProtected : never
    type Statics<T> = T extends {static: infer TStatic} ? TStatic : {}
    type SaveInheritedProtected<T> = T extends {protected: infer TProtected} ? TProtected : {}

    // there's a missing link here: if the super class of T is a native class
    // that extends from a lowclass class, then we don't inherit those protected
    // members. Any ideas?
    type StaticsAndProtected<T> = Id<Statics<T> & {__: {protected: SaveInheritedProtected<T>}}>

    type ExtractInheritedProtected<T> = T extends {__: infer TProtected} ? TProtected : {}
    type PickImplementationKeys<T> = Pick<T, Extract<keyof T, ImplementationKeys>> // similar to Pick, but not quite

    // this moves the implementation keys off the constructor return type and
    // onto a fake __ property, so that we can reference the __ type within the
    // implementatin code, but so that the outside (public) doesn't see the fake
    // __ property.
    type LowClassThis<T> = Id<Omit<T, ImplementationKeys> & {__: PickImplementationKeys<T>}>

    type OmitImplementationKeys<T> = Omit<T, ImplementationKeys>

    // export function Class<TBase>(
    export function Class(
        name: string
    ): {
        extends<TBase extends Constructor, T>(
            base: TBase,
            members: (
                helpers: {
                    Super: SuperHelper<TBase>
                    Public: PublicHelper
                    Protected: ProtectedHelper
                    Private: PrivateHelper
                }
            ) => T &
                Partial<InstanceType<TBase>> &
                ThisType<LowClassThis<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>>
        ): T extends {constructor: infer TCtor}
            ? FunctionToConstructor<ConstructorOrDefault<T>, Id<InstanceType<TBase> & OmitImplementationKeys<T>>> &
                  Id<StaticsAndProtected<T> & Pick<TBase, keyof TBase>>
            : ReplaceCtorReturn<TBase, Id<InstanceType<TBase> /*& Omit<T, 'constructor'>*/>> & // missing the T type here?
                  Id<StaticsAndProtected<T> & Pick<TBase, keyof TBase>>
    }
    export function Class<T>(
        name: string,
        members: (
            helpers: {Public: PublicHelper; Protected: ProtectedHelper; Private: PrivateHelper; Super: never} // TODO Super is actually Object
        ) => T & ThisType<LowClassThis<T>>
    ): FunctionToConstructor<ConstructorOrDefault<T>, Id<OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T>>
    export function Class<T>(
        name: string,
        members: T & ThisType<LowClassThis<T>>
    ): FunctionToConstructor<ConstructorOrDefault<T>, Id<OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T>>

    export default Class

    type MixinFunction = <TSub, TSuper>(base: Constructor<TSuper>) => Constructor<TSub & TSuper>
    export function Mixin<TSub, TSuper, T extends MixinFunction>(mixin: T): Constructor<TSub & TSuper> & {mixin: T}
}

// function Class(): any {
// 	return null as any;
// }
