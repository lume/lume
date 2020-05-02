define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var View = require('samsara/core/View');
    var RenderNode = require('samsara/core/nodes/RenderTreeNode');
    var SliderPanel = require('./SliderPanel');
    var Slider = require('samsara/ui/Slider');

    var context = new Context();

    var panel = new SliderPanel({
        size: [100, 100],
        origin : [.5,.0]
    });

    // var Panel = View.extend({});
    // var panel = new Panel({
    //     size: [100, 100],
    //     origin : [.5,.0]
    // })

    var slider = new Surface({
        properties : {background : 'red'}
    });

    panel.add(slider);

    context.add(panel)

    context.mount(document.body);
});
