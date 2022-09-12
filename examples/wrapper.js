function wrapper() {
	const r = new XMLHttpRequest()
	r.open('GET', '/examples/wrapper.html', /*synchronous!*/ false)
	r.send()
	document.write(r.responseText)
	document.title = 'LUME - ' + document.currentScript.getAttribute('title')
}

wrapper()
