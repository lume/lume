define(function(require, exports, module) {
    var Surface = require('samsara/dom/Surface');
    var View = require('samsara/core/View');

    // Defines the navigation bar. Listens to the Drawer Layout
    // and sends these events to the navigation items.
    var NavBar = View.extend({
        initialize : function(){

            // Define how the nav fades out for the "back", "middle" and "leftArrow"
            // surfaces as input goes from 0 to 1
            var fadeOut = this.input.map(function(data){
                return Math.pow(1 - data.progress, 4);
            });

            // Define how the nav fades in for the "hide" and "messages"
            // surfaces as input goes from 0 to 1
            var fadeIn = this.input.map(function(data){
                return data.progress;
            });

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
                origin: leftAlignAndOrigin,
                opacity: fadeOut
            });

            // Emit an `open` event when the back button is clicked
            back.on('click', function () {
                this.emit('open');
            }.bind(this));

            // Create a "messages" surface
            var messages = new Surface({
                size: [true, false],
                proportions: [false, 1],
                content: 'Messages',
                classes: ['nav', 'center'],
                origin: leftAlignAndOrigin,
                opacity: fadeIn
            });

            // Create back arrow surface. Here instead of creating a `<div>`
            // we create an `<img>` tag.

            // Note: we scale down this element and manually center it as opposed
            // to applying the `center` CSS class.
            var backArrow = new Surface({
                size: [true, false],
                proportions: [false, 0.4],
                tagName: 'img',
                classes: ['nav', 'backArrow'],
                attributes: {
                    src: './assets/chevron-left.svg'
                },
                origin: [0, 0.5],
                opacity: fadeOut
            });

            // Create a "hide" surface
            var hide = new Surface({
                size : [true, false],
                proportions : [false, 1],
                content: 'Hide',
                classes: ['nav', 'hide', 'center'],
                opacity: fadeIn
            });

            // Emit a `close` event when the "hide" surface is clicked
            hide.on('click', function () {
                this.emit('close');
            }.bind(this));

            // Create a "middle" surface
            var middle = new Surface({
                size : [true, false],
                proportions : [false, 1],
                content: 'saṃsāra',
                classes: ['nav', 'middle', 'center'],
                origin: middleAlignAndOrigin,
                opacity: fadeOut
            });

            // Create the render subtree
            this.add(background);
            this.add(hide);
            this.add({align: [0, 0.5]}).add(backArrow);
            this.add({align: leftAlignAndOrigin}).add(back);
            this.add({align: leftAlignAndOrigin}).add(messages);
            this.add({align : middleAlignAndOrigin}).add(middle);
        }
    });

    module.exports = NavBar;
});