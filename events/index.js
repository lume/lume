define(function(require, exports, module) {
    module.exports = {
        EventEmitter: require('./EventEmitter'),
        EventHandler: require('./EventHandler'),
        EventMapper: require('./EventMapper'),
        EventFilter: require('./EventFilter'),
        EventSplitter: require('./EventSplitter')
    };
});
