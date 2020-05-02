define(function(require, exports, module){
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var SequentialLayout = require('samsara/layouts/SequentialLayout');
    var View = require('samsara/core/View');
    var Stream = require('samsara/streams/Stream');
    var Slider = require('samsara/ui/Slider');
    var SliderPanel = require('./app/SliderPanel');
    var EmptyNode = require('samsara/core/EmptyNode');

    var panel = new SliderPanel({
        spacing : 10
    });

    var sliderTransition = {curve : 'spring', period : 100, damping : .7};
    var pitchSlider = new Slider({
        size : [300,20],
        value : 20,
        range : [-50, 50],
        label : 'pitch',
        transition : sliderTransition
    });

    var spacingSlider = new Slider({
        size : [300, 20],
        value : 0,
        range : [0, 50],
        label : 'spacing',
        transition : sliderTransition
    });

    var radiusSlider = new Slider({
        size : [300, 20],
        value : 400,
        range : [50, 1000],
        label : 'radius',
        transition : sliderTransition
    });

    var perspectiveSlider = new Slider({
        size : [300, 20],
        value : 500,
        range : [50, 1000],
        label : 'perspective',
        transition : sliderTransition
    });

    var offsetSlider = new Slider({
        size : [300, 20],
        value : 0,
        range : [-5000, 5000],
        label : 'offset',
        transition : sliderTransition
    });

    panel.push(pitchSlider);
    panel.push(spacingSlider);
    panel.push(radiusSlider);
    panel.push(perspectiveSlider);
    panel.push(offsetSlider);

    // Parameters
    var N = 60;
    var width = 100;
    var height = 162;
    var radius = radiusSlider.value;
    var pitch = pitchSlider.value;
    var spacing = spacingSlider.value;

    // Create the layout with options
    var layout = new SequentialLayout({
        direction : SequentialLayout.DIRECTION.X,
        spacing : spacing,
        offset : offsetSlider.value
    });

    layout.setLengthMap(function(length, radius, pitch){
        var index = length / width;
        var angleY = index * 2 * Math.asin(.5 * width / radius);
        var angleSkew = Math.atan2(pitch, width);

        return Transform.composeMany(
            Transform.skewY(angleSkew),
            Transform.translate([0, index * pitch, -radius]),
            Transform.rotateY(-angleY),
            Transform.translateZ(radius),
            Transform.skewY(-angleSkew)
        );
    }, [radius, pitch]);

    function createSurface(){
        var hue = Math.floor(Math.random() * 360);
        var color = 'hsla(' + hue + ',50%,50%,.5)';

        return new Surface({
            origin : [1,0],
            classes : ['listItem', 'center'],
            properties : {
                background : color
            }
        });
    }

    explode = new Transitionable(0);

    var MyView = View.extend({
        initialize : function(){
            var surface = createSurface();

            surface.on('click', function(){
                this.emit('click')
            }.bind(this));

            var transform = explode.map(function(value){
                return Transform.translateX(width/2 + value);
            });

            this
                .add({transform : transform})
                .add(surface);
        }
    });

    // Build the layout
    for (var i = 0; i < N; i++) {
        var size = new Transitionable([width , height]);

        var view = new MyView({
            size : size,
            origin : [0,.5]
        });

        (function(view, size){
            view.on('click', function(){
                size.set([-spacingSlider.get(), height], {duration : 300}, function(){
                    layout.unlink(view);
                    view.remove();
                });
            });
        })(view, size);

        layout.push(view);
    }

    // Build Render Tree
    var context = new Context();
    context.perspectiveFrom(perspectiveSlider.value);

    context.add({align : [0.5,0.25]}).add(layout);

    var panelContext = new Context();
    panelContext.add(panel);

    context.mount(document.body);
    panelContext.mount(document.body);
});