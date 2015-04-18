/* copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Scrollview = require('famous/views/Scrollview');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/core/Transitionable');
    var Modifier = require('famous/core/Modifier');
    var ViewSequence = require('../core/ViewSequence');
    var View = require('./View');

    function _calcPosition(index, progress){
        return (index + progress) * (2 * this.options.dotRadius + this.options.dotSpacing);
    }

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        },
        TRANSITION : {
            CONTINUOUS : 0,
            DISCRETE : 1
        }
    };

    module.exports = View.extend({
        defaults : {
            dotRadius : 5,
            dotColor : 'white',
            dotSpacing : 4,
            transition : CONSTANTS.TRANSITION.CONTINUOUS,
            direction : CONSTANTS.DIRECTION.X,
            groupScroll : true,
            margin : Infinity,
            paginated : true
        },
        initialize : function(options){
            this.initializeState(options);
            this.initializeSubviews(options);
            this.initializeEvents(options);
        },
        pagesFrom : function(pages){
            for (var i = 0; i < pages.length; i++)
                this.addPage(pages[i]);
        },
        addPage : function(page){
            this.pages.push(page);

            var dotModifier = new Modifier({
                transform : Transform.translate(this.dotsWidth, 0, 0)
            });

            var dot = new Surface({
                size : [2*this.options.dotRadius, 2*this.options.dotRadius],
                properties : {
                    borderRadius : '50%',
                    border : '1px solid ' + this.options.dotColor
                }
            });

            this.dotsWidth += 2*this.options.dotRadius + this.options.dotSpacing;
            this.dotsNode.add(dotModifier).add(dot);
        },
        getProgress : function(){
            return this.progress;
        },
        getCurrentIndex : function(){
            return this.index;
        },
        goToNextPage : function(){
            Scrollview.prototype.goToNextPage.call(this.scrollview);
        },
        goToPreviousPage : function(){
            Scrollview.prototype.goToPreviousPage.call(this.scrollview);
        },
        goToPage : function(index){
            Scrollview.prototype.goToPage.call(this.scrollview, index);
        },
        initializeState : function(){
            this.index = 0;
            this.pages = new ViewSequence([]);
            this.progress = 0;
            this.dotsWidth = 0;
            this.currentDotPosition = new Transitionable(0);
            this.currentDotOpacity = new Transitionable(1);
        },
        initializeSubviews : function(options){
            this.scrollview = new Scrollview(options);

            this.scrollview.sequenceFrom(this.pages);

            var currentDotModifier = new Modifier({
                opacity : this.currentDotOpacity,
                transform : function(){
                    return Transform.translate(this.currentDotPosition.get(), 0, 0);
                }.bind(this)
            });

            var currentDot = new Surface({
                size : [2*options.dotRadius, 2*options.dotRadius],
                properties : {
                    borderRadius : '50%',
                    background : options.dotColor
                }
            });

            var dotsModifier = new Modifier({
                size : function(){return [this.dotsWidth, 2 * options.dotRadius]}.bind(this),
                transform : Transform.inFront,
                origin : [.5,.5],
                align : [.5,.9]
            });

            this.add(this.scrollview);
            this.dotsNode = this.add(dotsModifier);
            this.dotsNode.add(currentDotModifier).add(currentDot);
        },
        initializeEvents : function(options){
            var eventInput = this.getEventInput();
            this.scrollview.subscribe(eventInput);
            this.subscribe(this.scrollview);

            switch (options.transition){
                case CONSTANTS.TRANSITION.CONTINUOUS:
                    eventInput.on('update', function(data){
                        this.currentDotPosition.set(data.progress);
                        var index = data.index;
                        var progress = data.progress;

                        this.index = data.index;
                        this.progress = progress;

                        var position = _calcPosition.call(this, index, progress);
                        this.currentDotPosition.set(position);
                    });
                    break;
                case CONSTANTS.TRANSITION.DISCRETE:
                    eventInput.on('end', function(data){
                        this.index = data.index;
                        this.progress = data.progress;
                        var position = _calcPosition.call(this, this.index, this.progress);
                        this.currentDotPosition.set(position);
                        this.currentDotOpacity.set(0);
                        this.currentDotOpacity.set(1, {duration : 100});
                    });
                    break;
            }
        }
    }, CONSTANTS);

});
