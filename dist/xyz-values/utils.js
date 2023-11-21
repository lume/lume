import { r, escape } from 'regexr';
// XXX This grows but never shrinks. Can we make the cache collectable? Maybe we
// need to use WeakRef containing the RegExps.
const stringArrayRegexCache = {};
export function stringToArray(string, separator = ',') {
    separator = separator || ','; // prevent empty string
    let re = stringArrayRegexCache[separator];
    if (!re) {
        re = r `/(?:\s*${escape(separator)}\s*)|(?:\s+)/g`;
        stringArrayRegexCache[separator] = re;
    }
    const values = string.trim().split(re);
    return values;
}
//# sourceMappingURL=utils.js.map