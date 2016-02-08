/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import jss from './jss';

import Surface from 'famous/src/core/Surface';
import RenderNode from 'famous/src/core/RenderNode';
import Transitionable from 'famous/src/transitions/Transitionable';
import Easing from 'famous/src/transitions/Easing';
import TouchSync from 'famous/src/inputs/TouchSync';
import GenericSync from 'famous/src/inputs/GenericSync';

import Plane from './Plane';
import Molecule from './Molecule';
import {simpleExtend} from './utils'

import callAfter from 'army-knife/callAfter';

/**
 * A scenegraph with two Molecule leafnodes: the menu area and the content
 * area. The menu area is hidden beyond the edge of the screen while the
 * content area is visible. Swiping in from the edge of the screen reveals the
 * menu, putting the content area out of focus. A mouse can also be used, and
 * hovering near the edge of the screen also reveals the menu.
 *
 * Note: This layout is mostly useful if it exists at the root of a context so
 * that the menu is clipped when it is closed (off to the side), otherwise the
 * menu will be visible beyond the boundary of the container that contains the
 * PushMenuLayout.
 *
 * Note: If you've called `openMenu` or `closeMenu` with a callback, the callback
 * will be canceled if a drag or hover on the menu happens before the animation
 * has completed. Please open an issue on GitHub if you have any opinion
 * against this. :) Maybe we can add a boolean option for this behavior.
 *
 * TODO: Embed working example here.
 *
 * @class PushMenuLayout
 * @extends Molecule
 */
export class PushMenuLayout extends Molecule {

    /**
     * Creates a new PushMenuLayout.
     *
     * @constructor
     * @param {Object} options The options to instantiate a `PushMenuLayout` with.
     *
     * TODO v0.1.0: Handle `PushMenuLayout`-specific user options. Currently they
     * just get passed into super() for the Molecule constructor to handle.
     */
    constructor(initialOptions) {
        super(initialOptions);

        // Add default values for this PushMenuLayout
        // TODO: Make default options static for the class.
        simpleExtend(this._.defaultOptions, {
            menuSide: 'left', // left or right
            menuWidth: 200,
            menuHintSize: 10, // the amount of the menu that is visible before opening the menu.
            pushAreaWidth: 40, // the area on the screen edge that the user can touch and drag to push out the menu.
            animationDuration: 1000,
            animationType: 'foldDown', // options: foldDown moveBack

            // TODO: Background color for the whole layout should be the color that the fade fades to.
            // TODO: Replace fade star/end colors with a fog color value and intensity.
            fade: true, // when content recedes, it fades into the fog.
            fadeStartColor: 'rgba(255,255,255,0)',
            fadeEndColor: 'rgba(255,255,255,1)',

            blur: false, // XXX: WIP, so false by default.
            blurRadius: 5
        })

        // TODO: performance hit, this setter is invoked in the Molecule constructor, then here again.
        this.options = initialOptions

        // TODO v0.1.0: Mark these as private.
            // TODO v0.1.0: this.contentWidth should be the width of whatever is containing
            // the layout, but we're just using it as a whole-page app for now. Get
            // size from a commit? UPDATE: See the new famous/src/views/SizeAwareView
            this.contentWidth = document.body.clientWidth - this.options.menuHintSize;

            // Changing these values outside of an instance of PushMenuLayout might
            // cause the layout to break. They are designed to be modified
            // internally only.
            this.isOpen = false;
            this.isOpening = false;
            this.isClosing = false;
            this.isAnimating = false; // keep track of whether the menu is opening or closing.
            this.isBeingDragged = false; // whether the user is dragging/pushing the menu or not.
            this.transitionCallback = undefined; // holds the callback to the current open or close menu animation.

        // Set the touch sync for pulling/pushing the menu open/closed.
        GenericSync.register({
            touch: TouchSync
        });

        this._createComponents();
        this._initializeEvents();

        this.monkeyPatchNodeRenderMethod()
    }

    /**
     * See Molecule.setOptions
     *
     * @override
     */
    setOptions(newOptions) {
        super.setOptions(newOptions)
    }

    /**
     * See Molecule.resetOptions
     *
     * @override
     */
    resetOptions() {
        super.resetOptions()
    }

