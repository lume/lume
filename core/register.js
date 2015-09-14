define(function(require, exports, module) {
    var counter = 0;

    /**
     * Register provides a unique Id for every commitable object for later reference.
     *
     * @class Engine
     * @private
     */
    module.exports = function register(commitable){
        commitable._id = counter;
        return counter++;
    }
});