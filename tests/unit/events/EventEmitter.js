define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');
    var EventEmitter = require('samsara/Events/EventEmitter');

    registerSuite({
        name : 'EventEmitter',
        on: function () {
            var emitter = new EventEmitter();

            var payload = {};

            emitter.on('test', function(data){
               assert.equal(data, payload);
            });

            emitter.emit('test', payload);
        },
        off : function () {
            var emitter = new EventEmitter();

            var handler = function (){
                assert.isTrue(false);
            };

            emitter.on('test', handler);
            emitter.off('test', handler);

            emitter.emit('test');
        },
        once: function () {
            var emitter = new EventEmitter();

            emitter.once('once', function (data) {
                assert.equal(data.state, true);
                emitter.emit('once', {state : false});
            });

            emitter.emit('once', {state : true});
        },
        bindThis: function (){
            var dummyThis = {};
            var emitter = new EventEmitter();

            emitter.bindThis(dummyThis);

            emitter.on('test', function(){
                assert.equal(this, dummyThis);
            });

            emitter.emit('test');
        }
    });
});