    /**
     * Creates the menu area, content area, `Plane` for the fade effect, etc.
     *
     * @private
     */
    _createComponents() {
        var layout = this;

        this.touchSync = new GenericSync(['touch']);

        this.alignment = (this.options.menuSide == "left"? 0: 1);
        this.animationTransition = new Transitionable(0);

        this.mainMol = new Molecule();

        this.menuMol = new Molecule({
            size: [this.options.menuWidth,undefined]
        });
        this.menuMol.oldTransform = this.menuMol.transform;
        this.menuMol.transform = function() { // override
            var currentPosition = layout.animationTransition.get();
            switch(layout.options.animationType) {
                case "foldDown":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            currentPosition *  (layout.options.menuWidth-layout.options.menuHintSize)/*range*/ - (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/:
                            currentPosition * -(layout.options.menuWidth-layout.options.menuHintSize)/*range*/ + (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/
                    );
                    break;
                case "moveBack":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            currentPosition *  (layout.options.menuWidth-layout.options.menuHintSize)/*range*/ - (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/:
                            currentPosition * -(layout.options.menuWidth-layout.options.menuHintSize)/*range*/ + (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/
                    );
                    break;
            }
            return this.oldTransform.get();
        }.bind(this.menuMol);

        // contains the user's menu content.
        this.menuContentMol = new Molecule();

        this.contentMol = new Molecule({
            size: [this.contentWidth,undefined]
        });
        this.contentMol.oldTransform = this.contentMol.transform;
        this.contentMol.transform = function() { // override
            var currentPosition = layout.animationTransition.get();
            switch(layout.options.animationType) {
                case "foldDown":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            currentPosition *  (layout.options.menuWidth - layout.options.menuHintSize)/*range*/ + layout.options.menuHintSize/*offset*/:
                            currentPosition * -(layout.options.menuWidth - layout.options.menuHintSize)/*range*/ - layout.options.menuHintSize/*offset*/
                    );
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setRotateY(
                        layout.options.menuSide == 'left'?
                            currentPosition *  Math.PI/8:
                            currentPosition * -Math.PI/8
                    );
                    break;
                case "moveBack":
                    var depth = 100;
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            layout.options.menuHintSize:
                            -layout.options.menuHintSize
                    );
                    this.oldTransform.setTranslateZ(
                        currentPosition * -depth
                    );
                    break;
            }
            return this.oldTransform.get();
        }.bind(this.contentMol);

        this.menuTouchPlane = new Plane({
            size: [this.options.menuWidth + this.options.pushAreaWidth - this.options.menuHintSize, undefined],
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
        // ^ I think that's a bug in Famous 0.3.x.
        this.menuTouchPlane.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });

        // Bring the menu content molecule and touch plane forward just
        // slightly so they're just above the content and content's fade plane,
        // so touch and mouse interaction works. HTML, the bad parts. ;)
        this.menuContentMol.transform.setTranslateZ(2);
        this.menuTouchPlane.transform.setTranslateZ(2);

        /*
         * Styles for the fadePlane
         */
        // TODO: move this somewhere else . it's specific for each animation
        this.updateStyles = function() {
            var startColor
            var endColor

            switch(this.options.animationType) {
                case "foldDown":
                    startColor = this.options.fadeStartColor
                    endColor = this.options.fadeEndColor
                    break;
                case "moveBack":
                    startColor = endColor = this.options.fadeEndColor
                    break;
            }

            var styles = {
                '.infamous-fadeLeft': {
                    background: [
                        endColor,
                        '-moz-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        '-webkit-gradient(left top, right top, color-stop(0%, '+endColor+'), color-stop(100%, '+startColor+'))',
                        '-webkit-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        '-o-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        '-ms-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        'linear-gradient(to right, '+endColor+' 0%, '+startColor+' 100%)'
                    ],
                    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#cc000000\', endColorstr=\'#4d000000\', GradientType=1 )'
                },
                '.infamous-fadeRight': {
                    background: [
                        startColor,
                        '-moz-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        '-webkit-gradient(left top, right top, color-stop(0%, '+startColor+'), color-stop(100%, '+endColor+'))',
                        '-webkit-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        '-o-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        '-ms-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        'linear-gradient(to right, '+startColor+' 0%, '+endColor+' 100%)'
                    ],
                    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#4d000000\', endColorstr=\'#cc000000\', GradientType=1 )'
                }
            };

            if (this.fadeStylesheet) { this.fadeStylesheet.detach(); }
            this.fadeStylesheet = jss.createStyleSheet(styles);
            this.fadeStylesheet.attach();
        };

        if (this.options.fade) {
            this.updateStyles();

            this.fadePlane = new Plane({
                size: [undefined,undefined],
                classes: [
                    // TODO: switch to jss namespaces.
                    (this.options.menuSide == 'left'? 'infamous-fadeRight': 'infamous-fadeLeft')
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

            // move the fadePlane forward by 1px so it doesn't glitch out.
            // Chrome will make the fadePlane and the surface in the content
            // area (if any) blink randomly when the two surfaces are in the
            // same exact position together.
            this.fadePlane.transform.setTranslateZ(1);

            this.fadePlane.setOptions({
                opacity: this.animationTransition
            });

            // TODO: Make fadePlane a sibling to menuMol and contentMol so that
            // contentMol contains only the user;s content. This will affect
            // the code in this.render().
            this.contentMol.node.add(this.fadePlane.node);
        }

        this.node.add(this.mainMol.node);
        this.mainMol.node.add(this.contentMol.node);
        this.menuMol.node.add(this.menuTouchPlane.node);
        this.menuMol.node.add(this.menuContentMol.node);
        this.mainMol.node.add(this.menuMol.node);
        // TODO: Also create and add a background plane for the menu area so it will catch events that might fall through the menu content.
    }

    /**
     * Sets up the events for the touch and mouse interaction that opens and
     * closes the menu.
     *
     * @private
     */
    _initializeEvents() {

        // move the menu, following the user's drag. Don't let the user drag the menu past the menu width.
        this.options.handler.on('update', function(event) { // update == drag
            this.isBeingDragged = true;

            // stop the current transitions if any, along with the current callback if any.
            this._haltAnimation(true);

            var currentPosition = this.animationTransition.get();

            // TODO: handle the right-side menu.
            switch(this.options.animationType) {
                case "foldDown":
                    this.animationTransition.set(currentPosition + event.delta[0] / (this.options.menuWidth - this.options.menuHintSize));
                    break;
                case "moveBack":
                    this.animationTransition.set(currentPosition + event.delta[0] / (this.options.menuWidth - this.options.menuHintSize));
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

        this.options.handler.on('end', function(event) {
            this.isBeingDragged = false;

            var currentPosition = this.animationTransition.get();

            if (currentPosition < 0.5) {
                this.closeMenu();
            }
            else {
                this.openMenu();
            }
        }.bind(this));

        // TODO v0.1.0: Use a SizeAwareView instead of relying on the body, since we
        // might not be directly in the body.
        window.addEventListener('resize', function(event) {
            this.contentWidth = document.body.clientWidth - this.options.menuHintSize;
            this.contentMol.setOptions({size: [this.contentWidth, undefined]});
        }.bind(this));

        /*
         * Wire up events
         * TODO: consolidate dup code here and in setMenu
         */
        this.menuTouchPlane.pipe(this.touchSync);
        this.menuTouchPlane.on('mouseenter', function() {
            if (!this.isOpening) {
                this.openMenu();
            }
        }.bind(this))
        this.menuTouchPlane.on('mouseleave', function() {
            if (!this.isClosing) {
                this.closeMenu();
            }
        }.bind(this))
        this.touchSync.pipe(this.options.handler);
    }

    /**
     * Add a scenegraph to the content area of the PushMenuLayout. You can put
     * anything you want into the content area (magical 3D things for example),
     * just be careful not to let them cover the menu or you'll block the user
     * from interacting with the menu.
     *
     * @param {module: famous/src/core/RenderNode} node A scenegraph, i.e. a
     * RenderNode with stuff in it.
     *
     * TODO: Accept plain renderables, f.e. Surfaces, etc. This change requires
     * also modifying the code in this.render() to account for renderables.
     *
     * TODO: Make a sibling method to reset the content area.
     */
    setContent(content) {
        if (content instanceof Molecule) {
            this.contentMol.node.add(content.node)
        }
        else if (content instanceof RenderNode) {
            this.contentMol.node.add(content)
        }
    }

    /**
     * Add a scenegraph to the menu area of the PushMenuLayout. If the object
     * that you pass into setMenu is an infamous component, or a famo.us
     * Surface, then it's events will be piped to this PushMenuLayout's input
     * sync so that the user can open and close the menu with touch or mouse.
     * General advice here would be to keep whatever you put into the menu
     * contained within the boundaries of the menu or you might have touch and
     * mouse interaction outside of the menu.
     *
     * @param {module: famous/src/core/RenderNode} node A scenegraph, i.e. a
     * RenderNode with stuff in it.
     *
     * TODO: Accept plain renderables, f.e. Surfaces, etc.
     *
     * TODO: Remove old content before adding new content.
     */
    setMenu(content) {
        if (content instanceof Molecule) {
            this.menuContentMol.node.add(content.node)

            content.pipe(this.touchSync)
            content.on('mouseenter', function() {
                if (!this.isOpening) {
                    this.openMenu();
                }
            }.bind(this))
            content.on('mouseleave', function() {
                if (!this.isClosing) {
                    this.closeMenu();
                }
            }.bind(this))
        }
        else if (content instanceof RenderNode) {
            this.menuContentMol.node.add(content)
        }
    }

    // TODO: replace menu easing with physics so the user can throw the menu,
    // using initial velocity and drag to slow it down, and stop immediately
    // when it hits the fully-open or fully-closed positions.

    /**
     * Opens the menu.
     *
     * @param {Function} callback The function to be called when the animation finishes.
     * @param {boolean} [cancelPreviousCallback=false] This is optional. If
     * true, then the callback of a previous open or close animation will be
     * canceled if that animation was still inprogress when this method is
     * called, otherwise the callback of the previous open or close animation
     * will be fired immediately before the animation for this animation begins.
     */
    openMenu(callback, cancelPreviousCallback) {
        this._haltAnimation(cancelPreviousCallback);

        this.isClosing = false;
        this.isOpening = true;

        this._animate('open', callback);
    }

    /**
     * Closes the menu.
     *
     * @param {Function} callback The function to be called when the animation finishes.
     * @param {boolean} [cancelPreviousCallback=false] This is optional. If
     * true, then the callback of a previous open or close animation will be
     * canceled if that animation was still inprogress when this method is
     * called, otherwise the callback of the previous open or close animation
     * will be fired immediately before the animation for this animation begins.
     */
    closeMenu(callback, cancelPreviousCallback) {
        this._haltAnimation(cancelPreviousCallback);

        this.isClosing = true;
        this.isOpening = false;

        this._animate('close', callback);
    }

    /**
     * Toggles the menu open or closed. If the menu is open or is opening, then it will now start
     * closing, and vice versa.
     *
     * @param {Function} callback The function to be called when the animation finishes.
     * @param {boolean} [cancelPreviousCallback=false] This is optional. If
     * true, then the callback of a previous open or close animation will be
     * canceled if that animation was still inprogress when this method is
     * called, otherwise the callback of the previous open or close animation
     * will be fired immediately before the animation for this animation begins.
     */
    toggleMenu(callback, cancelPreviousCallback) {
        if (this.isOpen || this.isOpening) {
            this.closeMenu(callback, cancelPreviousCallback);
        }
        else if (!this.isOpen || this.isClosing) {
            this.openMenu(callback, cancelPreviousCallback);
        }
    }

    /**
     * Animates the menu to it's target state.
     *
     * @private
     * @param {String} targetState The name of the state to animate to.
     * @param {Function} callback The function to call after the animation completes.
     */
    _animate(targetState, callback) {
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
            this.animationTransition.set(1, {duration: this.options.animationDuration, curve: Easing.outExpo}, _callback);
        }
        else if (targetState == 'close') {
            this.animationTransition.set(0, {duration: this.options.animationDuration, curve: Easing.outExpo}, _callback);
        }
    }

    /**
     * Halts the current animation, if any.
     *
     * @private
     * @param {boolean} [cancelCallback=false] Defaults to false. If true, the
     * halted animation's callback won't fire, otherwise it will be fired.
     */
    _haltAnimation(cancelCallback) {
        if (this.isAnimating) {
            if (!cancelCallback && typeof this.transitionCallback == 'function') {
                this.transitionCallback();
            }
            this.transitionCallback = undefined;
            this.animationTransition.halt();
        }
    }

    /**
     * @override
     */
    monkeyPatchNodeRenderMethod() {

        let oldRender = this.node.render
        let layout = this // "this" is this PushMenuLayout

        this.node.render = function() {

            // Blur the content if layout.options.blur is true, and the animation is moveBack.
            //
            // TODO: Make the item to be blurred specifiable, perhaps with a method on
            // layout.
            if (layout.options.blur && layout.options.fade && layout.options.animationType == 'moveBack') {
                let momentaryBlur = (layout.animationTransition.get() * layout.options.blurRadius)
                let filter = {
                    "-webkit-filter": 'blur('+momentaryBlur+'px)',
                    "-moz-filter":    'blur('+momentaryBlur+'px)',
                    "-ms-filter":     'blur('+momentaryBlur+'px)',
                    "-o-filter":      'blur('+momentaryBlur+'px)',
                    filter:           'blur('+momentaryBlur+'px)'
                }

                // TODO TODO TODO v0.1.0: Make fadePlane a sibling with menu and
                // content molecules or the following breaks if fade is false.
                // Then remove the check for layout.options.fade in the previous if
                // statement above.
                if (layout.contentMol.node._child[1].get() instanceof Surface) {
                    layout.contentMol.node.get().setProperties(filter)
                }
                else if (layout.contentMol.node._child[1] instanceof Plane) {
                    layout.contentMol.node._child[1].surface.setProperties(filter)
                }
            }

            return oldRender.call(this) // "this" here is the actual node, as intended.
        }
    }
}
export default PushMenuLayout;
