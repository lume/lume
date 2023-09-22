/**
 * This loads the outer HTML template used for all the examples.
 */
{
	// The first thing the HTML parser encounters in each example is a script
	// tag with this code.

	// Fetch our shared top-level HTML template synchronously. If we don't do it
	// synchronously, we won't be able to take advantage of the next
	// document.write trick, which has to run during parsing.
	const r = new XMLHttpRequest()
	r.open('GET', '/examples/wrapper.html', /*not asynchronous!*/ false)
	r.send()

	// This script executes during parsing, and this line writes the HTML
	// template synchronously, creating the <head> and <body> elements. When the
	// parser continues parsing after this code runs, any further content it
	// encounters while parsing will then be placed into the <body> that this
	// line added wrote into the DOM. A nifty way to share a re-usable HTML
	// top-level template!
	document.write(r.responseText)

	// Each example specifies the title for its tab by putting a title="foo"
	// attribute on the tag that is executing this code.
	document.title = 'LUME - ' + document.currentScript.getAttribute('title')
}
