define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var View = require('samsara/core/View');
    var RenderNode = require('samsara/core/nodes/RenderTreeNode');

    var context = new Context();

    var MyView = View.extend({
        initialize: function(){
            var surface = new Surface({
                properties : {background : 'red'},
                origin : [.25, .5]
            });

            this
                .add({opacity : .5})
                .add(surface);
        }
    });

    var subview = new MyView();
    context.add({opacity : .5}).add(subview);

    // var surface = new Surface({
    //     properties : {background : 'red'},
    //     origin : [.25, .5]
    // });

    // var rn = new RenderNode();

    // rn.add({opacity : .5}).add(surface);

    // context
    //     .add({proportions : [.5,.5]})
    //     .add(rn)

    context.mount(document.body);
});
