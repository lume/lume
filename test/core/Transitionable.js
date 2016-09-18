define(function (require) {
    var loop = require('loop');
    var Transitionable = require('samsara/core/Transitionable');
    var Stream = require('samsara/streams/Stream');

    loop.start();

    QUnit.module('Transitionable');

    var STATE = {
        none : 1,
        start : 2,
        update : 4,
        end : 8,
        set : 16
    };

    var state = STATE.none;

    function updateState(prevState, newState){
        var check = false;

        switch (STATE[newState]){
            case STATE.start:
                // previous event is `end` or previous state is `none`
                check = prevState & (STATE.set | STATE.none | STATE.end);
                break;
            case STATE.update:
                // previous event is `start` or `update`
                check = prevState & (STATE.start | STATE.update);
                break;
            case STATE.end:
                // previous event is `start` or `update`
                check = prevState & (STATE.start | STATE.update);
                break;
            case STATE.set:
                check = prevState & (STATE.set | STATE.none | STATE.end);
                break;
        }

        QUnit.assert.ok(check);

        return STATE[newState];
    }

    QUnit.test('Set immediate', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);

        t.on('set', function(value) {
            console.log('set', value);
            state = updateState(state, 'set');
            assert.equal(value, 0);
            loop.stop();
            done();
        });

        t.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
            assert.equal(value, 0);
        });

        t.on('update', function(value) {
            assert.ok(false);
        });

        t.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            assert.equal(value, 0);
            loop.stop();
            done();
        });
    });

    QUnit.test('Set duration', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);

        t.on('set', function(value) {
            assert.ok(false);
        });

        t.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
            assert.equal(value, 0);
        });

        t.on('update', function(value) {
            state = updateState(state, 'update');
            assert.ok(value >= 0 && value <= 1);
        });

        t.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            assert.equal(value, 1);
            loop.stop();
            done();
        });

        t.set(1, {duration : 200});
    });

    QUnit.test('Start on end', function(assert){
        var done = assert.async();
        var t = new Transitionable(0);

        t.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
            assert.equal(value, 0);
        });

        t.on('update', function(value) {
            state = updateState(state, 'update');
            assert.ok(value >= 0 && value <= 2);
        });

        t.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            assert.equal(value, 2);

            loop.stop();
            done();
        });

        t.set(1, {duration : 200}, function() {
            t.set(2, {duration : 200});
        });
    });

});