/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var tick = require('../core/tick');
    var StreamInput = require('../streams/_StreamInput');
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

    function Stream(triggers){
        triggers = triggers || {};

        this._input = new StreamInput();
        this._output = new StreamOutput();
        this._numSources = 0;

        createComplexStrategy.call(this, triggers);
    }

    function createSimpleStrategy(triggers){
        this._input.off(['start', 'update', 'end', 'set', 'lock', 'unlock']);
        this._output.subscribe(this._input);
    }

    function createComplexStrategy(triggers){
        var startCounter = 0;
        this.locked = false;
        this.lockedCounter = 0;
        var self = this;

        var states = {
            set: false,
            start : false,
            update : false,
            end : false,
            prev : ''
        };

        var resolve = function (data){
            hasReceivedEvent = false;

            if (hasSentLock){
                this.emit('unlock', this);
                hasSentLock = false;
            }

            if (startCounter === 0 && states.update && states.end){
                // update and end called in the same tick when tick should end
                this._output.emit(EVENTS.UPDATE, data);
                states.prev = EVENTS.UPDATE;
                states.update = false;
            }
            else if (states.prev !== EVENTS.UPDATE && states.start && states.update){
                // start and update called in the same tick when tick should start
                this._output.emit(EVENTS.START, data);
                states.prev = EVENTS.START;
                states.start = false;
            }

            if (states.update || (states.start && states.end)){
                // call update if updating or if both starting and stopping
                this._output.emit(EVENTS.UPDATE, data);
                states.prev = EVENTS.UPDATE;
            }
            else if (states.prev !== EVENTS.UPDATE && states.start && !states.end){
                // if (states.prev === EVENTS.START) console.log('crap start');
                // if (states.prev === EVENTS.UPDATE ) console.log('crap start 2')
                // call start if all have started
                this._output.emit(EVENTS.START, data);
                states.prev = EVENTS.START;
            }
            else if (states.prev !== EVENTS.START && startCounter === 0 && states.end && !states.start){
                // if (states.prev === EVENTS.END) console.log('crap end');
                // if (states.prev === EVENTS.START ) console.log('crap end 2')
                // call end if all have ended
                this._output.emit(EVENTS.END, data);
                states.prev = EVENTS.END;
            }
            else if (states.prev !== EVENTS.UPDATE && states.set){
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
        }.bind(this));

        this._input.on(EVENTS.UPDATE, function(data){
            if (triggers.update) data = triggers.update(data);
            states.update = true;
            delay(data);
        }.bind(this));

        this._input.on(EVENTS.END, function(data){
            if (triggers.end) data = triggers.end(data);
            startCounter--;
            if (startCounter < 0) debugger
            states.end = true;
            delay(data);
        }.bind(this));

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
            self.locked = true;
            if (dep instanceof Stream) self.lockedCounter++;
            if (self.lockedCounter === 1) self._output.emit('lock', self);
        }

        function depUnlock(dep){
            if (dep instanceof Stream) self.lockedCounter--;
            if (self.lockedCounter === 0){
                self.locked = false;
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

            if (!this.locked && hasTicked){
                resolve.call(this, data);
            }
        }.bind(this);

        tick.on('tick', function(){
            hasTicked = true;
            if (!this.locked && hasReceivedEvent) {
                resolve.call(this, cache);
            }
        }.bind(this));

        tick.on('end tick', function(){
            hasTicked = false;
            // hasReceivedEvent = false;
        });
    }

    Stream.prototype = Object.create(SimpleStream.prototype);
    Stream.prototype.constructor = Stream;

    Stream.prototype.subscribe = function(source){
        var success = StreamInput.prototype.subscribe.apply(this._input, arguments);
        if (success) {
            // if (source.locked) {
            //     this.lockedCounter++;
            //     if (this.lockedCounter === 1){
            //         this.locked = true;
            //         this._output.emit('lock', this);
            //     }
            // }
            this._numSources++;
            // if (this._numSources === 2) createComplexStrategy.call(this);
            window.Promise.resolve().then(function(){
                this.trigger('lock', source);
            }.bind(this));
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

        var success = StreamInput.prototype.unsubscribe.apply(this._input, arguments);
        if (success) {
            // if (source.locked) {
            //     this.lockedCounter--;
            //     if (this.lockedCounter === 0){
            //         this.locked = false;
            //         this._output.emit('unlock', this);
            //     }
            // }
            window.Promise.resolve().then(function(){
                this.trigger('lock', source);
            }.bind(this));

            this._numSources--;
            // if (this._numSources === 1) createSimpleStrategy.call(this);
        }

        return success;
    };

    Stream.prototype.trigger = function(){
        return StreamInput.prototype.trigger.apply(this._input, arguments);
    };

    Stream.prototype.emit = function(){
        return StreamOutput.prototype.emit.apply(this._output, arguments);
    };

    Stream.prototype.on = function(){
        return StreamOutput.prototype.on.apply(this._output, arguments);
    };

    Stream.prototype.off = function(){
        return StreamOutput.prototype.off.apply(this._output, arguments);
    };

    Stream.prototype.isActive = function(){
        return StreamOutput.prototype.isActive.apply(this._output, arguments);
    };

    Stream.prototype.get = function(){
        return StreamOutput.prototype.get.apply(this._output, arguments);
    };

    module.exports = Stream;
});
