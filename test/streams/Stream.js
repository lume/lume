define(function (require) {
    var loop = require('loop');
    var Stream = require('samsara/streams/Stream');
    var Transitionable = require('samsara/core/Transitionable');
    var Timer = require('samsara/core/Timer');
    var EventEmitter = require('samsara/events/EventEmitter');

    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var postTickQueue = require('samsara/core/queues/postTickQueue');

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

    QUnit.test('start', function(assert){
        expect(1);
        var done = assert.async();

        var stream = new Stream();
        var emitter = new EventEmitter();
        var emitSize = [0, 0];

        stream.subscribe(emitter);

        stream.on('start', function(size) {
            assert.ok(size == emitSize);
            loop.stop();
            done()
        });

        emitter.emit('start', emitSize);
    });

    QUnit.test('merge', function(assert){
        expect(3);
        var done = assert.async();

        var size1 = new EventEmitter();
        var size2 = new EventEmitter();
        var size3 = new EventEmitter();

        var stream = Stream.merge({
            size1 : size1,
            size2 : size2,
            size3 : size3
        });

        stream.on('start', function(mergedData) {
            assert.ok(mergedData.size1 === true);
            assert.ok(mergedData.size2 === 4);
            assert.ok(mergedData.size3 === undefined);
            loop.stop();
            done();
        });

        size1.emit('start', true);
        size2.emit('start', 4);
    });

    QUnit.test('lift', function(assert) {
        expect(7);
        var done = assert.async();
        var N = 5;

        var emitters = [];
        for (var i = 0; i < N; i++) {
            var emitter = new EventEmitter();
            emitters.push(emitter);
        }

        var timesFired = 0;
        var stream = Stream.lift(function() {
            timesFired++;
            var sum = 0;
            for (var i = 0; i < N; i++) {
                assert.deepEqual(arguments[i], [i, i]);
                sum += i;
            }

            assert.ok(timesFired == 1);
            return sum;
        }, emitters);

        stream.on('start', function(sum) {
            assert.ok(sum == N * (N - 1) / 2);
            loop.stop();
            done();
        });

        for (var i = 0; i < N; i++)
            emitters[i].emit('start', [i, i]);
    });

    QUnit.test('SUE start start', function(assert){
        expect(2);
        var done = assert.async();

        var source1 = new EventEmitter();
        var source2 = new EventEmitter();

        var stream = Stream.merge([source1, source2]);

        stream.on('start', function(data){
            assert.ok(data[0]);
            assert.ok(data[1]);
            loop.stop();
            done();
        });

        source1.emit('start', true);
        source2.emit('start', true);
    });

    QUnit.test('SUE start update', function(assert){
        expect(4);
        var done = assert.async();

        var source1 = new EventEmitter();
        var source2 = new EventEmitter();

        var stream = Stream.merge([source1, source2]);

        stream.on('start', function(data){
            assert.ok(data[0]);
            assert.ok(data[1]);
        });

        stream.on('update', function(data){
            assert.ok(data[0]);
            assert.ok(data[1]);
            loop.stop();
            done();
        });

        source1.emit('start', true);
        source2.emit('update', true);
    });

    QUnit.test('SUE start end', function(assert){
        expect(2);
        var done = assert.async();

        var source1 = new EventEmitter();
        var source2 = new EventEmitter();

        var stream = Stream.merge([source1, source2]);

        stream.on('update', function(data){
            assert.ok(data[0]);
            assert.ok(data[1]);
            loop.stop();
            done();
        });

        source1.emit('start', true);
        source2.emit('end', true);
    });

    QUnit.test('Single merge', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);

        var stream = Stream.merge([t]);

        stream.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');

            assert.deepEqual(value, [0]);
        });

        stream.on('update', function(value) {
            state = updateState(state, 'update');

            assert.ok(value[0] >= 0 && value[0] <= 1);
        });

        stream.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');

            assert.deepEqual(value, [1]);

            loop.stop();
            done();
        });

        t.set(1, {duration : 200});
    });

    QUnit.test('Simultaneous merge', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);
        var r = new Transitionable(2);

        var stream = Stream.merge([t, s, r]);

        stream.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');

            assert.deepEqual(value, [0, 1, 2]);
        });

        stream.on('update', function(value) {
            state = updateState(state, 'update');

            assert.ok(value[0] >= 0 && value[0] <= 1);
            assert.ok(value[1] >= 1 && value[1] <= 2);
            assert.ok(value[2] >= 2 && value[2] <= 3);
        });

        stream.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');

            assert.deepEqual(value, [1, 2, 3]);

            loop.stop();
            done();
        });

        t.set(1, {duration : 200});
        s.set(2, {duration : 200});
        r.set(3, {duration : 200});
    });

    QUnit.test('Staggered end merge', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);
        var r = new Transitionable(2);

        var stream = Stream.merge([t, s, r]);

        stream.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');

            assert.deepEqual(value, [0, 1, 2]);
        });

        stream.on('update', function(value) {
            state = updateState(state, 'update');

            assert.ok(value[0] >= 0 && value[0] <= 1);
            assert.ok(value[1] >= 1 && value[1] <= 2);
            assert.ok(value[2] >= 2 && value[2] <= 3);
        });

        stream.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');

            assert.deepEqual(value, [1, 2, 3]);

            loop.stop();
            done();
        });

        t.set(1, {duration : 200});
        s.set(2, {duration : 400});
        r.set(3, {duration : 600});
    });

    QUnit.test('Staggered merge', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);
        var r = new Transitionable(2);

        var stream = Stream.merge([t, s, r]);

        stream.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
            assert.deepEqual(value, [0, 1, 2]);
        });

        stream.on('update', function(value) {
            state = updateState(state, 'update');
        });

        stream.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            assert.deepEqual(value, [1, 2, 3]);
            loop.stop();
            done();
        });

        t.set(1, {duration : 500});

        Timer.setTimeout(function(){
            s.set(2, {duration : 200});
        }, 200);

        Timer.setTimeout(function(){
            r.set(3, {duration : 200});
        }, 400);
    });

    QUnit.test('Staggered merge2', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);
        var r = new Transitionable(2);

        var stream = Stream.merge([t, s, r]);

        stream.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
            assert.deepEqual(value, [0, 1, 2]);
        });

        stream.on('update', function(value) {
            state = updateState(state, 'update');
        });

        stream.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            assert.deepEqual(value, [1, 2, 3]);
            loop.stop();
            done();
        });

        t.set(1, {duration : 500}, function(){
            s.set(2, {duration : 500});
        });

        Timer.setTimeout(function(){
            r.set(3, {duration : 1000});
        }, 300);
    });

    QUnit.test('Set immediate merge 1', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);

        var stream = Stream.merge([t]);

        stream.on('set', function(value) {
            console.log('set', value);
            state = updateState(state, 'set');
            assert.deepEqual(value, [0]);
            loop.stop();
            done();
        });

        stream.on('start', function(value) {
            assert.ok(false);
        });

        stream.on('update', function(value) {
            assert.ok(false);
        });

        stream.on('end', function(value) {
            assert.ok(false);
        });
    });

    QUnit.test('Set immediate merge', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);

        var stream = Stream.merge([t, s]);

        stream.on('set', function(value) {
            console.log('set', value);
            state = updateState(state, 'set');
            assert.deepEqual(value, [0, 1]);
            loop.stop();
            done();
        });

        stream.on('start', function(value) {
            assert.ok(false);
        });

        stream.on('update', function(value) {
            assert.ok(false);
        });

        stream.on('end', function(value) {
            assert.ok(false);
        });
    });

    QUnit.test('Set one merge', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);

        var stream = Stream.merge([t, s]);

        stream.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
            assert.deepEqual(value, [0, 1]);
        });

        stream.on('update', function(value) {
            state = updateState(state, 'update');
        });

        stream.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            assert.deepEqual(value, [1, 1]);
            loop.stop();
            done();
        });

        t.set(1, {duration : 1000});
    });

    QUnit.test('Cascade merge', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);
        var r = new Transitionable(2);

        var stream1 = Stream.merge([t, s]);
        var stream2 = Stream.merge([r, stream1]);

        var state1 = STATE.none;
        var state2 = STATE.none;

        stream1.on('start', function(value) {
            console.log('start 1', value);
            state1 = updateState(state1, 'start');
        });

        stream1.on('update', function(value) {
            state1 = updateState(state1, 'update');
        });

        stream1.on('end', function(value) {
            console.log('end 1', value);
            state1 = updateState(state1, 'end');
        });

        stream2.on('start', function(value) {
            console.log('start 2', value[0], value[1]);
            state2 = updateState(state2, 'start');
        });

        stream2.on('update', function(value) {
            state2 = updateState(state2, 'update');
        });

        stream2.on('end', function(value) {
            console.log('end 2', value[0], value[1]);
            state2 = updateState(state2, 'end');
            loop.stop();
            done();
        });

        t.set(1, {duration : 200});
        s.set(2, {duration : 100});
        r.set(3, {duration : 400});
    });

    QUnit.test('Stream start on end', function(assert){
        var done = assert.async();

        var t = new Transitionable(0);
        var s = new Transitionable(1);

        var stream = Stream.merge([s,t]);

        var state = STATE.none;

        stream.on('start', function(value) {
            console.log('start', value);
            state = updateState(state, 'start');
        });

        stream.on('update', function(value) {
            state = updateState(state, 'update');
        });

        stream.on('end', function(value) {
            console.log('end', value);
            state = updateState(state, 'end');
            loop.stop();
            done();
        });

        t.set(1, {duration : 200}, function(){
            s.set(2, {duration : 200});
        });
    });

});
