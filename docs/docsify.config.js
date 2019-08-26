window.$docsify = {
    name: 'infamous',
    loadSidebar: true,
    loadNavbar: true,
    subMaxLevel: 2,
    executeScript: true, // defaults to false unless Vue is present in which case defaults to true.
    auto2top: true,
    // coverpage: true,
    repo: 'https://github.com/infamous/infamous', // shows GitHub corner banner at the top of all pages.
    // logo: '/_media/logoipsum.png', // replaces site `name` in sidebar with an image.

    plugins: ((window.$docsify && window.$docsify.plugins) || []).concat([
        function(hook, vm) {
            hook.beforeEach(function(html) {
                const url = vm.config.repo + '/blob/master/docs/' + vm.route.file
                const editTop = `
<a href="${url}" style="position: absolute; right: 45px; top: 120px;" target="__blank">
📝 Edit document.
</a>

`
                const editBottom = `
<a href="${url}" style="position: absolute; right: 45px;" target="__blank">
📝 Edit document.
</a>

`
                return editTop + html + editBottom
            })
        },
    ]),

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

    tabs: {
        theme: 'material',
    },
}
