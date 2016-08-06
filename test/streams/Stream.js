define(function (require) {
    var loop = require('loop');
    var Stream = require('samsara/streams/Stream');
    var EventEmitter = require('samsara/events/EventEmitter');

    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var dirtyTickQueue = require('samsara/core/queues/dirtyQueue');
    var postTickQueue = require('samsara/core/queues/postTickQueue');

    loop.start();

    QUnit.module('Stream');

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

        var stream = Stream.merge(function(data1, data2){
            return [data1, data2];
        }, [source1, source2]);

        stream.on('start', function(data){
            console.log(data)
            assert.ok(data[0]);
            assert.ok(data[1]);
            loop.end();
        });

        var source1 = new EventEmitter();
        var source2 = new EventEmitter();

        source1.emit('start', true);
        source2.emit('start', true);
    });

    QUnit.test('SUE start update', function(assert){
        expect(4);

        var stream = Stream.merge(function(data1, data2){
            return [data1, data2];
        }, [source1, source2]);

        stream.on('start', function(data){
            assert.ok(data[0]);
            assert.ok(data[1] === undefined);
        });

        stream.on('update', function(data){
            assert.ok(data[0]);
            assert.ok(data[1]);
            loop.end();
        });

        var source1 = new EventEmitter();
        var source2 = new EventEmitter();

        source1.emit('start', true);
        source2.emit('update', true);
    });

    QUnit.test('SUE start end', function(assert){
        expect(4);

        var stream = Stream.merge(function(data1, data2){
            return [data1, data2];
        }, [source1, source2]);

        stream.on('start', function(data){
            assert.ok(data[0]);
            assert.ok(data[1] === undefined);
        });

        stream.on('end', function(data){
            assert.ok(data[0]);
            assert.ok(data[1]);
            loop.end();
        });

        var source1 = new EventEmitter();
        var source2 = new EventEmitter();

        source1.emit('start', true);
        source2.emit('end', true);
    });

    QUnit.test('SUE start update start update end end', function(assert){
        expect(10);

        var stream = Stream.merge(function(data1, data2){
            return [data1, data2];
        }, [source1, source2]);

        var hasStarted = false;
        var hasUpdated = false;

        stream.on('start', function(data){
            if (!hasStarted){
                hasStarted = false;
                assert.ok(data[0] && data[1] === undefined);
            }
            else {
                assert.ok(data[0]);
                assert.ok(data[1]);
            }
        });

        stream.on('update', function(data){
            if (!hasUpdated){
                hasStarted = false;
                assert.ok(data[0] && data[1] === undefined);
            }
            else {
                assert.ok(data[0]);
                assert.ok(data[1]);
            }
        });

        stream.on('end', function(data){
            assert.ok(data[0]);
            assert.ok(data[1]);
            loop.end();
        });

        var source1 = new EventEmitter();
        var source2 = new EventEmitter();

        // source1 gets interrupted by immediate set of source2
        source1.emit('start', true);
        dirtyTickQueue.push(function(){
            source1.emit('update', true);
            source2.emit('start', true);
            postTickQueue.push(function(){
                source1.emit('update', true);
                preTickQueue.push(function(){
                    source2.emit('end', true);
                    source1.emit('end', true);
                });
            });
        });
    });
});