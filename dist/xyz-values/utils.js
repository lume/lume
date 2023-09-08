import r from 'regexr';
const stringArrayRegexCache = {};
export function stringToArray(string, separator = ',') {
    separator = separator || ',';
    let re = stringArrayRegexCache[separator];
    if (!re) {
        re = r `/(?:\s*${r.escape(separator)}\s*)|(?:\s+)/g`;
        stringArrayRegexCache[separator] = re;
    }
    const values = string.trim().split(re);
    return values;
}
//# sourceMappingURL=utils.js.map