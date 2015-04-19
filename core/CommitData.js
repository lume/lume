define(function(require, exports, module) {
    var commitData = {};

    function get(id) {
        return commitData[id];
    }

    function set(id, data) {
        commitData[id] = data;
    }

    function reset(id) {
        var data = {
            transform : [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
            opacity : 1,
            size : null,
            origin : null,
            dirty : true
        };

        set(id, data);
    }

    function register(id){
        reset(id);
        return id;
    }

    function unregister(id) {
        delete commitData[id];
    }

    module.exports = {
        register: register,
        unregister: unregister,
        reset : reset,
        get: get,
        set: set
    };
});
