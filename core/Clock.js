define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');

    var streams = [];
    var Clock = {};

    var eventInput = new EventHandler();
    var eventOutput = new EventHandler();

    var TIME_EVENTS = {
        PRERENDER : 'prerender',
        POSTRENDER : 'postrender'
    };

    var STREAM_EVENTS = {
        START : 'start',
        UPDATE : 'update',
        END : 'end'
    };

    eventInput.on('prerender', function(){
        for (var i = streams.length - 1; i >= 0; i--){
            streams[i].update();
        }
    }.bind(this));

    eventInput.on('start', function(data){
        var stream = data.stream;
        Clock.register(stream);
    }.bind(this));

    eventInput.on('end', function(data){
        var stream = data.stream;
        Clock.unregister(stream);
    }.bind(this));

    Clock.register = function(stream){
        streams.push(stream);
    };

    Clock.unregister = function(stream){
        var index = streams.indexOf(stream);
        streams.splice(index, 1);
    };

    Clock.subscribeEngine = function(engine){
        eventInput.subscribe(engine);
    };

    Clock.subscribe = function(stream){
        var mapper = new EventMapper(function(data){
            data.stream = stream;
            return data;
        });
        mapper.subscribe(stream);
        eventInput.subscribe(mapper)
    };

    Clock.unsubscribe = function(stream){
        //TODO
    };

    module.exports = Clock;
});