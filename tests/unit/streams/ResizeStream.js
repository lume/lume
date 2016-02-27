define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var loop = require('samsara/../tests/loop');

    var ResizeStream = require('samsara/streams/ResizeStream');
    var EventEmitter = require('samsara/events/EventEmitter');

    loop.start();

    registerSuite({
        name: 'ResizeStream',
        resize: function () {
            var stream = new ResizeStream();
            var emitter = new EventEmitter();
            var emitSize = [0,0];

            stream.subscribe(emitter);

            stream.on('resize', function (size) {
                assert.equal(size, emitSize);
                loop.stop();
            });

            emitter.emit('resize', emitSize);
        },
        merge: function(){
            var size1 = new EventEmitter();
            var size2 = new EventEmitter();
            var size3 = new EventEmitter();

            var stream = ResizeStream.merge({
                size1 : size1,
                size2 : size2,
                size3 : size3
            });

            stream.on('resize', function(mergedData){
                loop.stop();
            });

            size1.emit('resize', true);
            size2.emit('resize', 4);
        },
        lift: function(){
            var N = 5;

            var emitters = [];
            for (var i = 0; i < N; i++){
                var emitter = new EventEmitter();
                emitters.push(emitter);
            }

            var timesFired = 0;
            var stream = ResizeStream.lift(function(){
                timesFired++;
                var sum = 0;
                for (var i = 0; i < N; i++){
                    assert.deepEqual(arguments[i], [i, i]);
                    sum += i;
                }

                assert(timesFired == 1, 'Lifted stream batches incorrectly');
                return sum;
            }, emitters);

            stream.on('resize', function (sum) {
                assert(sum == N * (N-1) / 2, 'Lifted stream reduces incorrectly');
                loop.stop();
            });

            for (var i = 0; i < N; i++)
                 emitters[i].emit('resize', [i,i]);
        }
    });
});