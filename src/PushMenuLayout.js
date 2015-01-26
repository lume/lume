/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import jss from 'jss';

import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';
import TouchSync from 'famous/inputs/TouchSync';
import GenericSync from 'famous/inputs/GenericSync';

import Plane from './Plane';
import Molecule from './Molecule';

import callAfter from 'army-knife/callAfter';

export class PushMenuLayout extends Molecule {
    constructor(options) {
        super(options);

        // Specify the types of input you want to use with Famo.us
        GenericSync.register({
            touch: TouchSync
        });

        // TODO: Handle options
        this.menuSide = 'left'; // left or right
        this.menuWidth = 200;
        this.menuHintSize = 10; // the amount of the menu that is visible before opening the menu.
        this.pushAreaWidth = 20; // the area on the screen edge that the user can touch and drag to push out the menu.
        this.animationDuration = 1000;
        this.animationType = 'moveBack';
        this.fade = true; // when content recedes, it fades to dark.
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

        this.createComponents();
        this.initializeEvents();
    }

    createComponents() {
        var layout = this;

        this.touchSync = new GenericSync(['touch']);

        this.alignment = (this.menuSide == "left"? 0: 1);
        this.animationTransition = new Transitionable(0);
        window.animationTransition = this.animationTransition;

        this.mainMol = new Molecule();

        this.menuMol = new Molecule({
            size: [this.menuWidth,undefined]
        });
        this.menuMol.oldTransform = this.menuMol.transform;
        this.menuMol.transform = function() { // override
            var currentPosition = layout.animationTransition.get();
            switch(layout.animationType) {
                case "foldDown":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.menuSide == 'left'?
                            currentPosition *  (layout.menuWidth-layout.menuHintSize)/*range*/ - (layout.menuWidth-layout.menuHintSize)/*offset*/:
                            currentPosition * -(layout.menuWidth-layout.menuHintSize)/*range*/ + (layout.menuWidth-layout.menuHintSize)/*offset*/
                    );
                    break;
                case "moveBack":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.menuSide == 'left'?
                            currentPosition *  (layout.menuWidth-layout.menuHintSize)/*range*/ - (layout.menuWidth-layout.menuHintSize)/*offset*/:
                            currentPosition * -(layout.menuWidth-layout.menuHintSize)/*range*/ + (layout.menuWidth-layout.menuHintSize)/*offset*/
                    );
                    break;
            }
            return this.oldTransform.get();
        }.bind(this.menuMol);

        this.contentMol = new Molecule({
            size: [this.contentWidth,undefined]
        });
        this.contentMol.oldTransform = this.contentMol.transform;
        this.contentMol.transform = function() { // override
            var currentPosition = layout.animationTransition.get();
            switch(layout.animationType) {
                case "foldDown":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.menuSide == 'left'?
                            currentPosition *  (layout.menuWidth - layout.menuHintSize)/*range*/ + layout.menuHintSize/*offset*/:
                            currentPosition * -(layout.menuWidth - layout.menuHintSize)/*range*/ - layout.menuHintSize/*offset*/
                    );
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setRotateY(
                        layout.menuSide == 'left'?
                            currentPosition *  Math.PI/8:
                            currentPosition * -Math.PI/8
                    );
                    break;
                case "moveBack":
                    var depth = 100;
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.menuSide == 'left'?
                            layout.menuHintSize:
                            -layout.menuHintSize
                    );
                    this.oldTransform.setTranslateZ(
                        currentPosition * -depth
                    );
                    break;
            }
            return this.oldTransform.get();
        }.bind(this.contentMol);

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

        // align the menu and content areas
        //if (this.menuSide == 'left') {
            //this.contentMol.transform.setTranslateX(this.menuHintSize);
            //this.menuMol.transform.setTranslateX(-this.menuWidth+this.menuHintSize);
        //}
        //else {
            //this.contentMol.transform.setTranslateX(-this.menuHintSize);
            //this.menuMol.transform.setTranslateX(this.menuWidth-this.menuHintSize);
        //}

        /*
         * Styles for the fadePlane
         */
        // TODO: move this somewhere else . it's specific for each animation
        this.updateStyles = function() {
            switch(this.animationType) {
                case "foldDown":
                    this.fadeStartColor = 'rgba(0,0,0,0.3)';
                    this.fadeEndColor = 'rgba(0,0,0,0.8)';
                    break;
                case "moveBack":
                    this.fadeStartColor = 'rgba(0,0,0,0.5)';
                    this.fadeEndColor = 'rgba(0,0,0,0.5)';
                    break;
            }
            var styles = {
                '.infamous-fadeLeft': {
                    background: [
                        this.fadeEndColor,
                        '-moz-linear-gradient(left, '+this.fadeEndColor+' 0%, '+this.fadeStartColor+' 100%)',
                        '-webkit-gradient(left top, right top, color-stop(0%, '+this.fadeEndColor+'), color-stop(100%, '+this.fadeStartColor+'))',
                        '-webkit-linear-gradient(left, '+this.fadeEndColor+' 0%, '+this.fadeStartColor+' 100%)',
                        '-o-linear-gradient(left, '+this.fadeEndColor+' 0%, '+this.fadeStartColor+' 100%)',
                        '-ms-linear-gradient(left, '+this.fadeEndColor+' 0%, '+this.fadeStartColor+' 100%)',
                        'linear-gradient(to right, '+this.fadeEndColor+' 0%, '+this.fadeStartColor+' 100%)'
                    ],
                    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#cc000000\', endColorstr=\'#4d000000\', GradientType=1 )'
                },
                '.infamous-fadeRight': {
                    background: [
                        this.fadeStartColor,
                        '-moz-linear-gradient(left, '+this.fadeStartColor+' 0%, '+this.fadeEndColor+' 100%)',
                        '-webkit-gradient(left top, right top, color-stop(0%, '+this.fadeStartColor+'), color-stop(100%, '+this.fadeEndColor+'))',
                        '-webkit-linear-gradient(left, '+this.fadeStartColor+' 0%, '+this.fadeEndColor+' 100%)',
                        '-o-linear-gradient(left, '+this.fadeStartColor+' 0%, '+this.fadeEndColor+' 100%)',
                        '-ms-linear-gradient(left, '+this.fadeStartColor+' 0%, '+this.fadeEndColor+' 100%)',
                        'linear-gradient(to right, '+this.fadeStartColor+' 0%, '+this.fadeEndColor+' 100%)'
                    ],
                    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#4d000000\', endColorstr=\'#cc000000\', GradientType=1 )'
                }
            };

            if (this.fadeStylesheet) { this.fadeStylesheet.detach(); }
            this.fadeStylesheet = jss.createStyleSheet(styles);
            this.fadeStylesheet.attach();
        };

        if (this.fade) {

            this.updateStyles();

            this.fadePlane = new Plane({
                size: [undefined,undefined],
                classes: [
                    // TODO: switch to jss namespace.
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
            this.fadePlane.setOptions({opacity: this.animationTransition});

            this.contentMol.add(this.fadePlane);
        }

        this.add(this.mainMol);
        this.mainMol.add(this.menuMol);
        this.mainMol.add(this.contentMol);
        this.menuMol.add(this.menuTouchPlane);
        // TODO: Also create and add a background plane for the menu area so it will catch events that might fall through the menu content.
    }

    initializeEvents() {

        // move the menu, following the user's drag. Don't let the user drag the menu past the menu width.
        this._.handler.on('update', function(event) { // update == drag
            this.isBeingDragged = true;

            // TODO: cancel callback if there is one.

            // stop current transitions if any, and don't cancel a callback if one exists (false).
            this.haltAnimation(false);

            var currentPosition = this.animationTransition.get();

            // TODO: handle the right-side menu.
            switch(this.animationType) {
                case "foldDown":
                    this.animationTransition.set(currentPosition + event.delta[0] / (this.menuWidth - this.menuHintSize));
                    break;
                case "moveBack":
                    this.animationTransition.set(currentPosition + event.delta[0] / (this.menuWidth - this.menuHintSize));
                    break;
            }

            currentPosition = this.animationTransition.get();

            if (currentPosition > 1) {
                this.animationTransition.set(1);
            }
            else if (currentPosition < 0) {
                this.animationTransition.set(0);
            }
        }.bind(this));

        this._.handler.on('end', function(event) {
            this.isBeingDragged = false;

            var currentPosition = this.animationTransition.get();

            if (currentPosition < 0.5) {
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

    openMenu(callback, cancelPreviousCallback) { // public
        this.haltAnimation(cancelPreviousCallback);

        this.isClosing = false;
        this.isOpening = true;

        this.animate('open', callback);
    }

    closeMenu(callback, cancelPreviousCallback) { // public
        this.haltAnimation(cancelPreviousCallback);

        this.isClosing = true;
        this.isOpening = false;

        this.animate('close', callback);
    }

    toggleMenu(callback, cancelPreviousCallback) { // public
        if (this.isOpen || this.isOpening) {
            this.closeMenu(callback, cancelPreviousCallback);
        }
        else if (!this.isOpen || this.isClosing) {
            this.openMenu(callback, cancelPreviousCallback);
        }
    }

    animate(targetState, callback) {
        this.isAnimating = true;
        this.transitionCallback = callback;
        var _callback;

        var self = this;
        function setupCallback(numberOfTransitions) {
            // Fire callback after numberOfTransitions calls, when the 4 transitions are complete.
            _callback = callAfter(numberOfTransitions, function() {
                self.isAnimating = self.isOpening = self.isClosing = false;
                self.isOpen = targetState == 'open'? true: false;
                if (typeof self.transitionCallback == 'function') {
                    self.transitionCallback();
                }
                self.transitionCallback = undefined;
            }.bind(self));
        }

        setupCallback(1);
        if (targetState == 'open') {
            this.animationTransition.set(1, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        }
        else if (targetState == 'close') {
            this.animationTransition.set(0, {duration: this.animationDuration, curve: Easing.outExpo}, _callback);
        }
    }

    haltAnimation(cancelPreviousCallback) {
        if (this.isAnimating) {
            if (!cancelPreviousCallback && typeof this.transitionCallback == 'function') {
                this.transitionCallback();
            }
            this.transitionCallback = undefined;
            this.animationTransition.halt();
        }
    }
}
export default PushMenuLayout;
