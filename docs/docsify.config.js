window.$docsify = {
    name: 'infamous',
    loadSidebar: true,
    loadNavbar: true,
    coverpage: true,
    subMaxLevel: 2,
    // repo: 'git@github.com:trusktr/infamous', // shows GitHub corner banner at the top of all pages.
    // logo: '/_media/logoipsum.png', // replaces site `name` in sidebar with an image.

    plugins: [
        // re-enable when we figure out link placement, https://github.com/njleonzhang/docsify-edit-on-github/issues/7
        // EditOnGithubPlugin.create('https://github.com/infamous/infamous/tree/master/docs'),
    ],

    markdown: {
        renderer: {
            code: function(code, lang) {
                // support for mermaid (diagrams via markdown)
                if (lang === 'mermaid') {
                    return '<div class="mermaid">' + mermaid.render('mermaid-svg-' + num++, code) + '</div>'
                }

                return this.origin.code.apply(this, arguments)
            },
        },
    },
}
