define(function(require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var Transitionable = require('samsara/core/Transitionable');
    var Stream = require('samsara/Streams/Stream');
    var Tab = require('./Tab');

    var TabContainer = View.extend({
        defaults : {
            src : '',
            title : '',
            titleHeight: 26,
            index : 0,
            angle : -Math.PI / 6
        },
        initialize: function (options) {
            this.angle = new Transitionable(options.angle);
            this.shift = new Transitionable(0);
            this.toggle = false;

            var parentSize = new Transitionable([undefined, 150]);
            var tabSize = new Transitionable([undefined, 400]);

            this.setSize(parentSize);

            var tab = new Tab({
                size : tabSize,
                src : options.src,
                title : options.title,
                height : options.titleHeight
            });

            tab.on('close', function(){
                parentSize.set([undefined, 0], {duration: 300});
                this.shift.set(-2000, {duration : 1500}, function(){
                    tab.remove();
                }.bind(this));
            }.bind(this));

            tab.on('select', function(){
                if (!this.toggle){
                    this.angle.set(0, {duration: 200});
                    parentSize.set([undefined, window.innerHeight], {duration: 200});
                    tabSize.set([undefined, window.innerHeight], {duration: 200});
                    this.emit('goto', options.index);
                }
                else {
                    parentSize.set([undefined, 150], {duration: 200});
                    tabSize.set([undefined, 400], {duration: 200});
                    this.angle.set(options.angle, {duration: 200});
                }

                this.toggle = !this.toggle;
            }.bind(this));

            var transform = Stream.lift(function(angle, scrollData, deleteShift){
                if (!scrollData) return false;

                var topShift = Math.exp(scrollData.index - options.index + scrollData.progress) - 1;
                topShift = Math.max(Math.min(topShift, 2), -0.2);

                return Transform.thenMove(
                    Transform.rotateX(angle),
                    [deleteShift, 20*topShift, -100*topShift]
                );
            }.bind(this), [this.angle, this.input, this.shift]);

            this
                .add({transform : transform})
                .add(tab);
        }
    });

    module.exports = TabContainer;
});
