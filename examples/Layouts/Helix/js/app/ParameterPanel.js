define(function(require, exports, module){
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Slider = require('samsara/ui/Slider');
    var Stream = require('samsara/streams/Stream');
    var Transitionable = require('samsara/core/Transitionable');

    var SliderPanel = require('./Panel');

    // Add, proportionsX/Y, perspectiveOriginX/Y, show, hide methods
    var ParameterPanel = View.extend({
        defaults: {
            transition: false,
            sliderHeight : 40,
            spacing : 0,
            perspective: 100,
            perspectiveOriginX: .5,
            perspectiveOriginY: .5,
            proportionsX: .8,
            proportionsY: .8,
        },
        initialize: function(options){
            this.opacity = new Transitionable(0);

            var spacing = new Slider({
                size : [undefined, options.sliderHeight],
                value : options.spacing,
                range : [0, 200],
                label : 'spacing',
                transition : options.transition
            });

            var perspective = new Slider({
                size : [undefined, options.sliderHeight],
                value : options.perspective,
                range : [50, 1000],
                label : 'perspective',
                transition : options.transition
            });

            var perspectiveOriginX = new Slider({
                size : [undefined, options.sliderHeight],
                value : options.perspectiveOriginX,
                range : [0, 1],
                label : 'perspective origin X',
                transition : options.transition
            });

            var perspectiveOriginY = new Slider({
                size : [undefined, options.sliderHeight],
                value : options.perspectiveOriginY,
                range : [0, 1],
                label : 'perspective origin Y',
                transition : options.transition
            });

            var proportionsX = new Slider({
                size : [undefined, options.sliderHeight],
                value : options.proportionsX,
                range : [0.2, 1],
                label : 'proportions X',
                transition : false
            });

            var proportionsY = new Slider({
                size : [undefined, options.sliderHeight],
                value : options.proportionsY,
                range : [0.2, 1],
                label : 'proportions Y',
                transition : false
            });

            this.perspectiveOrigin = Stream.merge([
                perspectiveOriginX.value,
                perspectiveOriginY.value
            ]);

            this.proportions = Stream.merge([
                proportionsX.value,
                proportionsY.value
            ]);

            var panel = new SliderPanel({
                spacing : options.spacing
            });

            this.spacing = spacing;
            this.perspective = perspective;

            panel.push(spacing);
            panel.push(perspective);
            panel.push(perspectiveOriginX);
            panel.push(perspectiveOriginY);
            panel.push(proportionsX);
            panel.push(proportionsY);

            this.add({opacity : this.opacity}).add(panel);
        },
        show : function(transition){
            if (this.opacity.get() > 0) return;
            this.opacity.set(.8, transition || this.options.transition);
        },
        hide : function(transition){
            if (this.opacity.get() === 0) return;
            this.opacity.set(0, transition || this.options.transition);
        }
    });

    module.exports = ParameterPanel;
});