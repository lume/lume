define(function(require, exports, module) {
    module.exports = {
        Core: require('./core'),
        DOM: require('./dom'),
        Events: require('./events'),
        Inputs: require('./inputs'),
        Layouts: require('./layouts'),
        Streams: require('./streams'),
        Camera: require('./camera')
    };
});
