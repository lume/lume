define(function(require, exports, module) {
    var counter = 0;
    module.exports = function register(commitable){
        commitable._id = counter;
        return counter++;
    }
});