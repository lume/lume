define(function(require, exports, module) {
    var Scrollview = require('famous/views/Scrollview');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/core/Transitionable');
    var RenderNode = require('famous/core/RenderNode');
    var Modifier = require('famous/core/Modifier');
    var EventHandler = require('../core/EventHandler');

    function PaginatedLayout(){
        this.scrollview = new Scrollview({
            direction : 0,
            paginated : true,
            margin: Infinity
        });
        window.scrollview = this.scrollview;

        this.dots = [];
        this.index = 0;

        this.currentDotPosition = new Transitionable(0);
        this.currentDotOpacity = new Transitionable(1);
        this.dotsWidth = 0;

        var dotsModifier = new Modifier({
            size : function(){return [this.dotsWidth, 10]}.bind(this),
            transform : Transform.inFront,
            origin : [.5,.5],
            align : [.5,.9]
        });

        var currentDotModifier = new Modifier({
            opacity : this.currentDotOpacity,
            transform : function(){
                return Transform.translate(this.currentDotPosition.get(), 0, 0)
            }.bind(this)
        });

        this.dotsNode = new RenderNode(dotsModifier);

        this.currentDot = new Surface({
            size : [10,10],
            properties : {
                borderRadius : '50%',
                background : 'white'
            }
        });

        this.dotsNode.add(currentDotModifier).add(this.currentDot);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.pipe(this.scrollview);
        this.subscribe(this.scrollview);

//        this._eventInput.on('pageChange', function(data){
//            var index = data.index;
//            var position = index * 14;
//            this.currentDotOpacity.set(0);
//            this.currentDotOpacity.set(1, {duration : 500});
//            this.currentDotPosition.set(position)
//        }.bind(this));

//        this._eventInput.on('settle', function(){
//            var index = this.scrollview.getCurrentIndex();
//            if (index == this.index) return;
//            var position = index * 14;
//            this.currentDotOpacity.set(0);
//            this.currentDotOpacity.set(1, {duration : 50});
//            this.currentDotPosition.set(position);
//            this.index = index;
//        }.bind(this));
    }

    PaginatedLayout.prototype = {
        pagesFrom : function(pages){
            Scrollview.prototype.sequenceFrom.apply(this.scrollview, arguments);
            for (var i = 0; i < pages.length; i++) this.addDot();
        },
        addDot : function(){
            var dotModifier = new Modifier({
                transform : Transform.translate(this.dotsWidth, 0, 0)
            });

            var dot = new Surface({
                size : [10,10],
                properties : {
                    borderRadius : '50%',
                    border : '1px solid white'
                }
            });
            this.dots.push(dot);
            this.dotsWidth += 14;
            this.dotsNode.add(dotModifier).add(dot);
        },
        render : function(){
            var progress = Scrollview.prototype.getProgress.call(this.scrollview);
            var index = this.scrollview.getCurrentIndex();

            this.currentDotPosition.set((index + progress) * 14);

            return [
                this.scrollview.render(),
                this.dotsNode.render()
            ];
        }
    };


    module.exports = PaginatedLayout;
});