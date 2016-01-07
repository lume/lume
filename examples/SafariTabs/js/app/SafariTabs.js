define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Scrollview = require('samsara/layouts/Scrollview');
    var TabContainer = require('./TabContainer');

    var SafariTabs = View.extend({
        defaults: {
            tabs : 0,
            srcs : [],
            titles : [],
            titleHeight : 26
        },
        initialize: function (options) {
            // Create the scrollview
            var scrollview = new Scrollview({
                direction: Scrollview.DIRECTION.Y,
                drag: 0.3,
                clip : false,
                marginBottom: 200
            });

            var tabs = [];
            for (var i = 0; i < options.tabs; i++) {
                var tab = new TabContainer({
                    src: options.srcs[i],
                    title: options.titles[i],
                    titleHeight: options.titleHeight,
                    angle: -Math.PI / 5,
                    index: i
                });

                tab.subscribe(scrollview);
                scrollview.subscribe(tab);

                tabs.push(tab);
            }

            scrollview.addItems(tabs);

            scrollview.input.on('goto', function (index) {
                scrollview.goTo(index, {duration: 200});
            });

            // Build the render subtree consisting of only the scrollview
            this.add(scrollview);
        }

    });

    module.exports = SafariTabs;
});
