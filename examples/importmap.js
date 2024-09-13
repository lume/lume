{
	// This password should be READONLY for the lume repo!
	// Create this representation of the token with `new
	// TextEncoder.encode(btoa(github_token))`, or else the token will be
	// auto-expired upon pushing to GitHub.
	const authkey = atob(
		new TextDecoder().decode(
			new Uint8Array([
				90, 50, 108, 48, 97, 72, 86, 105, 88, 51, 66, 104, 100, 70, 56, 120, 77, 85, 70, 66, 81, 48, 108, 87, 86, 70,
				69, 119, 90, 110, 100, 51, 90, 107, 104, 108, 87, 88, 78, 85, 87, 109, 70, 49, 88, 48, 53, 71, 85, 50, 115, 121,
				77, 48, 100, 49, 83, 69, 112, 70, 86, 108, 86, 104, 82, 48, 77, 48, 89, 108, 70, 113, 87, 88, 78, 49, 82, 109,
				74, 70, 78, 87, 78, 117, 90, 50, 78, 89, 100, 87, 104, 81, 84, 122, 70, 73, 100, 69, 116, 71, 77, 84, 66, 83,
				83, 85, 120, 85, 83, 48, 99, 122, 83, 109, 99, 120, 97, 69, 81, 53, 77, 49, 89, 52,
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
			'solid-js': '/node_modules/solid-js/dist/dev.js',
			'solid-js/web': '/node_modules/solid-js/web/dist/web.js',
			'solid-js/html': '/node_modules/solid-js/html/dist/html.js',
			'solid-js/store': '/node_modules/solid-js/store/dist/store.js',
			three: '/node_modules/three/src/Three.js',
			'three/': '/node_modules/three/',
		},
	}

	const isGithack = location.origin.includes('githack.com')

	// Special case for raw.githack.com for viewing examples directly off of GitHub
	// Maybe we can do better than hand-writing two import maps? How can we version the lume packages URLs? Perhaps use an importmap generator like `jspm` cli.
	const map = isGithack ? makeGithackImportmap() : localMap

	document.write(/*html*/ `<script type="importmap">${JSON.stringify(map, undefined, '\t')}</script>`)

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
				'james-bond': 'https://raw.githack.com/trusktr/james-bond/<GITREF>/dist/index.js',
				'element-behaviors': 'https://raw.githack.com/lume/element-behaviors/<GITREF>/dist/index.js',
				'@lume/custom-attributes/': 'https://raw.githack.com/lume/custom-attributes/<GITREF>/',

				regexr: 'https://raw.githack.com/trusktr/regexr/v2.0.4/dist/index.js',
				'solid-js': 'https://unpkg.com/solid-js@1.4.8/dist/solid.js',
				'solid-js/web': 'https://unpkg.com/solid-js@1.4.8/web/dist/web.js',
				'solid-js/html': 'https://unpkg.com/solid-js@1.4.8/html/dist/html.js',
				'solid-js/store': 'https://unpkg.com/solid-js@1.4.8/store/dist/store.js',
				three: 'https://raw.githack.com/mrdoob/three.js/r158/build/three.module.js',
				'three/': 'https://raw.githack.com/mrdoob/three.js/r158/',
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
