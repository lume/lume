define(function (require) {
    var loop = require('loop');
    var Stream = require('samsara/streams/Stream');
    var Transitionable = require('samsara/core/Transitionable');
    var Timer = require('samsara/core/Timer');
    var EventEmitter = require('samsara/events/EventEmitter');

    var preTickQueue = require('samsara/core/queues/preTickQueue');

    loop.start();

    QUnit.module('Stream');

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

    // QUnit.test('subscribe interrupt', function(assert){
    //     var done = assert.async();

    //     var t = new Transitionable(0);

    //     var stream = new Stream();

    //     var state = STATE.none;

    //     stream.on('start', function(value) {
    //         console.log('start', value);
    //         state = updateState(state, 'start');
    //     });

    //     stream.on('update', function(value) {
    //         console.log('update', value);
    //         state = updateState(state, 'update');
    //     });

    //     stream.on('end', function(value) {
    //         console.log('end', value);
    //         state = updateState(state, 'end');

    //         loop.stop();
    //         done();
    //     });

    //     Timer.setTimeout(function(){
    //         stream.subscribe(t);
    //     }, 200);

    //     t.set(1, {duration : 500});
    // });

    // QUnit.test('unsubscribe interrupt', function(assert){
    //     var done = assert.async();

    //     var t = new Transitionable(0);

    //     var stream = new Stream();
    //     stream.subscribe(t);


    //     stream.on('start', function(value) {
    //         console.log('start', value);
    //         state = updateState(state, 'start');

    //         assert.ok(value === 0);
    //     });

    //     stream.on('update', function(value) {
    //         console.log('update', value);
    //         state = updateState(state, 'update');

    //         assert.ok(value >= 0 && value < 1);
    //     });

    //     stream.on('end', function(value) {
    //         console.log('end', value);
    //         state = updateState(state, 'end');

    //         assert.ok(value < 1);

    //         loop.stop();
    //         done();
    //     });

    //     t.set(1, {duration : 500});

    //     Timer.setTimeout(function(){
    //         stream.unsubscribe(t);
    //     }, 250)
    // });

    QUnit.test('subscribe interrupt 2', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(0);

        var state = STATE.none;

        s.on('start', function(value){
            console.log('s start', value)
        });

        s.on('update', function(value){
            console.log('s update', value)
        });

        s.on('end', function(value){
            console.log('s end', value)
        });

        t.on('start', function(value){
            console.log('t start', value)
        });

        t.on('update', function(value){
            console.log('t update', value)
        });

        t.on('end', function(value){
            console.log('t end', value)
        });

        setTimeout(function(){
            var stream = Stream.merge([t, s]);

            stream.on('start', function(value) {
                console.log('start', value);
                state = updateState(state, 'start');
            });

            stream.on('update', function(value) {
                console.log('update', value);
                state = updateState(state, 'update');
            });

            stream.on('end', function(value) {
                console.log('end', value);
                state = updateState(state, 'end');

                loop.stop();
                done();
            });
        }, 100);

        s.set(1, {duration : 600});
        t.set(1, {duration : 600});
    });

    QUnit.test('unsubscribe on end', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Stream();
        s.subscribe(t);

        var state = STATE.none;

        s.on('start', function(value){
            console.log('s start', value);
            state = updateState(state, 'start');
        });

        s.on('update', function(value){
            console.log('s update', value);
            state = updateState(state, 'update');
        });

        s.on('end', function(value){
            console.log('s end', value);
            state = updateState(state, 'end');

            loop.stop();
            done();
        });

        t.set(1, {duration : 400}, function(){
            console.log('hi!')
            s.unsubscribe(t);
        });
    });

});
