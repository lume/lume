/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Surface = require('../core/Surface');
    var CanvasSurface = require('../surfaces/CanvasSurface');
    var Transform = require('../core/Transform');
    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');

    var MouseSync = require('../inputs/MouseSync');
    var TouchSync = require('../inputs/TouchSync');
    var GenericSync = require('../inputs/GenericSync');

    GenericSync.register({
        mouse : MouseSync,
        touch : TouchSync
    });

    function Slider(options) {
        this.options = Object.create(Slider.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.indicator = _createIndicator(this.options);
        this.label = _createLabel(this.options);

        this.ctx = this.indicator.getContext('2d');
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, this.options.size[0], this.options.size[1]);

        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var scale = (this.options.range[1] - this.options.range[0]) / this.options.size[0];

        this.sync = new GenericSync(
            ['mouse', 'touch'],
            {
                scale : scale,
                direction : GenericSync.DIRECTION_X
            }
        );

        this.sync.subscribe(this.label);

        this.sync.on('update', function(data) {
            this.set(this.get() + data.delta);
        }.bind(this));

        this.label.on('click', function(event){
            this.set(event.offsetX * scale);
        }.bind(this));

        this.value = this.options.value;
        this._drawPos = 0;

        _updateLabel.call(this, this.value);
    }

    Slider.DEFAULT_OPTIONS = {
        size: [200,25],
        range: [0, 1],
        precision: 1,
        value: 0,
        fillColor: 'rgba(50,50,50,1)',
        backgroundColor: 'rgba(0,0,0,0)',
        label: ''
    };

    function _createIndicator(options){
        return new CanvasSurface({
            size: options.size
        });
    }

    function _createLabel(options){
        var labelProperties = {
            lineHeight : options.size[1] + 'px',
            cursor : 'pointer',
            color : '#3cf',
            zIndex : 1
        };

        for (var key in options.properties)
            labelProperties[key] = options.properties[key];

        return new Surface({
            size: options.size,
            content: options.label,
            properties : labelProperties,
            classes : options.classes
        });
    }

    function _updateLabel(value) {
        this.label.setContent(
            this.options.label +
            '<span style="float: right">' +
                value.toFixed(this.options.precision) +
            '</span>'
        );
    }

    Slider.prototype.setOptions = function setOptions(options) {
        return this.optionsManager.setOptions(options);
    };

    Slider.prototype.get = function get() {
        return this.value;
    };

    function clamp(value, range) {
        return Math.max(Math.min(value, range[1]), range[0]);
    };

    Slider.prototype.set = function set(value) {
        if (value === this.value) return;
        this.value = clamp(value, this.options.range);
        _updateLabel.call(this, this.value);
        this.eventOutput.emit('change', {value: this.value});
    };

    Slider.prototype.getSize = function getSize() {
        return this.options.size;
    };

    Slider.prototype.render = function render() {
        var range = this.options.range;
        var size = this.options.size;

        var fillSize = Math.floor(((this.get() - range[0]) / (range[1] - range[0])) * size[0]);

        var ctx = this.indicator.getContext('2d');

        if (fillSize < this._drawPos) {
            ctx.clearRect(fillSize, 0, size[0] - fillSize, size[1]);
            ctx.fillStyle = this.options.backgroundColor;
            ctx.fillRect(fillSize, 0, size[0] - fillSize, size[1]);
        }
        else if (fillSize > this._drawPos) {
            ctx.clearRect(this._drawPos, 0, fillSize - this._drawPos, size[1]);
            ctx.fillStyle = this.options.fillColor;
            ctx.fillRect(this._drawPos, 0, fillSize - this._drawPos, size[1]);
        }
        this._drawPos = fillSize;

        return {
            size: this.options.size,
            target: [this.indicator.render(), this.label.render()]
        };
    };

    module.exports = Slider;
});
