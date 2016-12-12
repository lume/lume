/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var tick = require('../core/tick');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var StreamOutput = require('../streams/_StreamContract');

    var EVENTS = {
        START : 'start',
        UPDATE : 'update',
        END : 'end',
        SET : 'set',
        LOCK : 'lock',
        UNLOCK : 'unlock'
    };

    /**
     * Stream listens to `start`, `update` and `end` events and
     *  emits `start`, `update` and `end` events.
     *
     *  If listening to multiple sources, Stream emits a single event per
     *  Engine cycle.
     *
     *  @example
     *
     *      var position = new Transitionable([0,0]);
     *      var size = new EventEmitter();
     *
     *      var translationStream = Stream.lift(function(position, size){
     *          var translation = [
     *              position[0] + size[0],
     *              position[1] + size[1]
     *          ];
     *
     *          return Transform.translate(translation);
     *      }, [positionStream, sizeStream]);
     *
     *      translationStream.on('start', function(transform){
     *          console.log(transform);
     *      });
     *
     *      translationStream.on('update', function(transform){
     *          console.log(transform);
     *      });
     *
     *      translationStream.on('end', function(transform){
     *          console.log(transform);
     *      });
     *
     *      position.set([100, 50], {duration : 500});
     *
     * @class Stream
     * @extends Streams.SimpleStream
     * @namespace Streams
     * @param [options] {Object}            Options
     * @param [options.set] {Function}      Custom logic to map the `set` event
     * @param [options.start] {Function}    Custom logic to map the `start` event
     * @param [options.update] {Function}   Custom logic to map the `update` event
     * @param [options.end] {Function}      Custom logic to map the `end` event
     * @constructor
     */

    var counter = 0;

    function Stream(triggers){
        triggers = triggers || {};

        this._input = new EventHandler();
        this._output = new StreamOutput();
        this.id = counter++;

        var count = 0;
        var str = '';
        var caller = arguments.callee.caller;
        while (caller.name && caller.name !== 'add' && count < 20){
            str += ' ' + caller.name;
            caller = caller.caller;
            count++;
        }

        createComplexStrategy.call(this, triggers);
    }

    function createSimpleStrategy(triggers){
        this._input.off(['start', 'update', 'end', 'set', 'lock', 'unlock']);
        this._output.subscribe(this._input);
    }

    function createComplexStrategy(triggers){
        var startCounter = 0;
        var locked = false;
        var lockedCounter = 0;
        var self = this;

        var states = {
            set: false,
            start : false,
            update : false,
            end : false,
            prev : ''
        };

        var resolve = function (data){
            if (hasSentLock){
                this.emit('unlock', this);
                hasSentLock = false;
            }

            // if (startCounter === 0 && states.update && states.end){
            //     // update and end called in the same tick when tick should end
            //     this._output.emit(EVENTS.UPDATE, data);
            //     states.prev = EVENTS.UPDATE;
            //     states.update = false;
            // }
            // else if (states.prev === EVENTS.START && states.set) {
            //     states.set = false;
            // }
            // else if (states.prev !== EVENTS.UPDATE && states.start && states.update){
            //     // start and update called in the same tick
            //     this._output.emit(EVENTS.START, data);
            //     states.prev = EVENTS.START;
            // }

            if (states.update || (states.start && states.end)){
                // call update if updating or if both starting and stopping
                this._output.emit(EVENTS.UPDATE, data);
                states.prev = EVENTS.UPDATE;
            }
            else if (states.prev !== EVENTS.UPDATE && states.start && !states.end){
                // if (states.prev === EVENTS.START) console.log('crap');
                // call start if all have started
                this._output.emit(EVENTS.START, data);
                states.prev = EVENTS.START;
            }
            else if (startCounter === 0 && states.prev !== EVENTS.START && states.end && !states.start){
                // if (states.prev === EVENTS.END) console.log('crap');
                // call end if all have ended
                this._output.emit(EVENTS.END, data);
                states.prev = EVENTS.END;
            }
            else if (states.prev !== EVENTS.UPDATE && states.set){
                // if (states.prev === EVENTS.SET) console.log('crap');
                this._output.emit(EVENTS.SET, data);
                states.prev = EVENTS.SET;
            }

            // reset
            states.start = false;
            states.update = false;
            states.end = false;
            states.set = false;
        }.bind(this);

        this._input.on(EVENTS.SET, function(data){
            if (triggers.set) data = triggers.set(data);
            states.set = true;
            delay(data);
        });

        this._input.on(EVENTS.START, function(data){
            if (triggers.start) data = triggers.start(data);
            states.start = true;
            startCounter++;
            delay(data);
        });

        this._input.on(EVENTS.UPDATE, function(data){
            if (triggers.update) data = triggers.update(data);
            states.update = true;
            delay(data);
        });

        this._input.on(EVENTS.END, function(data){
            if (triggers.end) data = triggers.end(data);
            states.end = true;
            startCounter--;
            delay(data);
        });

        this._input.on('subscribe', function(){
            this.emit('dep', this);
        }.bind(this));

        this._input.on('unsubscribe', function(){
            this.emit('undep', this);
        }.bind(this));

        this._input.on('dep', function(dep){
            dep.on('lock', depLock);
            dep.on('unlock', depUnlock);
        }.bind(this));

        this._input.on('undep', function(dep){
            dep.off('lock', depLock);
            dep.off('unlock', depUnlock);
        });

        function depLock(dep){
            locked = true;
            if (dep instanceof Stream) lockedCounter++;
            if (lockedCounter === 1) self._output.emit('lock', self);
        }

        function depUnlock(dep){
            if (dep instanceof Stream) lockedCounter--;
            if (lockedCounter === 0){
                locked = false;
                self._output.emit('unlock', self)
            }
        }

        var cache;
        var hasTicked = false;
        var hasSentLock = false;
        var hasReceivedEvent = false;
        var delay = function delay(data){
            hasReceivedEvent = true;
            cache = data;
            if (!hasSentLock){
                this._output.emit('lock', this);
                hasSentLock = true;
            }

            if (!locked && hasTicked){
                resolve.call(this, data);
            }
        }.bind(this);

        tick.on('tick', function(){
            hasTicked = true;
            if (!locked && hasReceivedEvent) {
                resolve.call(this, cache);
            }
        }.bind(this));

        tick.on('end tick', function(){
            hasTicked = false;
            hasReceivedEvent = false;
        });
    }

    Stream.prototype = Object.create(SimpleStream.prototype);
    Stream.prototype.constructor = Stream;

    Stream.prototype.subscribe = function(source){
        var success = EventHandler.prototype.subscribe.apply(this._input, arguments);
        if (success) {
            this._numSources++;
            // if (this._numSources === 2) createComplexStrategy.call(this);
            if (source.isActive && source.isActive()) {
                this.trigger('start', source.get());
            }
        }

        return success;
    };

    Stream.prototype.onSubscribe = true;

    Stream.prototype.unsubscribe = function(source){
            if (!source){
            for (var i = 0; i < this._input.upstream.length; i++){
                var source = this._input.upstream[i]
                this.unsubscribe(source)
            }
            return true;
        }

        var success = EventHandler.prototype.unsubscribe.apply(this._input, arguments);
        if (success) {
            if (source.isActive && source.isActive()) {
                this.trigger('end', source.get());
            }
            this._numSources--;
            // if (this._numSources === 1) createSimpleStrategy.call(this);
        }

        return success;
    };

    Stream.prototype.trigger = function(){
        return EventHandler.prototype.trigger.apply(this._input, arguments);
    };

    Stream.prototype.emit = function(){
        return EventHandler.prototype.emit.apply(this._output, arguments);
    };

    Stream.prototype.on = function(){
        return EventHandler.prototype.on.apply(this._output, arguments);
    };

    Stream.prototype.off = function(){
        return EventHandler.prototype.off.apply(this._output, arguments);
    };

    Stream.prototype.isActive = function(){
        return StreamOutput.prototype.isActive.apply(this._output, arguments);
    };

    Stream.prototype.get = function(){
        return StreamOutput.prototype.get.apply(this._output, arguments);
    };

    module.exports = Stream;
});
