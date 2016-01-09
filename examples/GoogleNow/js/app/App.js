define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var Surface = require('samsara/dom/Surface');
    var Stream = require('samsara/streams/Stream');

    var App = View.extend({
        defaults : {
            cardOffset : 5,
            cardPadding : 10
        },
        initialize: function (options) {
            this.springyTransition = new Transitionable(0);
            this.linearTransition = new Transitionable(0);
            this.toggle = false;

            this.addTopNav();
            this.addSearchBar();
            this.addStatusBar();
            this.addMountains();
            this.addGoogleLogo();
            this.addCards(options);
        },
        toggleAnimation : function(){
            var target = this.toggle ? 0 : 1;
            this.springyTransition.set(target, {curve: 'spring', period: 60, damping: 0.75});
            this.linearTransition.set(target, {duration: 200});
            this.toggle = !this.toggle;
        },
        addTopNav : function(){
            var topNav = new Surface({
                tagName: 'img',
                size: [undefined, true],
                classes: ['topNav'],
                attributes: {src: './assets/top.png'},
                opacity: this.springyTransition.map(function (value) {
                    return 1 - value;
                }),
                origin: this.springyTransition.map(function (value) {
                    return [0, value];
                })
            });

            this.add(topNav);
        },
        addSearchBar : function(){
            var search = new Surface({
                content: '<img class="mic" src="./assets/mic.png"/>',
                classes: ['searchBar'],
                proportions: [1, 1 / 10],
                origin: [.5, .5]
            });

            this.add({
                align: this.springyTransition.map(function (value) {
                    return [.5, .52 - value / 4];
                }),
                transform: this.linearTransition.map(function (value) {
                    return Transform.scaleX(.9 + value / 20);
                })
            }).add(search);
        },
        addStatusBar : function(){
            var statusBar = new Surface({
                tagName: 'img',
                size: [undefined, true],
                attributes: {src: './assets/status-bar.png'},
                classes: ['statusBar'],
                opacity: this.springyTransition
            });

            this.add(statusBar);
        },
        addMountains : function(){
            var mountains = new Surface({
                tagName: 'img',
                proportions: [1, 1 / 3],
                attributes: {src: './assets/background.png'},
                origin: [0.5, 0],
                opacity: this.springyTransition
            });

            this.add({
                align: [0.5, 0],
                transform: this.linearTransition.map(function (value) {
                    var scale = 1.1 - value / 10;
                    return Transform.scale([scale, scale]);
                })
            }).add(mountains);
        },
        addGoogleLogo : function(){
            var googleColor = new Surface({
                tagName: 'img',
                proportions: [false, .1],
                aspectRatio: 3,
                attributes: {src: './assets/google-color.png'},
                origin: [.5, .5],
                opacity: this.linearTransition.map(function (value) {
                    return 1 - value;
                })
            });

            var googleWhite = new Surface({
                tagName: 'img',
                proportions: [false, .1],
                aspectRatio: 3,
                attributes: {src: './assets/google-white.png'},
                origin: [.5, .5],
                opacity: this.linearTransition
            });

            var googleNode = this.add({
                align: this.springyTransition.map(function (value) {
                    return [.5, .38 - value / 4];
                }),
                transform: this.springyTransition.map(function (value) {
                    var scale = .25 * (1 - value) + .75;
                    return Transform.scale([scale, scale])
                })
            });

            googleNode.add(googleColor);
            googleNode.add(googleWhite);
        },
        addCards : function(options){
            var trafficCard = new Surface({
                tagName: 'img',
                proportions: [1, false],
                aspectRatio: 1 / 1.4,
                classes: ['card', 'traffic-card'],
                attributes: {src: './assets/traffic-card.png'},
                origin: [.5, 0]
            });

            var movieCard = new Surface({
                tagName: 'img',
                proportions: [1, false],
                aspectRatio: .58,
                attributes: {src: './assets/movie-card.png'},
                classes: ['card', 'movie-card'],
                origin: [.5, 0]
            });

            var timeContent = '' +
                '<div id="time-title">Wednesday, 12:13 am</div>' +
                '<div id="time-description">Time at home in Mountain View</div>';

            var timeCard = new Surface({
                content: timeContent,
                proportions: [1, false],
                aspectRatio: 1 / 5,
                classes: ['card', 'time-card'],
                origin: [.5, 0]
            });

            var trafficSizeOffset = Stream.lift(function (progress, trafficSize) {
                if (!trafficSize) return false;
                var offsetY = -options.cardOffset + progress * (trafficSize[1] + options.cardOffset + options.cardPadding);
                return Transform.thenMove(
                    Transform.scaleX(.975 + .025 * progress),
                    [0, offsetY, 0]
                );
            }, [this.linearTransition, trafficCard.size]);

            var trafficAndMovieSizeOffset = Stream.lift(function (progress, trafficSize, movieSize) {
                if (!trafficSize || !movieSize) return false;
                var offsetY = -2 * options.cardOffset + progress * (movieSize[1] + trafficSize[1] + 2 * (options.cardOffset + options.cardPadding));
                return Transform.thenMove(
                    Transform.scaleX(.95 + .05 * progress),
                    [0, offsetY, 0]
                );
            }, [this.linearTransition, trafficCard.size, movieCard.size]);

            var cardsNode = this.add({
                align: this.springyTransition.map(function (value) {
                    return [.5, .8 - value / 2.23];
                }),
                transform: this.linearTransition.map(function (value) {
                    return Transform.scaleX(.9 + value / 20);
                })
            });

            cardsNode.add(trafficCard);

            cardsNode
                .add({transform: trafficSizeOffset})
                .add(movieCard);

            cardsNode
                .add({transform: trafficAndMovieSizeOffset})
                .add(timeCard);
        }
    });

    module.exports = App;
});
