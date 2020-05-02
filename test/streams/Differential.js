define(function(require){
    var loop = require('loop');
    var Differential = require('samsara/streams/Differential');
    var Transitionable = require('samsara/core/Transitionable');

    loop.start();

    QUnit.module('Differential');

    var differential = new Differential();

    var t = new Transitionable([0,0]);
    differential.subscribe(t);

    QUnit.test('immediate', function(assert){
        expect(1);
        var done = assert.async();

        differential.on('set', function(){
            assert.ok(true);
            loop.stop();
            done();
        });

        t.set([1,1], false);
    });
});