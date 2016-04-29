define(function (require) {
    var loop = require('loop');
    var Stream = require('samsara/streams/Stream');
    var EventEmitter = require('samsara/events/EventEmitter');

    loop.start();

    QUnit.module('Stream');

    QUnit.test('start', function(assert){
        expect(1);
        QUnit.async();

        var stream = new Stream();
        var emitter = new EventEmitter();
        var emitSize = [0, 0];

        stream.subscribe(emitter);

        stream.on('start', function(size) {
            assert.ok(size == emitSize);
            loop.stop();
            QUnit.start();
        });

        emitter.emit('start', emitSize);
    });

    QUnit.test('merge', function(assert){
        expect(3);
        QUnit.async();

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
            QUnit.start();
        });

        size1.emit('start', true);
        size2.emit('start', 4);
    });

    QUnit.test('lift', function(assert) {
        expect(7);
        QUnit.async();
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
            QUnit.start();
        });

        for (var i = 0; i < N; i++)
            emitters[i].emit('start', [i, i]);
    });

});