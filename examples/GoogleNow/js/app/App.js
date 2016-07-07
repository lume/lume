define(function (require, exports, module) {
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var Surface = require('samsara/dom/Surface');
    var Stream = require('samsara/streams/Stream');

    // Creates and lays out the `Surfaces` for the application.
    // Responsible for coordinating both physics and easing
    // animations to create a fun user interface transition.
    var App = View.extend({
        defaults : {
            springTransition : {
                curve: 'spring',
                period: 60,
                damping: 0.75
            },
            easingTransition : {
                curve : 'easeIn',
                duration : 200
            },
            cardOffset : 5,
            cardPadding : 10,
            imgURLs : {}
        },
        initialize: function (options) {
            // Define the `Transitionables` which will control the animation
            // One takes an easing curve, the other a spring
            this.easingTransition = new Transitionable(0);
            this.springTransition = new Transitionable(0);
            
            this.toggle = false; // Boolean indicating the state of the animation

            // Add all the elements to the render subtree
            this.addTopNav(options);
            this.addSearchBar(options);
            this.addStatusBar(options);
            this.addMountains(options);
            this.addGoogleLogo(options);
            this.addCards(options);
        },
        // Toggle the animation
        toggleAnimation : function(){
            var target = this.toggle ? 0 : 1;
            this.easingTransition.set(target, this.options.easingTransition);
            this.springTransition.set(target, this.options.springTransition);
            this.toggle = !this.toggle;
        },
        addTopNav : function(options){
            // The opacity goes from 1 to 0 with the easing animation
            var opacity = this.easingTransition.map(function (value) {
                return 1 - value;
            });

            // The origin point goes from top left to bottom left with the spring animation.
            // This has the effect of "raising" the `Surface`
            var origin = this.springTransition.map(function (value) {
                return [0, value];
            });

            var topNav = new Surface({
                tagName: 'img',
                size: [undefined, true],
                classes: ['topNav'],
                attributes: {src: options.imgURLs.topNav},
                opacity: opacity,
                origin: origin
            });

            this.add(topNav);
        },
        // The search bar will raise and scale slightly in the `x`-direction as the animation progresses
        addSearchBar : function(options){
            var search = new Surface({
                content: '<img class="mic" src="' + options.imgURLs.mic + '"/>',
                classes: ['searchBar'],
                proportions: [1, 1 / 10],
                origin: [.5, .5]
            });

            this.add({
                align: this.springTransition.map(function (value) {
                    return [.5, .52 - value / 4];
                }),
                transform: this.easingTransition.map(function (value) {
                    return Transform.scaleX(.9 + value / 20);
                })
            }).add(search);
        },
        addStatusBar : function(options){
            // The opacity of the status bar begins at 0, and becomes visible with the easing animation.
            var statusBar = new Surface({
                tagName: 'img',
                size: [false, true],
                proportions: [1, false],
                attributes: {src: options.imgURLs.statusBar},
                classes: ['statusBar'],
                opacity: this.easingTransition
            });

            this.add(statusBar);
        },
        addMountains : function(options){
            // The mountain `Surface` begins slightly scaled in `x`, and shrinks
            // with the easing animation.
            // We align it so that it is centered and scales from the center.
            var mountains = new Surface({
                tagName: 'img',
                proportions: [1, 1 / 3],
                attributes: {src: options.imgURLs.mountains},
                origin: [0.5, 0],
                opacity: this.springTransition
            });

            this.add({
                align: [0.5, 0],
                transform: this.easingTransition.map(function (value) {
                    var scale = 1.1 - value / 10;
                    return Transform.scale([scale, scale]);
                })
            }).add(mountains);
        },
        addGoogleLogo : function(options){
            // We define the Google logos so that they remain the same
            // aspect ratio even when rescaled. We then cross fade between
            // a colored, and white version as the animation progresses. This
            // gives the effect that it is changing colors.
            var googleColor = new Surface({
                tagName: 'img',
                proportions: [.3, .1],
                attributes: {src: options.imgURLs.googleColor},
                origin: [.5, .5],
                opacity: this.easingTransition.map(function (value) {
                    return 1 - value;
                })
            });

            var googleWhite = new Surface({
                tagName: 'img',
                proportions : [.3, .1],
                attributes : {src : options.imgURLs.googleWhite},
                origin: [.5, .5],
                opacity: this.easingTransition
            });

            // Since both logo versions are moved together, we create one
            // node for the movement and add both surfaces to it.
            var googleNode = this.add({
                align: this.springTransition.map(function (value) {
                    return [.5, .4 - value / 4];
                }),
                transform: this.springTransition.map(function (value) {
                    var scale = .25 * (1 - value) + .75;
                    return Transform.scale([scale, scale])
                })
            });

            googleNode.add(googleColor);
            googleNode.add(googleWhite);
        },
        // We create three cards that are originally stacked. When the animation begins
        // they unstack and are placed sequentially below one another. They also scale
        // slightly in the x-direction.
        addCards : function(options){
            var trafficCard = new Surface({
                tagName: 'img',
                size: function(parentSize){
                    return [parentSize[0], .72 * parentSize[0]];
                },
                classes: ['card', 'traffic-card'],
                attributes : {src : options.imgURLs.trafficCard},
                origin: [.5, 0]
            });

            var movieCard = new Surface({
                tagName: 'img',
                size : function(parentSize){
                    return [parentSize[0], .58 * parentSize[0]];
                },
                attributes : {src : options.imgURLs.movieCard},
                classes: ['card', 'movie-card'],
                origin: [.5, 0]
            });

            var timeContent = '' +
                '<div id="time-title">Wednesday, 12:13 am</div>' +
                '<div id="time-description">Time at home in Mountain View</div>';

            var timeCard = new Surface({
                content: timeContent,
                size : function(parentSize){
                    return [parentSize[0], .2 * parentSize[0]];
                },
                classes: ['card', 'time-card'],
                origin: [.5, 0]
            });

            // The Movie card is the second card. To make sure it is placed beneath the
            // Traffic card, we create a `Stream` that takes the size of the Traffic card
            // and the progress of the easing transition as sources. It is necessary to take the
            // Traffic card as a source because it can resize if the `window` is resized. By
            // taking the Traffic card's size into account, the Movie card is always in the right
            // place, even when the `window` resizes.
            var trafficSizeOffset = Stream.lift(function (progress, trafficSize) {
                if (!trafficSize) return false;
                var offsetY = -options.cardOffset + progress * (trafficSize[1] + options.cardOffset + options.cardPadding);
                return Transform.thenMove(
                    Transform.scaleX(.975 + .025 * progress),
                    [0, offsetY, 0]
                );
            }, [this.easingTransition, trafficCard.size]);

            // Similarly, the Time card must be placed below both the Traffic and Movie cards.
            // This Stream takes three sources: the sizes of the Traffic and Movie cards, and the
            // animation's progress.
            var trafficAndMovieSizeOffset = Stream.lift(function (progress, trafficSize, movieSize) {
                if (!trafficSize || !movieSize) return false;
                var offsetY = -2 * options.cardOffset + progress * (movieSize[1] + trafficSize[1] + 2 * (options.cardOffset + options.cardPadding));
                return Transform.thenMove(
                    Transform.scaleX(.95 + .05 * progress),
                    [0, offsetY, 0]
                );
            }, [this.easingTransition, trafficCard.size, movieCard.size]);

            // Since all the cards follow the top card upwards with the animation, we create a
            // single node that moves all the cards in unison.
            var cardsNode = this.add({
                align: this.springTransition.map(function (value) {
                    return [.5, .8 - value / 2.23];
                }),
                transform: this.easingTransition.map(function (value) {
                    return Transform.scaleX(.9 + value / 20);
                })
            });

            // Add the Traffic Card
            cardsNode.add(trafficCard);

            // Add the Movie card, accounting for the shift when the animation begins
            cardsNode
                .add({transform: trafficSizeOffset})
                .add(movieCard);

            // Add the Time card, accounting for the shift when the animation begins
            cardsNode
                .add({transform: trafficAndMovieSizeOffset})
                .add(timeCard);
        }
    });

    module.exports = App;
});
