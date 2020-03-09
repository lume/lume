const htmlStrings = new WeakSet()

// This is mostly just an identity template tag function, that for the most part
// returns the same string as if you hadn't applied this tag. The only
// difference is it will join arrays of strings with "" (instead of the default
// ","), so that commas don't appear in your HTML output (f.e. when writing
// something like
//
// html`
//   <ul>
//     ${items.map(i => html`
//       <li>${i}</li>
//     `)}
//   </ul>
// `
//
// to map arrays to elements).
function html(parts, ...expressions) {
	let string = ''
	let i

	for (i = 0, l = expressions.length; i < l; i++) {
		string += parts[i]

		// if we have an array of html`` strings
		if (Array.isArray(expressions[i]) && htmlStrings.has(expressions[i][0]))
			expressions[i] = expressions[i].join('')

		string += expressions[i]
	}

	string += parts[i]
	string = new String(string)

	htmlStrings.add(string)

	return string
}
