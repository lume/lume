define(function(require, exports, module) {
    function Getter(getter){
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
