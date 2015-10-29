define(function(require, exports, module) {
    module.exports = {
        core: require('./core'),
        events: require('./events'),
        inputs: require('./inputs'),
        layouts: require('./layouts'),
        streams: require('./streams'),
        transitions: require('./transitions')
    };
});
