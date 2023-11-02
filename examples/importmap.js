{
	const localMap = {
		imports: {
			lume: '../dist/index.js',
			'lume/': '../',
			'@lume/element': '/node_modules/@lume/element/dist/index.js',
			'@lume/variable': '/node_modules/@lume/variable/dist/index.js',
			'@lume/eventful': '/node_modules/@lume/eventful/dist/index.js',
			'@lume/kiwi': '/node_modules/@lume/autolayout/node_modules/@lume/kiwi/dist/kiwi.js',
			'@lume/three-projected-material/': '/node_modules/@lume/three-projected-material/',
			'@lume/autolayout': '/node_modules/@lume/autolayout/dist/AutoLayout.js',
			lowclass: '/node_modules/lowclass/dist/index.js',
			'james-bond': '/node_modules/james-bond/dist/index.js',
			regexr: '/node_modules/regexr/dist/index.js',
			'element-behaviors': '/node_modules/element-behaviors/dist/index.js',
			'@lume/custom-attributes/': '/node_modules/element-behaviors/node_modules/@lume/custom-attributes/',
			'solid-js': '/node_modules/solid-js/dist/solid.js',
			'solid-js/web': '/node_modules/solid-js/web/dist/web.js',
			'solid-js/html': '/node_modules/solid-js/html/dist/html.js',
			'solid-js/store': '/node_modules/solid-js/store/dist/store.js',
			three: '/node_modules/three/build/three.module.js',
			'three/': '/node_modules/three/',
		},
	}

	const githackMap = {
		imports: {
			lume: 'https://raw.githack.com/lume/lume/develop/dist/index.js',
			'lume/': 'https://raw.githack.com/lume/lume/develop/',
			'@lume/element': 'https://raw.githack.com/lume/element/main/dist/index.js',
			'@lume/variable': 'https://raw.githack.com/lume/variable/main/dist/index.js',
			'@lume/eventful': 'https://raw.githack.com/lume/eventful/main/dist/index.js',
			'@lume/kiwi': 'https://raw.githack.com/lume/kiwi/main/dist/kiwi.js',
			'@lume/three-projected-material/': 'https://raw.githack.com/lume/three-projected-material/main/',
			'@lume/autolayout': 'https://raw.githack.com/lume/autolayout/main/dist/AutoLayout.js',
			lowclass: 'https://raw.githack.com/trusktr/lowclass/main/dist/index.js',
			'james-bond': 'https://raw.githack.com/trusktr/james-bond/main/dist/index.js',
			regexr: 'https://raw.githack.com/trusktr/regexr/main/dist/index.js',
			'element-behaviors': 'https://raw.githack.com/lume/element-behaviors/main/dist/index.js',
			'@lume/custom-attributes/': 'https://raw.githack.com/lume/custom-attributes/main/',
			'solid-js': 'https://unpkg.com/solid-js@1.4.8/dist/solid.js',
			'solid-js/web': 'https://unpkg.com/solid-js@1.4.8/web/dist/web.js',
			'solid-js/html': 'https://unpkg.com/solid-js@1.4.8/html/dist/html.js',
			'solid-js/store': 'https://unpkg.com/solid-js@1.4.8/store/dist/store.js',
			three: 'https://raw.githack.com/mrdoob/three.js/r158/build/three.module.js',
			'three/': 'https://raw.githack.com/mrdoob/three.js/r158/',
		},
	}

	const isGithack = location.origin.includes('githack.com')

	// Special case for raw.githack.com for viewing examples directly off of GitHub
	// Maybe we can do better than hand-writing two import maps? How can we version the lume packages URLs? Perhaps use an importmap generator like `jspm` cli.
	const map = isGithack ? githackMap : localMap

	document.write(/*html*/ `<script type="importmap">${JSON.stringify(map, undefined, '\t')}</script>`)
}
