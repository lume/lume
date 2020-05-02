define(function(require, exports, module){
    var Context = require('samsara/dom/Context');
    var Fingers = require('samsara/ui/Fingers');

    var context = new Context();

    var fingers = new Fingers();
    fingers.subscribe(context);
    context.add(fingers);

    context.mount(document.body);
});