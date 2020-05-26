{
	// Regular expression that finds any anchor tag with an href like the following:
	// href=" any thing "
	// href = " any thing "
	// href = anything-with-no-space
	const reAnchorWithHref = /<\s*a\b[^><]*\bhref\b\s*=\s*(?:(?:'([^']*)')|(?:"([^"]*)")|(\S+))/g

	const repo = 'https://github.com/lume/lume'

	window.$docsify = vm => {
		return {
			name: 'LUME',
			nameLink: '//lume.io',
			// basePath: 'https://unpkg.com/lume@0.0.0-rc.0/docs/', // TODO host on unpkg, with versioned docs?

			homepage: 'install.md',
			loadSidebar: true,
			loadNavbar: true,
			subMaxLevel: 3,
			externalLinkTarget: '_self',
			executeScript: true, // defaults to false unless Vue is present in which case defaults to true.
			auto2top: true,
			relativePath: true,
			// coverpage: true,
			// repo, // shows GitHub corner banner at the top of all pages.
			// replaces site `name` in sidebar with an image.
			logo: './images/logo-and-word.svg',

			alias: {
				'/': '/install',
			},

			plugins: ((window.$docsify && window.$docsify.plugins) || []).concat([
				function (hook, vm) {
					hook.beforeEach(content => {
						const url = repo + '/edit/develop/docs/' + vm.route.file
						const editTop = `
<a href="${url}" style="position: absolute; right: 45px; top: 120px;" target="__blank">
	Edit document.
</a>

`
						const editBottom = `
<a href="${url}" style="position: absolute; right: 45px;" target="__blank">
	Edit document.
</a>

`
						return editTop + content + editBottom
					})
				},
			]),

			markdown: {
				// `this` in the following hooks is an instace of Marked Renderer
				renderer: {
					/**
					 * @param {string} code
					 * @param {string} lang
					 * @returns {string}
					 */
					code(code, lang) {
						// support for mermaid (diagrams via markdown)
						if (lang === 'mermaid') {
							return '<div class="mermaid">' + mermaid.render('mermaid-svg-' + num++, code) + '</div>'
						}

						return this.origin.code.apply(this, arguments)
					},

					/**
					 * @param {string} html
					 * @returns {string}
					 */
					html(html) {
						const matches = html.matchAll(reAnchorWithHref)

						const {linkTarget, router} = vm.compiler

						// if we find an anchor tag with an href attribute
						for (const match of matches) {
							// if the link is a Docsify link generated from markdown, skip it, it is already handled
							if (match[0].startsWith('<a docsify-link')) continue

							// the result will be one of the three capturing groups from the regex
							let href = match[1] || match[2] || match[3]

							const originalHref = href

							// the first two capturing groups catch single or double quoted values
							const hasQuotes = !!(match[1] || match[2])

							// based on Docsify's Compiler._initRenderer() logic for the markdown "link" hook {{{

							// TODO make some syntax for telling it to ignore the compiling the href
							const ignoreLink = false

							if (
								!Docsify.util.isAbsolutePath(href) &&
								!vm.compiler._matchNotCompileLink(href) &&
								!ignoreLink &&
								// skip hrefs like `#/page?id=section`, which
								// are already in the format Docsify compiles
								// hrefs to
								// TODO move this to router.toURL
								!href.trim().startsWith('#/')
							) {
								if (href === vm.compiler.config.homepage) {
									href = 'README'
								}
								href = router.toURL(href, null, router.getCurrentPath())
							}

							// }}}

							if (!hasQuotes) href = '"' + href + '"'

							html = html.replace(originalHref, href)
						}

						return html
					},

					/**
					 * @param {string} text The html string to compile
					 * @returns {string}
					 */
					// TODO move this to Docsify?
					paragraph(text) {
						// in case the paragraph text contains inline HTML
						text = this.html(text)

						return this.origin.paragraph.call(this, text)
					},
				},
			},

			tabs: {
				theme: 'material',
			},
		}
	}
}
