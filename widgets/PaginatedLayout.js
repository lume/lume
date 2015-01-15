define(function(require, exports, module) {
    var Scrollview = require('famous/views/Scrollview');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/core/Transitionable');
    var RenderNode = require('famous/core/RenderNode');
    var Modifier = require('famous/core/Modifier');
    var EventHandler = require('../core/EventHandler');
    var ViewSequence = require('../core/ViewSequence');
    var View = require('../views/View');

    function PaginatedLayout(options){
        View.apply(this, arguments);

        // state
        this.index = 0;
        this.pages = new ViewSequence([]);
        this.progress = 0;
        this.dotsWidth = 0;
        this.size = null;

        // subcomponents

        this.scrollview = new Scrollview({
            direction : 0,
            paginated : true,
            margin: Infinity
        });

        this.scrollview.sequenceFrom(this.pages);

        var currentDotPosition = new Transitionable(0);
        var currentDotOpacity = new Transitionable(1);

        var currentDotModifier = new Modifier({
            opacity : currentDotOpacity,
            transform : function(){
                return Transform.translate(currentDotPosition.get(), 0, 0);
            }.bind(this)
        });

        var currentDot = new Surface({
            size : [2*this.options.dotRadius, 2*this.options.dotRadius],
            properties : {
                borderRadius : '50%',
                background : this.options.dotColor
            }
        });

        var dotsModifier = new Modifier({
            size : function(){return [this.dotsWidth, 2 * this.options.dotRadius]}.bind(this),
            transform : Transform.inFront,
            origin : [.5,.5],
            align : [.5,.9]
        });

        this.dotsNode = new RenderNode(dotsModifier);
        this.dotsNode.add(currentDotModifier).add(currentDot);

        this.add(this.scrollview);
        this.add(this.dotsNode);

        // eventing

        this._eventInput.pipe(this.scrollview);
        this.subscribe(this.scrollview);

        switch (this.options.transition){
            case PaginatedLayout.TRANSITION.CONTINUOUS:
                this._eventInput.on('update', function(data){
                    currentDotPosition.set(data.progress);
                    var index = data.index;
                    var progress = data.progress;

                    this.index = data.index;
                    this.progress = progress;

                    var position = _calcPosition.call(this, index, progress);
                    currentDotPosition.set(position);
                }.bind(this));
                break;
            case PaginatedLayout.TRANSITION.DISCRETE:
                this._eventInput.on('end', function(data){
                    this.index = data.index;
                    this.progress = data.progress;
                    var position = _calcPosition.call(this, this.index, this.progress);
                    currentDotPosition.set(position);
                    currentDotOpacity.set(0);
                    currentDotOpacity.set(1, {duration : 100});
                }.bind(this));
                break;
        }
    }

    function _calcPosition(index, progress){
        return (index + progress) * (2*this.options.dotRadius + this.options.dotSpacing);
    }

    PaginatedLayout.TRANSITION = {
        CONTINUOUS : 0,
        DISCRETE : 1
    };

    PaginatedLayout.DEFAULT_OPTIONS = {
        dotRadius : 5,
        dotColor : 'white',
        dotSpacing : 4,
        transition : PaginatedLayout.TRANSITION.CONTINUOUS
    };

    PaginatedLayout.prototype = Object.create(View.prototype);
    PaginatedLayout.prototype.constructor = PaginatedLayout;

    PaginatedLayout.prototype.pagesFrom = function(pages){
        for (var i = 0; i < pages.length; i++)
            this.addPage(pages[i]);
    };

    PaginatedLayout.prototype.addPage = function(page){
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
    };

    PaginatedLayout.prototype.getSize = function(){
        return (this.size) ? this.size : this.pages.getSize();
    };

    PaginatedLayout.prototype.setSize = function(size){
        this.size = size;
    };

    PaginatedLayout.prototype.getProgress = function(){
        return this.progress;
    };

    PaginatedLayout.prototype.getCurrentIndex = function(){
        return this.index;
    };

    PaginatedLayout.prototype.goToNextPage = function(){
        Scrollview.prototype.goToNextPage.call(this.scrollview);
    };

    PaginatedLayout.prototype.goToPreviousPage = function(){
        Scrollview.prototype.goToPreviousPage.call(this.scrollview);
    };

    PaginatedLayout.prototype.goToPage = function(index){
        Scrollview.prototype.goToPage.call(this.scrollview, index);
    };

    module.exports = PaginatedLayout;
});
