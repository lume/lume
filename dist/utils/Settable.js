const isInstance = Symbol();
export function Settable(Base = Object) {
    class Settable extends Base {
        [isInstance] = true;
        set(props) {
            Object.assign(this, props);
            return this;
        }
    }
    Settable.prototype[isInstance] = true;
    return Settable;
}
Object.defineProperty(Settable, Symbol.hasInstance, {
    value(obj) {
        if (!obj)
            return false;
        if (obj[isInstance])
            return true;
        return false;
    },
});
//# sourceMappingURL=Settable.js.map