define(function(require){
    var Engine = require('samsara/core/Engine');
    var Stream = require('samsara/streams/Stream');
    var Transitionable = require('samsara/core/Transitionable');
    var Timer = require('samsara/core/Timer');

    QUnit.module('Raw');

    // QUnit.test('Subscribe two', function(assert){
    //     expect(0)
    //     Engine.start();

    //     var s = new Transitionable(0);
    //     var t = new Transitionable(0);

    //     var stream = new Stream();
    //     stream.subscribe(s);
    //     stream.subscribe(t);

    //     s.set(1, {duration : 500});
    //     t.set(1, {duration : 500});

    //     stream.on('start', function(value){
    //         console.log('start', value);
    //     });

    //     stream.on('update', function(value){
    //         console.log('update', value);
    //     });

    //     stream.on('end', function(value){
    //         console.log('end', value);
    //     });
    // });

    // QUnit.test('Subscribe stream chain', function(assert){
    //     expect(0)
    //     Engine.start();

    //     var s = new Transitionable(0);
    //     var t = new Transitionable(0);

    //     var stream1 = new Stream();
    //     var stream2 = new Stream();

    //     stream1.subscribe(s);
    //     stream1.subscribe(t);

    //     stream2.subscribe(stream1);

    //     s.set(1, {duration : 500});
    //     t.set(1, {duration : 500});

    //     stream2.on('start', function(value){
    //         console.log('start', value);
    //     });

    //     stream2.on('update', function(value){
    //         console.log('update', value);
    //     });

    //     stream2.on('end', function(value){
    //         console.log('end', value);
    //     });
    // });

    QUnit.test('Subscribe stream chain three', function(assert){
        expect(0)
        Engine.start();

        var s = new Transitionable(0);
        var t = new Transitionable(0);

        var stream1 = new Stream();
        var stream2 = new Stream();
        var stream3 = new Stream();
        var stream4 = new Stream();

        stream1.subscribe(s);

        stream2.subscribe(stream1);

        stream3.subscribe(stream2);
        stream3.subscribe(t);

        stream4.subscribe(stream3)

        s.set(1, {duration : 500});
        t.set(1, {duration : 500});

        stream4.on('start', function(value){
            console.log('start', value);
        });

        stream4.on('update', function(value){
            console.log('update', value);
        });

        stream4.on('end', function(value){
            console.log('end', value);
        });
    });

    // QUnit.test('Stream chain with immediate', function(assert){
    //     expect(0)
    //     Engine.start();

    //     var s = new Transitionable(0);
    //     var t = new Transitionable(0);

    //     var stream1 = new Stream();
    //     var stream2 = new Stream();

    //     stream1.subscribe(s);

    //     stream2.subscribe(stream1);
    //     stream2.subscribe(t);

    //     s.set(1, {duration : 500});

    //     Timer.setTimeout(function(){
    //         t.set(1, {duration : 500});
    //     }, 100)

    //     stream2.on('start', function(value){
    //         console.log('start', value);
    //     });

    //     stream2.on('update', function(value){
    //         console.log('update', value);
    //     });

    //     stream2.on('end', function(value){
    //         console.log('end', value);
    //     });
    // });

});