define(function(require, exports, module) {
    module.exports = {
        GenericInput: require('./GenericInput'),
        MouseInput: require('./MouseInput'),
        TouchInput: require('./TouchInput'),
        ScrollInput: require('./ScrollInput'),
        ScaleInput: require('./ScaleInput'),
        RotateInput: require('./RotateInput'),
        PinchInput: require('./PinchInput')
    };
});
