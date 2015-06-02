define(function(require, exports, module) {
    function Commitables(){
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

    function clear(){
        this.committers = {};
        this.specs = {};
        this.count = 0;
    }

    Commitables.prototype.register = function(committer, spec){
        var id = this.count++;
        setId(committer, id);
        this.committers[id] = committer;
        this.specs[id] = spec;
    };

    Commitables.prototype.unregister = function(committer){
        var id = getId(committer);
        delete this.committers[id];
        delete this.specs[id];
        setId(committer, Number.NaN);
    };

    Commitables.prototype.commit = function(allocator){
        if (this.count === 0) return;

        for (var id in this.committers){
            var committer = this.committers[id];
            var spec = this.specs[id];
            committer.commit(spec, allocator);
        }
        clear.call(this);
    };

    module.exports = Commitables;
});
