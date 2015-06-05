define(function(require, exports, module) {
    var Spec = require('famous/core/Spec');

    function Commitables(){
        this.currentIds = [];
        this.committers = {};
        this.specs = {};
        this.count = 0;
    }

    var idAttribute = '_committerId';

    function setId(committer, id){
        committer[idAttribute] = id;
    }

    function getId(committer){
        return committer[idAttribute];
    }

    Commitables.prototype.getSpec = function(id){
        return this.specs[id];
    };

    Commitables.prototype.register = function(committer){
        var id = this.count++;
        setId(committer, id);
        this.committers[id] = committer;
        var spec = new Spec();
        this.specs[id] = spec;

        spec.on('register', function(){
            this.currentIds.push(id);
        }.bind(this));

        spec.on('unregister', function(){
            var index = this.currentIds.indexOf(id);
            if (index !== -1) this.currentIds.splice(index, 1);
        }.bind(this));

        return id;
    };

    Commitables.prototype.unregister = function(committer){
        var id = getId(committer);
        var spec = this.specs[id];
        spec.off('register');
        spec.off('unregister');
        this._eventInput.unsubscribe(spec);
        delete this.committers[id];
        delete this.specs[id];
        setId(committer, Number.NaN);
    };

    Commitables.prototype.commit = function(allocator){
        for (var index = 0; index < this.currentIds.length; index++){
            var id = this.currentIds[index];
            var committer = this.committers[id];
            var spec = this.specs[id].get();
            committer.commit(spec, allocator);
        }
    };

    module.exports = Commitables;
});
