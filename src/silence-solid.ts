// Disable the warnings from Solid.js regarding top-level effects. We know what we're doing. :)

const warn = console.warn.bind(console)

console.warn = (...msgs: any[]) => {
	if (typeof msgs[0] === 'string' && msgs[0].includes('computations created outside')) return
	warn(...msgs)
}
