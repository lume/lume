define(function (require) {
    var loop = require('loop');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var EventEmitter = require('samsara/events/EventEmitter');

    loop.start();

    QUnit.module('Resize Stream');

    QUnit.test('resize', function(assert){
        expect(1);
        QUnit.async();

        var stream = new ResizeStream();
        var emitter = new EventEmitter();
        var emitSize = [0, 0];

        stream.subscribe(emitter);

        stream.on('resize', function(size) {
            assert.ok(size == emitSize);
            loop.stop();
            QUnit.start();
        });

        emitter.emit('resize', emitSize);
    });

    QUnit.test('merge', function(assert){
        expect(3);
        QUnit.async();

        var size1 = new EventEmitter();
        var size2 = new EventEmitter();
        var size3 = new EventEmitter();

        var stream = ResizeStream.merge({
            size1 : size1,
            size2 : size2,
            size3 : size3
        });

        stream.on('resize', function(mergedData) {
            assert.ok(mergedData.size1 === true);
            assert.ok(mergedData.size2 === 4);
            assert.ok(mergedData.size3 === undefined);
            loop.stop();
            QUnit.start();
        });

        size1.emit('resize', true);
        size2.emit('resize', 4);
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
        var stream = ResizeStream.lift(function() {
            timesFired++;
            var sum = 0;
            for (var i = 0; i < N; i++) {
                assert.deepEqual(arguments[i], [i, i]);
                sum += i;
            }

            assert.ok(timesFired == 1);
            return sum;
        }, emitters);

        stream.on('resize', function(sum) {
            assert.ok(sum == N * (N - 1) / 2);
            loop.stop();
            QUnit.start();
        });

        for (var i = 0; i < N; i++)
            emitters[i].emit('resize', [i, i]);
    });

});