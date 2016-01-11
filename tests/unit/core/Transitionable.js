define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var loop = require('samsara/../tests/loop');
    var Transitionable = require('samsara/core/Transitionable');

    loop.start();

    registerSuite({
        name: 'Transitionable',
        setOnEnd: function () {
            var timesFiredStart = 0;
            var timesFiredEnd = 0;
            var t = new Transitionable(0);

            t.on('start', function(value){
                timesFiredStart++;
                assert.equal(timesFiredStart, 1);
                assert.equal(value, 0);
            });

            t.on('update', function(value){
                assert.isTrue(value > 0 && value <= 2);
            });

            t.on('end', function(value){
                timesFiredEnd++;
                assert.equal(timesFiredEnd, 1);
                assert.equal(value, 2);
                loop.stop();
            });

            t.set(1, {duration: 200}, function () {
                t.set(2, {duration: 200});
            });
        }
    });
});