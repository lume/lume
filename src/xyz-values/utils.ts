import r from 'regexr'

// XXX This grows but never shrinks. Can we make the cache collectable? Maybe we
// need to use WeakRef containing the RegExps.
const stringArrayRegexCache: {[k: string]: RegExp} = {}

export function stringToArray(string: string, separator: string = ','): string[] {
	separator = separator || ',' // prevent empty string
	let re = stringArrayRegexCache[separator]
	if (!re) {
		re = r`/(?:\s*${r.escape(separator)}\s*)|(?:\s+)/g`
		stringArrayRegexCache[separator] = re
	}
	const values = string.trim().split(re)
	return values
}
