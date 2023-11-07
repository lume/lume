type LumeConfig = {
    autoDefineElements?: boolean;
};
declare global {
    interface Window {
        $lume?: LumeConfig;
    }
    var $lume: LumeConfig | undefined;
}
export declare const autoDefineElements: boolean;
export {};
//# sourceMappingURL=LumeConfig.d.ts.map