{
	// This password should be READONLY for the lume repo!
	// Create this representation of the token with
	// ```
	// '[' + new TextEncoder().encode(btoa(github_token)).toString() + ']'
	// ```
	// or else the token will be auto-expired upon pushing to GitHub.

	const authkey = atob(
		new TextDecoder().decode(
			// prettier-ignore
			new Uint8Array([
				90,50,108,48,97,72,86,105,88,51,66,104,100,70,56,120,77,85,70,66,81,48,108,87,86,70,69,119,81,110,100,106,87,85,112,50,98,87,74,69,78,68,90,122,88,51,66,108,90,85,49,73,89,49,90,71,101,69,53,49,90,108,74,86,90,71,82,49,97,68,108,67,90,85,53,111,84,49,74,88,84,109,70,51,85,71,99,53,83,108,108,53,78,48,107,121,84,109,78,78,85,86,104,86,86,107,90,81,78,86,70,86,84,71,78,72,84,108,78,119,97,86,78,89
			]),
		),
	)

	const localMap = {
		imports: {
			lume: '/dist/index.js',
			'lume/': '/',
			'@lume/element': '/node_modules/@lume/element/dist/index.js',
			'classy-solid': '/node_modules/classy-solid/dist/index.js',
			'@lume/eventful': '/node_modules/@lume/eventful/dist/index.js',
			'@lume/kiwi': '/node_modules/@lume/autolayout/node_modules/@lume/kiwi/dist/kiwi.js',
			'@lume/three-projected-material/': '/node_modules/@lume/three-projected-material/',
			'@lume/autolayout': '/node_modules/@lume/autolayout/dist/AutoLayout.js',
			lowclass: '/node_modules/lowclass/dist/index.js',
			'lowclass/': '/node_modules/lowclass/',
			'james-bond': '/node_modules/james-bond/dist/index.js',
			'element-behaviors': '/node_modules/element-behaviors/dist/index.js',
			'@lume/custom-attributes/': '/node_modules/element-behaviors/node_modules/@lume/custom-attributes/',

			regexr: '/node_modules/regexr/dist/index.js',
			'solid-js': '/node_modules/solid-js/dist/solid.js',
			'solid-js/web': '/node_modules/solid-js/web/dist/web.js',
			'solid-js/html': '/node_modules/solid-js/html/dist/html.js',
			'solid-js/store': '/node_modules/solid-js/store/dist/store.js',
			'@solid-primitives/memo': '/node_modules/classy-solid/node_modules/@solid-primitives/memo/dist/index.js',
			'@solid-primitives/scheduled':
				'/node_modules/classy-solid/node_modules/@solid-primitives/scheduled/dist/index.js',
			'@solid-primitives/utils': '/node_modules/classy-solid/node_modules/@solid-primitives/utils/dist/index.js',
			three: '/node_modules/three/src/Three.js',
			'three/': '/node_modules/three/',
		},
	}

	const location = basedLocation()
	const isLocal = location.origin.includes('localhost') || location.origin.includes('127.0.0.1')

	// When not local serving, get dependencies directly from GitHub.
	// Maybe we can do better than hand-writing two import maps? How can we version the lume packages URLs? Perhaps use an importmap generator like `jspm` cli.
	const map = isLocal ? localMap : makeGithackImportmap()

	document.write(/*html*/ `<script type="importmap">${JSON.stringify(map, undefined, '\t')}</script>`)

	/** Returns a URL object with `href` and other properties modified similar to what elements see due to any <base> element having modified the base href (window.location.href is not affected by <base>) */
	function basedLocation() {
		const a = document.createElement('a')
		a.href = './foo.html'
		return new URL(a.href)
	}

	function makeGithackImportmap() {
		const gitref = location.href.split('/')[5] ?? 'develop'

		const githackMap = {
			imports: {
				lume: `https://raw.githack.com/lume/lume/${gitref}/dist/index.js`,
				'lume/': `https://raw.githack.com/lume/lume/${gitref}/`,
				'@lume/element': 'https://raw.githack.com/lume/element/<GITREF>/dist/index.js',
				'classy-solid': 'https://raw.githack.com/lume/classy-solid/<GITREF>/dist/index.js',
				'@lume/eventful': 'https://raw.githack.com/lume/eventful/<GITREF>/dist/index.js',
				'@lume/kiwi': 'https://raw.githack.com/lume/kiwi/<GITREF>/dist/kiwi.js',
				'@lume/three-projected-material/': 'https://raw.githack.com/lume/three-projected-material/<GITREF>/',
				'@lume/autolayout': 'https://raw.githack.com/lume/autolayout/<GITREF>/dist/AutoLayout.js',
				lowclass: 'https://raw.githack.com/trusktr/lowclass/<GITREF>/dist/index.js',
				'lowclass/': 'https://raw.githack.com/trusktr/lowclass/<GITREF>/',
				'james-bond': 'https://raw.githack.com/trusktr/james-bond/<GITREF>/dist/index.js',
				'element-behaviors': 'https://raw.githack.com/lume/element-behaviors/<GITREF>/dist/index.js',
				'@lume/custom-attributes/': 'https://raw.githack.com/lume/custom-attributes/<GITREF>/',

				regexr: 'https://raw.githack.com/trusktr/regexr/v2.0.4/dist/index.js',
				'solid-js': 'https://cdn.jsdelivr.net/npm/solid-js@1.9.1/dist/solid.js',
				'solid-js/web': 'https://cdn.jsdelivr.net/npm/solid-js@1.9.1/web/dist/web.js',
				'solid-js/html': 'https://cdn.jsdelivr.net/npm/solid-js@1.9.1/html/dist/html.js',
				'solid-js/store': 'https://cdn.jsdelivr.net/npm/solid-js@1.9.1/store/dist/store.js',
				'@solid-primitives/memo': 'https://cdn.jsdelivr.net/npm/@solid-primitives/memo@1.5.1/dist/index.js',
				'@solid-primitives/scheduled': 'https://cdn.jsdelivr.net/npm/@solid-primitives/scheduled@1.5.3/dist/index.js',
				'@solid-primitives/utils': 'https://cdn.jsdelivr.net/npm/@solid-primitives/utils@6.4.1/dist/index.js',
				three: 'https://raw.githack.com/mrdoob/three.js/r168/build/three.module.js',
				'three/': 'https://raw.githack.com/mrdoob/three.js/r168/',
			},
		}

		const info = getSubmoduleInfo(gitref)
		/** @type {Array<{name: string, gitUrl: string, subprojectCommitOid: string}>} */
		const submodules = info.data.repository.object.entries.map(o => o.submodule).filter(o => !!o)
		const importEntries = Object.entries(githackMap.imports)

		for (const [specifier, url] of importEntries) {
			if (!url.includes('<GITREF>')) continue

			const parts = url.split('/')
			const gitRepo = parts[3] + '/' + parts[4]
			const sub = submodules.find(o => o.gitUrl.endsWith('/' + gitRepo + '.git'))
			if (!sub) throw new Error('submodule not found.')
			const subgitref = sub.subprojectCommitOid

			githackMap.imports[specifier] = url.replace('<GITREF>', subgitref)
		}

		return githackMap
	}

	function identityTemplateTag(stringsParts, ...values) {
		let str = ''
		for (let i = 0; i < values.length; i++) str += stringsParts[i] + String(values[i])
		return str + stringsParts[stringsParts.length - 1]
	}

	/**
	 * Barebones gql template string tag for GitHub v4 GraphQL API to query lume
	 * repo content readonly synchronously (because we're in a synchronous
	 * script, not a module).
	 *
	 * ```js
	 * const {data, errors} = await gql` query { ... } `
	 * ```
	 *
	 * @param {TemplateStringsArray} strings
	 * @param {unknown[]} values
	 */
	function gql(strings, ...values) {
		const queryString = identityTemplateTag(strings, ...values)

		const params = JSON.stringify({query: queryString.trim()})

		const xhr = new XMLHttpRequest()
		xhr.open('POST', 'https://api.github.com/graphql', false)
		xhr.setRequestHeader('Authorization', 'bearer ' + authkey)
		xhr.send(params)

		/** @type {GraphQlResult<GraphQlResult<Record<string, unknown>>> | undefined} */
		const json = JSON.parse(xhr.response)
		if (typeof json !== 'object') throw new Error('bad graphql response body')
		if (json.errors) throw new Error('Error with graphql query:\n' + json.errors.map(e => e.message).join('\n'))
		if (xhr.status < 200 || xhr.status > 299) {
			console.error(json)
			throw new Error('error with query: ' + xhr.status + ' ' + xhr.statusText)
		}
		if (!json.data) throw new Error('no graphql data: ' + JSON.stringify(json))
		return json
	}

	/**
	 * @param {string} gitref
	 */
	function getSubmoduleInfo(gitref) {
		return gql`
			query {
				repository(owner: "lume", name: "lume") {
					object(expression: "${gitref}:packages/") {
						... on Tree {
							entries {
								submodule {
									name
									gitUrl
									subprojectCommitOid
								}
							}
						}
					}
				}
			}
		`
	}
}
