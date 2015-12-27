define(function(require, exports, module) {
    var Surface = require('samsara/dom/Surface');
    var View = require('samsara/core/View');

    var CrossFader = require('./CrossFader');

    // Defines the navigation bar. Listens to the Drawer Layout
    // and sends these events to the navigation items.
    var NavBar = View.extend({
        initialize : function(){

            // The origin and alignment of the "back" and "messages"
            // surfaces will go from [0,0] to [.5,0] as the input goes
            // from 0 to 1
            var leftAlignAndOrigin = this.input.map(function (data) {
                var progress = Math.max(data.progress, 0);
                return [0.5 * progress, 0]
            });

            // The origin and alignment of the "middle" surface will
            // go from [0.5,0] to [1,0] as the input goes from 0 to 1
            var middleAlignAndOrigin = this.input.map(function (data) {
                var progress = Math.max(data.progress, 0);
                return [0.5 * (1 + progress), 0]
            });

            // Create a surface with faint blue color to be a background
            // of the navigation bar
            var background = new Surface({
                classes : ['navBackground']
            });

            // Create a "back" surface
            var back = new Surface({
                size: [true, undefined],  // width = HTML width, height inherits from navBar
                content: 'Back',
                classes: ['nav', 'back', 'center'],
                origin: leftAlignAndOrigin
            });

            // Emit an `open` event when the back button is clicked
            back.on('click', function () {
                this.emit('open');
            }.bind(this));

            // Create a "messages" surface
            var messages = new Surface({
                size: [true, undefined],
                content: 'Messages',
                classes: ['nav', 'center'],
                origin: leftAlignAndOrigin
            });

            // Cross-fade between these the "back" and "messages" surfaces
            // as the input goes from 0 to 1
            var leftFader = new CrossFader();
            leftFader.subscribe(this.input);
            leftFader.addFront(back);
            leftFader.addBack(messages);

            // Create back arrow surface. Here instead of creating a `<div>`
            // we create an `<img>` tag.

            // Note: we scale down this element and manually center it as opposed
            // to applying the `center` CSS class.
            var backArrow = new Surface({
                size: [true, false],
                proportions: [false, 0.4],
                tagName: 'img',
                origin: [0, 0.5],
                attributes: {
                    src: './assets/chevron-left.svg'
                },
                classes: ['nav', 'backArrow']
            });

            // Create a "hide" surface
            var hide = new Surface({
                size: [true, true],
                content: 'Hide',
                classes: ['nav', 'hide'],
                origin: [0,.5]
            });

            // Emit a `close` event when the "hide" surface is clicked
            hide.on('click', function () {
                this.emit('close');
            }.bind(this));

            // Cross-fade between these the "backArrow" and "hide" surfaces
            // as the input goes from 0 to 1
            var arrowHideFader = new CrossFader();
            arrowHideFader.subscribe(this.input);
            arrowHideFader.addFront(backArrow);
            arrowHideFader.addBack(hide);

            // Create a "middle" surface
            var middle = new Surface({
                size: [true, undefined],
                content: 'goo.gl/nhRGeg',
                classes: ['nav', 'middle', 'center'],
                origin: middleAlignAndOrigin
            });

            // Fade out the "middle" surface as the input goes from 0 to 1
            var middleFader = new CrossFader();
            middleFader.subscribe(this.input);
            middleFader.addFront(middle);

            // Create the render subtree
            this.add(background);

            this.add({align: [0, 0.5]}).add(arrowHideFader);
            this.add({align: leftAlignAndOrigin}).add(leftFader);
            this.add({align : middleAlignAndOrigin}).add(middleFader);
        }
    });

    module.exports = NavBar;
});