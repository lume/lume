define(function(require, exports, module){
    var View = require('samsara/core/View');
    var Surface = require('samsara/dom/Surface');
    var Stream = require('samsara/streams/Stream');
    var Transitionable = require('samsara/core/Transitionable');

    var SliderPanel = require('./Panel');

    var Nav = View.extend({
        defaults: {
            transition: false
        },
        initialize: function(options){
            var gestureSurface = new Surface({
                proportions : [.5,1],
                classes : ['noselect', 'navItem', 'center'],
                content : 'gestures'
            });

            var paramsSurface = new Surface({
                proportions : [.5,1],
                classes : ['noselect', 'navItem', 'center'],
                content : 'parameters'
            });

            var closeSurface = new Surface({
                content : 'close',
                classes : ['noselect', 'navItem', 'center']
            });

            closeSurface.on('click', function(){
                this.emit('close');
            }.bind(this));

            paramsSurface.on('click', function(){
                this.emit('toggle-params');
            }.bind(this));

            gestureSurface.on('click', function(){
                this.emit('toggle-gesture');
            }.bind(this));

            this.opacity = new Transitionable(1);

            var showNode = this.add({opacity : this.opacity})
            var hideNode = this.add({opacity : this.opacity.map(function(val){ return 1 - val; })})

            showNode.add(gestureSurface);
            showNode.add({align : [.5,0]}).add(paramsSurface);

            hideNode.add(closeSurface);
        },
        show : function show(transition){
            if (this.opacity.get() > 0) return;
            this.opacity.set(1, transition);
        },
        hide : function hide(transition){
            if (this.opacity.get() === 0) return;
            this.opacity.set(0, transition);
        }
    });

    module.exports = Nav;
});