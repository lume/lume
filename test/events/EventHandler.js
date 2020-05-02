define(function(require){
    var EventHandler = require('samsara/events/EventHandler');

    QUnit.module('EventHandler');

    QUnit.test('Subscribe', function(assert){
        var A = new EventHandler();
        var B = new EventHandler();

        B.on('foo', function(data){
           assert.equal(data, 0);
        });

        B.subscribe(A);

        A.emit('foo', 0);
    });

    QUnit.test('Unsubscribe', function(assert){
        var A = new EventHandler();
        var B = new EventHandler();

        B.on('foo', function(data){
            assert.notEqual(data, 0);
        });

        B.subscribe(A);

        A.emit('foo', 1);

        B.unsubscribe(A);

        A.emit('foo', 0);
    });

    QUnit.test('Unsubscribe upstream', function(assert){
        var A = new EventHandler();
        var B = new EventHandler();
        var C = new EventHandler();

        C.subscribe(B);
        B.subscribe(A);

        C.on('foo', function(data){
            assert.notEqual(data, 0);
        });

        A.emit('foo', 1);

        C.unsubscribe(B);

        A.emit('foo', 0);
    });

    QUnit.test('Off', function(assert){
        var A = new EventHandler();
        var B = new EventHandler();

        function handler (data){
            assert.notEqual(data, 0);
        }

        B.on('foo', handler);

        B.subscribe(A);

        A.emit('foo', 1);

        B.off('foo', handler);

        A.emit('foo', 0);
    });

    QUnit.test('Off Upstream', function(assert){
        var A = new EventHandler();
        var B = new EventHandler();
        var C = new EventHandler();

        B.subscribe(A);
        C.subscribe(B);

        var handler = function(data){
            assert.notEqual(data, 0);
        };

        C.on('foo', handler);

        A.emit('foo', 1);

        B.off('foo');

        A.emit('foo', 0);
    });

    QUnit.test('On Upstream', function(assert){
        var A = new EventHandler();
        var B = new EventHandler();
        var C = new EventHandler();

        B.subscribe(A);
        C.subscribe(B);

        C.on('bar', function(data){
            assert.equal(data, 0);
        });

        A.emit('bar', 0);
    });

});