/**
 * This loads the outer HTML template used for all the examples.
 */
{
	// The first thing the HTML parser encounters in each example is a script
	// tag with this code.

	const script = document.currentScript
	const template = script.getAttribute('template')
	const templateUrl = template ? new URL(template, location.href) : '/examples/template.html'
	const importmap = script.getAttribute('importmap')

	// Fetch our shared top-level HTML template synchronously. If we don't do it
	// synchronously, we won't be able to take advantage of the next
	// document.write trick, which has to run during parsing.
	const r = new XMLHttpRequest()
	r.open('GET', templateUrl, /*not asynchronous!*/ false)
	r.send()

	let html = r.responseText
	if (importmap) html = html.replace('src="./importmap.js"', `src="${importmap}"`)

	// This script executes during parsing, and this line writes the HTML
	// template synchronously, creating the <head> and <body> elements. When the
	// parser continues parsing after this code runs, any further content it
	// encounters while parsing will then be placed into the created <body>.
	// This is a nifty trick for sharing a top-level re-usable HTML template!
	document.write(html)

	// Each example specifies the title for its tab by putting a title="foo"
	// attribute on the tag that is executing this code.
	document.title = 'LUME - ' + script.getAttribute('title')
}
