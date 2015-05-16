define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    function Getter(getter){
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventOutput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventOutput.subscribe(getter);
        this.getter = getter.get.bind(getter);
    }

    Getter.prototype.get = function(){
        return this.getter();
    };

    Getter.prototype.map = function(fn){
        var mapped = new Getter(this);

        mapped.getter = function(){
            return fn(this.getter());
        }.bind(this);
        return mapped;
    };

    Getter.prototype.pluck = function(key){
        return this.map(function(value){
            return value[key];
        });
    };

    module.exports = Getter;
});
