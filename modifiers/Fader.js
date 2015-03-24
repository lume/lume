define(function(require, exports, module) {
    var Transitionable = require('../core/Transitionable');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Modifier that allows you to fade the opacity of affected renderables in and out.
     * @class Fader
     * @constructor
     * @param {Object} [options] options configuration object.
     * @param {Boolean} [options.cull=false] Stops returning affected renderables up the tree when they're fully faded when true.
     * @param {Transition} [options.transition=true] The main transition for showing and hiding.
     * method is called.
     *
     */
    function Fader(options) {
        this.options = Object.create(Fader.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.opacityState = new Transitionable(options.value || 1);
    }

    Fader.DEFAULT_OPTIONS = {
        cull: false,
        transition: true
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options.  See constructor.
     */
    Fader.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Fully displays the Fader instance's associated renderables.
     *
     * @method show
     * @param {Transition} [transition] The transition that coordinates setting to the new state.
     * @param {Function} [callback] A callback that executes once you've transitioned to the fully shown state.
     */
    Fader.prototype.show = function show(transition, callback) {
        transition = transition || this.options.transition;
        this.set(1, transition, callback);
    };

    /**
     * Fully fades the Fader instance's associated renderables.
     *
     * @method hide
     * @param {Transition} [transition] The transition that coordinates setting to the new state.
     * @param {Function} [callback] A callback that executes once you've transitioned to the fully faded state.
     */
    Fader.prototype.hide = function hide(transition, callback) {
        transition = transition || this.options.transition;
        this.set(0, transition, callback);
    };

    /**
     * Manually sets the opacity state of the fader to the passed-in one. Executes with an optional
     * transition and callback.
     *
     * @method set
     * @param {Number} state A number from zero to one: the amount of opacity you want to set to.
     * @param {Transition} [transition] The transition that coordinates setting to the new state.
     * @param {Function} [callback] A callback that executes once you've finished executing the pulse.
     */
    Fader.prototype.set = function set(state, transition, callback) {
        this.halt();
        this.opacityState.set(state, transition, callback);
    };

    /**
     * Halt the transition
     *
     * @method halt
     */
    Fader.prototype.halt = function halt() {
        this.opacityState.halt();
    };

    /**
     * Tells you if your Fader instance is above its visibility threshold.
     *
     * @method isVisible
     * @return {Boolean} Whether or not your Fader instance is visible.
     */
    Fader.prototype.isVisible = function isVisible() {
        return (this.opacityState.get() > 0);
    };

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method render
     *
     */
    Fader.prototype.render = function render() {
        var opacity = this.opacityState.get();
        if (!this.options.cull && opacity > 0);
            return {opacity : opacity};
    };

    module.exports = Fader;
});
