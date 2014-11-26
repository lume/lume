/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// Famo.us Modules
import Transform from 'famous/core/Transform';
import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';
import TouchSync from 'famous/inputs/TouchSync';
import GenericSync from 'famous/inputs/GenericSync';

import Plane from 'infamous/Plane';
import Molecule from 'infamous/Molecule';

// Specify the types of input you want to use with Famo.us
GenericSync.register({
    touch: TouchSync
});

function callAfter(times, callback) {
    var count = 0;
    return function() {
        if (++count == times) {
            if (typeof callback == 'function') {
                callback();
            }
        }
    };
}

export class PushMenuLayout extends Molecule {
    constructor(options) {
        super(options);

        // TODO: Handle options
        this.menuSide = 'left'; // left or right
        this.menuWidth = 200;
        this.menuHintSize = 10; // the amount of the menu that is visible before opening the menu.
        this.pushAreaWidth = 20; // the area on the screen edge that the user can touch and drag to push out the menu.
        this.animationDuration = 1000;
        this.fade = false; // when content recedes, it fades to dark.
        // TODO: ^ background color for whole layout will be the color the fade fades to.

        this.contentWidth = document.body.clientWidth - this.menuHintSize;
        // TODO: ^ contentWidth should be the width of whatever is containing the layout,
        // but we're just using it as a whole-page app for now. Get size from a
        // commit?

        this.isOpen = false;
        this.isOpening = false;
        this.isClosing = false;
        this.isAnimating = false; // keep track of whether the menu is opening or closing.
        this.isBeingDragged = false; // whether the user is dragging/pushing the menu or not.
        this.transitionCallback = undefined; // holds the callback to the current open or close menu animation.

        this.touchSync = new GenericSync(['touch']);

        this.alignment = (this.menuSide == "left"? 0: 1);
        this.opacityTransition = new Transitionable(0);

        this.mainMol = new Molecule();

        this.menuMol = new Molecule({
            size: [this.menuWidth,undefined],
        });
        this.contentMol = new Molecule({
            size: [this.contentWidth,undefined],
        });

        this.menuTouchPlane = new Plane({
            size: [this.menuWidth + this.pushAreaWidth - this.menuHintSize, undefined],
            properties: {
                zIndex: '-1000' // below everything
            }
        });

        this.mainMol.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });
        this.menuMol.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });
        this.contentMol.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });

        // FIXME: WHY THE EFF must I also set align and origin on menuTouchPlane
        // when I've already set it on it's parent (this.menuMol)?????
        this.menuTouchPlane.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });

        /*
         * Styles for the fadePlane
         */
        // TODO: Use jss here.
        if (this.fade) {
            var fadeStartColor = 'rgba(0,0,0,0.3)';
            var fadeEndColor = 'rgba(0,0,0,0.8)';
            var fadeStyle = '<style>'+
                '.infamous-fadeLeft {'+
                    'background: '+fadeEndColor+';'+
                    'background: -moz-linear-gradient(left, '+fadeEndColor+' 0%, '+fadeStartColor+' 100%);'+
                    'background: -webkit-gradient(left top, right top, color-stop(0%, '+fadeEndColor+'), color-stop(100%, '+fadeStartColor+'));'+
                    'background: -webkit-linear-gradient(left, '+fadeEndColor+' 0%, '+fadeStartColor+' 100%);'+
                    'background: -o-linear-gradient(left, '+fadeEndColor+' 0%, '+fadeStartColor+' 100%);'+
                    'background: -ms-linear-gradient(left, '+fadeEndColor+' 0%, '+fadeStartColor+' 100%);'+
                    'background: linear-gradient(to right, '+fadeEndColor+' 0%, '+fadeStartColor+' 100%);'+
                    'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#cc000000\', endColorstr=\'#4d000000\', GradientType=1 );'+
                '}'+
                '.infamous-fadeRight {'+
                    'background: '+fadeStartColor+';'+
                    'background: -moz-linear-gradient(left, '+fadeStartColor+' 0%, '+fadeEndColor+' 100%);'+
                    'background: -webkit-gradient(left top, right top, color-stop(0%, '+fadeStartColor+'), color-stop(100%, '+fadeEndColor+'));'+
                    'background: -webkit-linear-gradient(left, '+fadeStartColor+' 0%, '+fadeEndColor+' 100%);'+
                    'background: -o-linear-gradient(left, '+fadeStartColor+' 0%, '+fadeEndColor+' 100%);'+
                    'background: -ms-linear-gradient(left, '+fadeStartColor+' 0%, '+fadeEndColor+' 100%);'+
                    'background: linear-gradient(to right, '+fadeStartColor+' 0%, '+fadeEndColor+' 100%);'+
                    'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#4d000000\', endColorstr=\'#cc000000\', GradientType=1 );'+
                '}'+
            '</style>';
            var div = document.createElement('div');
            div.innerHTML = fadeStyle;
            fadeStyle = div.firstChild;
            document.head.appendChild(fadeStyle);

            this.fadePlane = new Plane({
                size: [undefined,undefined],
                classes: [
                    (this.menuSide == 'left'? 'infamous-fadeRight': 'infamous-fadeLeft')
                ],
                properties: {
                    zIndex: '1000',
                    pointerEvents: 'none'
                }
            });

            // FIXME: Why the EFF must I also set align and origin on fadePlane when
            // I've already set it on it's parent (this.contentMol)?????
            this.fadePlane.setOptions({
                origin: [this.alignment, 0.5],
                align: [this.alignment, 0.5]
            });
            this.fadePlane.transform.setTranslateZ(-0.0001);
            this.fadePlane.setOptions({opacity: this.opacityTransition});

            this.contentMol.add(this.fadePlane);
        }

        this.add(this.mainMol);

        this.mainMol.add(this.menuMol);
        this.mainMol.add(this.contentMol);

        this.menuMol.add(this.menuTouchPlane);
        // TODO: Also create and add a background plane for the menu area so it will catch events that might fall through the menu content.

        // align the menu and content areas
        if (this.menuSide == 'left') {
            this.contentMol.transform.setTranslateX(this.menuHintSize);
            this.menuMol.transform.setTranslateX(-this.menuWidth+this.menuHintSize);
        }
        else {
            this.contentMol.transform.setTranslateX(-this.menuHintSize);
            this.menuMol.transform.setTranslateX(this.menuWidth-this.menuHintSize);
        }

        // TODO: combine closeMenu/openMenu with this code by instead animating a transitionable between 0 and 1 for the animation state.
        this._.handler.on('update', function(event) { // update == drag
            this.isBeingDragged = true;

            // TODO: cancel callback if there is one.

            // stop current transitions if any.
            if (this.contentMol.transform.isActive()) { this.contentMol.transform.halt(); }
            if (this.menuMol.transform.isActive()) { this.menuMol.transform.halt(); }

            // user-specified
            if (this.opacityTransition.isActive()) { this.opacityTransition.halt(); }

            var menuMolTranslate = Transform.getTranslate(this.menuMol.transform.get());
            var contentMolTranslate = Transform.getTranslate(this.contentMol.transform.get());

            // move the menu, following the user's drag. Don't let the user drag the menu past the menu width.
            // TODO: handle the right-side menu.
            this.contentMol.transform.setTranslateX(contentMolTranslate[0] + event.delta[0]);
            this.menuMol.transform.setTranslateX(menuMolTranslate[0] + event.delta[0]);
            if (menuMolTranslate[0] > 0) {
                this.menuMol.transform.setTranslateX(0);
                this.contentMol.transform.setTranslateX(this.menuWidth);
            }
            else if (menuMolTranslate[0] < -this.menuWidth + this.menuHintSize) {
                this.menuMol.transform.setTranslateX(-this.menuWidth + this.menuHintSize);
                this.contentMol.transform.setTranslateX(0+this.menuHintSize);
            }
            this.contentMol.transform.setRotateY( (Math.PI/8) * (this.menuWidth + menuMolTranslate[0]) / this.menuWidth );

            // user-specified
            this.opacityTransition.set((this.menuWidth + menuMolTranslate[0]) / this.menuWidth);
        }.bind(this));

        this._.handler.on('end', function(event) {
            this.isBeingDragged = false;

            var menuMolTranslate = Transform.getTranslate(this.menuMol.transform.get());

            if (menuMolTranslate[0] < (-this.menuWidth+this.menuHintSize)/2) {
                this.closeMenu();
            }
            else {
                this.openMenu();
            }
        }.bind(this));

        window.addEventListener('resize', function(event) {
            this.contentWidth = document.body.clientWidth - this.menuHintSize; // TODO: use case where the layout isn't specifically in the body.
            this.contentMol.setOptions({size: [this.contentWidth, undefined]});
        }.bind(this));

        /*
         * Wire up events
         */
        this.menuTouchPlane.pipe(this.touchSync);
        this.touchSync.pipe(this._.handler);
    }

    // TODO: replace menu easing with physics so the user can throw the menu,
    // using initial velocity and drag to slow it down, and stop immediately
    // when it hit the limit.

    openMenu(callback, cancelPreviousCallback) {
        if (this.isAnimating) {
            if (!cancelPreviousCallback && typeof this.transitionCallback == 'function') {
                this.transitionCallback();
            }
            this.transitionCallback = undefined;
            this.contentMol.transform.halt();
            this.menuMol.transform.halt();
            this.opacityTransition.halt();
        }

        this.isClosing = false;
        this.isOpening = true;
        this.isAnimating = true;
        this.transitionCallback = callback;

        // Fire callback after 4 calls, when the 4 transitions are complete.
        var _callback = callAfter(4, function() {
            this.isAnimating = this.isOpening = this.isClosing = false;
            this.isOpen = true;
            if (typeof this.transitionCallback == 'function') {
                this.transitionCallback();
            }
            this.transitionCallback = undefined;
        }.bind(this));

        // XXX: this is depending on my modifications for TransitionableTransform.
        this.contentMol.transform.setTranslateX((this.menuSide == 'left'? 1: -1)*this.menuWidth, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        this.menuMol.transform.setTranslateX(0, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        this.contentMol.transform.setRotateY((this.menuSide == 'left'? 1: -1)*Math.PI/8, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        this.opacityTransition.set(1, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
    }

    closeMenu(callback, cancelPreviousCallback) {
        if (this.isAnimating) {
            if (!cancelPreviousCallback && typeof this.transitionCallback == 'function') {
                this.transitionCallback();
            }
            this.transitionCallback = undefined;
            this.contentMol.transform.halt();
            this.menuMol.transform.halt();
            this.opacityTransition.halt();
        }

        this.isClosing = true;
        this.isOpening = false;
        this.isAnimating = true;
        this.transitionCallback = callback;

        // Fire callback after 4 calls, when the 4 transitions are complete.
        var _callback = callAfter(4, function() {
            this.isAnimating = this.isOpening = this.isClosing = false;
            this.isOpen = false;
            if (typeof this.transitionCallback == 'function') {
                this.transitionCallback();
            }
            this.transitionCallback = undefined;
        }.bind(this));

        // XXX: this is depending on my modifications for TransitionableTransform.
        this.contentMol.transform.setTranslateX((this.menuSide == 'left'? 1: -1)*this.menuHintSize, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        this.menuMol.transform.setTranslateX((this.menuSide == 'left'? -this.menuWidth+this.menuHintSize: +this.menuWidth-this.menuHintSize), {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        this.contentMol.transform.setRotateY(0, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        this.opacityTransition.set(0, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
    }

    toggleMenu(callback) {
        if (this.isOpen || this.isOpening) { this.closeMenu(callback); }
        else { this.openMenu(callback); }
    }
}
export default PushMenuLayout;
