define(function (require) {
    var EventEmitter = require('samsara/events/EventEmitter');

    QUnit.module('EventEmitter');

    QUnit.test('On', function(assert) {
        var emitter = new EventEmitter();

        var payload = {};

        emitter.on('test', function(data) {
            assert.equal(data, payload);
        });

        emitter.emit('test', payload);
    });

    QUnit.test('Off', function(assert) {
        var emitter = new EventEmitter();

        var handler = function() {
            assert.ok(false);
        };

        emitter.on('test', handler);
        emitter.off('test', handler);

        emitter.emit('test');

        expect(0);
    });

    QUnit.test('Once', function(assert) {
        var emitter = new EventEmitter();

        emitter.once('once', function(data) {
            assert.equal(data.state, true);
            emitter.emit('once', {state : false});
        });

        emitter.emit('once', {state : true});
    });

    QUnit.test('bindThis', function(assert) {
        var dummyThis = {};
        var emitter = new EventEmitter();

        emitter.bindThis(dummyThis);

        emitter.on('test', function() {
            assert.equal(this, dummyThis);
        });

        emitter.emit('test');
    });

});