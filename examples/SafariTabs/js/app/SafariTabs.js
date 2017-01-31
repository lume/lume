define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Scrollview = require('samsara/layouts/Scrollview');
    var TabContainer = require('./TabContainer');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');

    // A `Scrollview` consisting of tabs. Tabs can be selected
    // by clicking on them, bringing them to fullscreen, or removed
    // from the scrollview by clicking their close button.
    // The resizing of the scrollview as tabs are made fullscreen or removed
    // is handled automatically by animating the tabs' size streams.
    var SafariTabs = View.extend({
        defaults: {
            tabData : [],
            tab : {
                titleHeight: 20,
                angle: -Math.PI / 5,
                spacing: 150,
                height: 400
            },
            perspective : 1000,
            selectTransition: {duration: 200},
            deselectTransition: {duration: 200}
        },
        initialize: function (options) {
            // Create the scrollview
            var scrollview = new Scrollview({
                direction: Scrollview.DIRECTION.Y,
                clip: false
            });

            // Set a perspective on the scrollview
            scrollview.setPerspective(options.perspective);

            scrollview.setLengthMap(function(length){
                var y = length;
                var z = Math.max(-100 * Math.exp(-length/100), -5000);
                return Transform.translate([0, length, z]);
            });

            // Create the tabs
            for (var i = 0; i < options.tabData.length; i++) {
                var proportions = new Transitionable([1, .25]);
                var tab = (function(proportions){
                    var tab = new TabContainer({
                        proportions: proportions,
                        src: options.tabData[i].src,
                        title: options.tabData[i].title,
                        titleHeight: options.tab.titleHeight,
                        angle: options.tab.angle,
                        spacing : options.tab.spacing,
                        height : options.tab.height,
                        selectTransition : options.selectTransition,
                        deselectTransition: options.deselectTransition
                    });

                    tab.on('close', function(){
                        proportions.set([1, 0], {duration : 500});
                    });

                    tab.on('start drag', function(){
                        scrollview.pause();
                    });

                    tab.on('end drag', function(){
                        scrollview.resume();
                    });

                    return tab;
                })(proportions);

                // Add the tab to the scrollview
                scrollview.push(tab);
            }

            // Build the render subtree consisting of only the scrollview
            this.add(scrollview);
        }
    });

    module.exports = SafariTabs;
});
