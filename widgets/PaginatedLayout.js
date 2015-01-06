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
            paginated : true
        });

        this.dots = [];

        this.currentDotPosition = new Transitionable(0);
        this.dotsWidth = 0;

        var dotsModifier = new Modifier({
            size : function(){return [this.dotsWidth, 10]}.bind(this),
            transform : Transform.inFront,
            origin : [.5,.5],
            align : [.5,.8]
        });

        var currentDotModifier = new Modifier({
            transform : function(){
                Transform.translate(0, this.currentDotPosition.get(), 0)
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

        this.dotsNode.add(currentDotModifier).add(this.currentDot)

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.pipe(this.scrollview);
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
            return [
                this.scrollview.render(),
                this.dotsNode.render()
            ];
        }
    };


    module.exports = PaginatedLayout;
});