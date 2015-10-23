import Class from 'lowclass'

export default
Class ('Privates', {
    Privates() {
        // Stores private objects for objects (namely as a mechanism for
        // private class properties). For more info, see:
        // https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Contributor_s_Guide/Private_Properties
        let privates = new WeakMap

        function __(key) {
            if (!privates.has(key)) privates.set(key, {})
            return privates.get(key)
        }

        return __
    },
})
