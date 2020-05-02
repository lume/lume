define(function(require, exports, module) {
    var Context = require('samsara/dom/Context');
    var Surface = require('samsara/dom/Surface');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');

    var surface = new Surface({
        size : [100,100],
        origin : [.5,.5],
        content : 'hello',
        properties : {background : 'red'}
    });

    var context = new Context();

    context.add({transform : Transform.translateX(100)}).add(surface);

    context.mount(document.body);
});
