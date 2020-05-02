define(function(require, exports, module){
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Stream = require('samsara/streams/Stream');
    var Transitionable = require('samsara/core/Transitionable');

    var SliderPanel = require('./Panel');

    var GesturePanel = View.extend({
        defaults: {
            height: 50,
            spacing : 5
        },
        initialize: function(options){
            this.opacity = new Transitionable(0);

            var swipeRight = new GestureLine({
                size: [false, 50],
                text: 'scroll right',
                url: './assets/Swipe_Right.png'
            });

            var swipeLeft = new GestureLine({
                size: [false, 50],
                text: 'scroll left',
                url: './assets/Swipe_Left.png'
            });

            var pinch = new GestureLine({
                size: [false, 50],
                text: 'decrease radius',
                url: './assets/Pinch.png'
            });

            var spread = new GestureLine({
                size: [false, 50],
                text: 'increase radius',
                url: './assets/Spread.png'
            });

            var rotateRight = new GestureLine({
                size: [false, 50],
                text: 'increase pitch',
                url: './assets/RotateRight.png'
            });

            var rotateLeft = new GestureLine({
                size: [false, 50],
                text: 'decrease pitch',
                url: './assets/RotateLeft.png'
            });

            var heart = new GestureLine({
                size: [false, 50],
                text: 'surprise',
                url: './assets/Heart.png'
            });

            var panel = new SliderPanel({
                spacing : options.spacing
            });

            panel.push(swipeRight);
            panel.push(swipeLeft);
            panel.push(pinch);
            panel.push(spread);
            panel.push(rotateRight);
            panel.push(rotateLeft);
            panel.push(heart);

            this.add({opacity : this.opacity}).add(panel);
        },
        show : function(transition){
            if (this.opacity.get() > 0) return;
            this.opacity.set(0.8, transition || this.options.transition);
        },
        hide : function(transition){
            if (this.opacity.get() === 0) return;
            this.opacity.set(0, transition || this.options.transition);
        }
    });

    var GestureLine = View.extend({
        defaults: {
            url : '',
            text: ''
        },
        initialize: function(options){
            var description = new Surface({
                content: options.text,
                classes: ['center', 'noselect'],
                properties: {
                    color : 'white',
                    textAlign: 'center'
                }
            });

            var icon = new Surface({
                origin: [1,0],
                size : function(parentSize){
                    return [parentSize[1], parentSize[1]]
                },
                tagName: 'img',
                attributes : {
                    src: options.url
                }
            });

            this
                .add({align : [1,0]})
                .add({proportions: [.5,1]})
                .add(icon);

            this
                .add({proportions: [.5,1]})
                .add(description);
        }
    });

    module.exports = GesturePanel;
});