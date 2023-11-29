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
			// lume stuff
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

			// <code-mirror> stuff
			'@babel/runtime/helpers/extends': '/packages/code-mirror-el/node_modules/@babel/runtime/helpers/esm/extends.js',
			'@codemirror/autocomplete': '/packages/code-mirror-el/node_modules/@codemirror/autocomplete/dist/index.js',
			'@codemirror/commands': '/packages/code-mirror-el/node_modules/@codemirror/commands/dist/index.js',
			'@codemirror/lang-css': '/packages/code-mirror-el/node_modules/@codemirror/lang-css/dist/index.js',
			'@codemirror/lang-html': '/packages/code-mirror-el/node_modules/@codemirror/lang-html/dist/index.js',
			'@codemirror/lang-javascript': '/packages/code-mirror-el/node_modules/@codemirror/lang-javascript/dist/index.js',
			'@codemirror/language': '/packages/code-mirror-el/node_modules/@codemirror/language/dist/index.js',
			'@codemirror/lint': '/packages/code-mirror-el/node_modules/@codemirror/lint/dist/index.js',
			'@codemirror/search': '/packages/code-mirror-el/node_modules/@codemirror/search/dist/index.js',
			'@codemirror/state': '/packages/code-mirror-el/node_modules/@codemirror/state/dist/index.js',
			'@codemirror/theme-one-dark': '/packages/code-mirror-el/node_modules/@codemirror/theme-one-dark/dist/index.js',
			'@codemirror/view': '/packages/code-mirror-el/node_modules/@codemirror/view/dist/index.js',
			'@lezer/common': '/packages/code-mirror-el/node_modules/@lezer/common/dist/index.js',
			'@lezer/css': '/packages/code-mirror-el/node_modules/@lezer/css/dist/index.js',
			'@lezer/highlight': '/packages/code-mirror-el/node_modules/@lezer/highlight/dist/index.js',
			'@lezer/html': '/packages/code-mirror-el/node_modules/@lezer/html/dist/index.js',
			'@lezer/javascript': '/packages/code-mirror-el/node_modules/@lezer/javascript/dist/index.js',
			'@lezer/lr': '/packages/code-mirror-el/node_modules/@lezer/lr/dist/index.js',
			'@uiw/codemirror-theme-noctis-lilac':
				'/packages/code-mirror-el/node_modules/@uiw/codemirror-theme-noctis-lilac/esm/index.js',
			'@uiw/codemirror-themes': '/packages/code-mirror-el/node_modules/@uiw/codemirror-themes/esm/index.js',
			'code-mirror-el': '/node_modules/code-mirror-el/dist/index.js',
			codemirror: '/packages/code-mirror-el/node_modules/codemirror/dist/index.js',
			crelt: '/packages/code-mirror-el/node_modules/crelt/index.js',
			'lodash-es/': '/packages/code-mirror-el/node_modules/lodash-es/',
			'style-mod': '/packages/code-mirror-el/node_modules/style-mod/src/style-mod.js',
			'thememirror/': '/packages/code-mirror-el/node_modules/thememirror/',
			'w3c-keyname': '/packages/code-mirror-el/node_modules/w3c-keyname/index.js',
		},
	},
}
