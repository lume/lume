export declare type ElementWithBehaviors<BehaviorTypes, SelectedBehaviorProperties extends keyof BehaviorTypes> = WithStringValues<Partial<Pick<BehaviorTypes, SelectedBehaviorProperties>>>;
export declare type WithStringValues<Type extends object> = {
    [Property in keyof Type]: Type[Property] extends string ? Type[Property] : Type[Property] | string;
};
//# sourceMappingURL=ElementWithBehaviors.d.ts.map