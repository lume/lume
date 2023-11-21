/** @type {import('@lume/cli/config/getUserConfig.js').UserConfig} */
module.exports = {
	/**
	 * Override this for the CLI, so that VS Code uses the default one, and CLI
	 * applies only to the top-level repo and not any of the sub-packages.
	 */
	prettierIgnorePath: '.prettierignore.lumecli',

	testFiles: process.env.TEST_ALL
		? ['dist/**/*.test.js', 'packages/*/dist/**/*.test.js', '!packages/{classy-solid,readem}/dist/**/*.test.js']
		: 'dist/**/*.test.js',

	importMap: {
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
			'james-bond': '/node_modules/james-bond/dist/index.js',
			regexr: '/node_modules/regexr/dist/index.js',
			'element-behaviors': '/node_modules/element-behaviors/dist/index.js',
			'@lume/custom-attributes/': '/node_modules/element-behaviors/node_modules/@lume/custom-attributes/',
			'solid-js': '/node_modules/solid-js/dist/solid.js',
			'solid-js/web': '/node_modules/solid-js/web/dist/web.js',
			'solid-js/html': '/node_modules/solid-js/html/dist/html.js',
			'solid-js/store': '/node_modules/solid-js/store/dist/store.js',
			three: '/node_modules/three/src/Three.js',
			'three/': '/node_modules/three/',
		},
	},
}
