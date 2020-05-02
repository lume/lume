define(function(require){
    var loop = require('loop');
    var Differential = require('samsara/streams/Differential');
    var Accumulator = require('samsara/streams/Accumulator');
    var Transitionable = require('samsara/core/Transitionable');

    loop.start();

    QUnit.module('Accumulator');

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

    QUnit.test('Accumulator with two sources', function(assert){
        var done = assert.async();

        var s = new Transitionable(2);
        var t = new Transitionable(1);

        var ds = new Differential();
        var dt = new Differential();

        ds.subscribe(s);
        dt.subscribe(t);

        var total = new Accumulator(5);
        total.subscribe(ds);
        total.subscribe(dt);

        var state = STATE.none;

        total.on('set', function(value){
            console.log('set', value);
        });

        total.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
        });

        total.on('update', function(value) {
            console.log('update', value);
            state = updateState(state, 'update');
        });

        total.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            loop.stop();
            done();
        });

        s.set(1, {duration : 200}, function(){
            t.set(2, {duration : 200});
        });
    });

});
