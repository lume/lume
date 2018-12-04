/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein) and Joe Pea (trusktr)
 * @license MIT
 * @copyright Gloey Apps, 2015
 * @copyright Joe Pea, 2018
 */

import Class from 'lowclass'
import * as AutoLayout from 'autolayout'
import Node from '../core/Node'

/**
 * A Node that lays children out based on an Apple AutoLayout VFL layout
 * description.
 */
const AutoLayoutNode = Class('AutoLayoutNode').extends(Node, ({ Super, Public, Private }) => ({

    static: {
        DEFAULT_PARSE_OPTIONS: {
        	extended: true,
        	strict: false,
        },
    },

    /**
     * Constructor
     *
     * @param {Object} [options] options to set.
     * @param {String|Array} [options.visualFormat] String or array of strings containing VFL.
     * @param {Object} [options.layoutOptions] Options such as viewport, spacing, etc...
     * @return {AutoLayoutController} this
     */
    constructor() {
        Super(this).constructor()

    	Private(this)._options = {};
    	Private(this)._idToNode = {};

        // TODO replace with Motor render task
    	Private(this)._comp = this.addComponent({
    		onUpdate: _layout.bind(this),
    		onSizeChange: _layout.bind(this)
    	});

    	if (options) {
    		if (options.visualFormat) {
    			this.setVisualFormat(options.visualFormat);
    		}
    		if (options.layoutOptions) {
    			this.setLayoutOptions(options.options);
    		}
    	}
    },

    /**
     * Forces a reflow of the layout.
     *
     * @return {AutoLayoutController} this
     */
    reflowLayout() {
        if (!Private(this)._reflowLayout) {
            Private(this)._reflowLayout = true;
            this.requestUpdate(Private(this)._comp);
        }
    },

    /**
     * Sets the visual-format string.
     *
     * @param {String|Array} visualFormat String or array of strings containing VFL.
     * @param {Object} [parseOptions] Specify to override the parse options for the VFL.
     * @return {AutoLayoutController} this
     */
    setVisualFormat(visualFormat, parseOptions) {
    	Private(this)._visualFormat = visualFormat;
    	var constraints = AutoLayout.VisualFormat.parse(visualFormat, parseOptions || AutoLayoutNode.DEFAULT_PARSE_OPTIONS);
    	Private(this)._metaInfo = AutoLayout.VisualFormat.parseMetaInfo(visualFormat);
    	Private(this)._autoLayoutView = new AutoLayout.View({
    		constraints: constraints
    	});
    	this.reflowLayout();
    	return this;
    },

    /**
     * Sets the options such as viewport, spacing, etc...
     *
     * @param {Object} options Layout-options to set.
     * @return {AutoLayoutController} this
     */
    setLayoutOptions(options) {
    	Private(this)._options = options || {};
    	this.reflowLayout();
    	return this;
    },

    /**
     * Adds a new child to this node. If this method is called with no argument it will
     * create a new node, however it can also be called with an existing node which it will
     * append to the node that this method is being called on. Returns the new or passed in node.
     *
     * @param {Node|void} child The node to appended or no node to create a new node.
     * @param {String} id Unique id of the node which matches the id used in the Visual format.
     * @return {Node} the appended node.
     */
    addChild(child, id) {
    	child = Super(this).addChild(child);
    	Private(this)._idToNode[id] = child;
    	this.reflowLayout();
    	return child;
    },

    /**
     * Removes a child node from another node. The passed in node must be
     * a child of the node that this method is called upon.
     *
     * @param {Node} [child] node to be removed
     * @param {String} [id] Unique id of the node which matches the id used in the Visual format.
     * @return {Boolean} whether or not the node was successfully removed
     */
    removeChild(child, id) {
    	var res = false;
    	if (child && id) {
    		res = Super(this).removeChild(child);
    		delete Private(this)._idToNode[id];
    	}
    	else if (child) {
    		for (id in Private(this)._idToNode) {
    			if (Private(this)._idToNode[id] === child) {
    				delete Private(this)._idToNode[id];
    				break;
    			}
    		}
    		res = Super(this).removeChild(child);
    	}
    	else if (id) {
    		res = Super(this).removeChild(Private(this)._idToNode[id]);
    		delete Private(this)._idToNode[id];
    	}
    	this.reflowLayout();
    	return res;
    },

    private: {
        _setIntrinsicWidths(widths) {
            for (var key in widths) {
                var subView = this._autoLayoutView.subViews[key];
                var node = this._idToNode[key];
                if (subView && node) {
                    subView.intrinsicWidth = node.calculatedSize.x; // PORTED
                }
            }
        },

        _setIntrinsicHeights(heights) {
            for (var key in heights) {
                var subView = this._autoLayoutView.subViews[key];
                var node = this._idToNode[key];
                if (subView && node) {
                    subView.intrinsicHeight = node.calculatedSize.y; // PORTED
                }
            }
        },

        _setViewPortSize(size, vp) {
            size = [
                ((vp.width !== undefined) && (vp.width !== true)) ? vp.width : Math.max(Math.min(size[0], vp['max-width'] || size[0]), vp['min-width'] || 0),
                ((vp.height !== undefined) && (vp.height !== true)) ? vp.height : Math.max(Math.min(size[1], vp['max-height'] || size[1]), vp['min-height'] || 0)
            ];
            if ((vp.width === true) && (vp.height === true)) {
                size[0] = this._autoLayoutView.fittingWidth;
                size[1] = this._autoLayoutView.fittingHeight;
            }
            else if (vp.width === true) {
                this._autoLayoutView.setSize(undefined, size[1]);
                size[0] = this._autoLayoutView.fittingWidth;
                // TODO ASPECT RATIO?
            }
            else if (vp.height === true) {
                this._autoLayoutView.setSize(size[0], undefined);
                size[1] = this._autoLayoutView.fittingHeight;
                // TODO ASPECT RATIO?
            }
            else {
                size = vp['aspect-ratio'] ? [
                    Math.min(size[0], size[1] * vp['aspect-ratio']),
                    Math.min(size[1], size[0] / vp['aspect-ratio'])
                ] : size;
                this._autoLayoutView.setSize(size[0], size[1]);
            }
            return size;
        },

        _layout() {
        	if (!this._autoLayoutView) {
        		return;
        	}
            var x;
            var y;
            var size = Public(this).getSize();
            if (this._options.spacing || this._metaInfo.spacing) {
        		this._autoLayoutView.setSpacing(this._options.spacing || this._metaInfo.spacing);
            }
            var widths = this._options.widths || this._metaInfo.widths;
            if (widths) {
                this._setIntrinsicWidths(widths);
            }
            var heights = this._options.heights || this._metaInfo.heights;
            if (heights) {
                this._setIntrinsicHeights(heights);
            }
            if (this._options.viewport || this._metaInfo.viewport) {
        		var restrainedSize = this._setViewPortSize(size, this._options.viewport || this._metaInfo.viewport);
        		x = (size[0] - restrainedSize[0]) / 2;
        		y = (size[1] - restrainedSize[1]) / 2;
            }
            else {
        		this._autoLayoutView.setSize(size[0], size[1]);
        		x = 0;
        		y = 0;
            }
            for (var key in this._autoLayoutView.subViews) {
                var subView = this._autoLayoutView.subViews[key];
                if ((key.indexOf('_') !== 0) && (subView.type !== 'stack')) {
        			var node = this._idToNode[key];
        			if (node) {
                        node.sizeMode = [ // PORTED
                            (widths && (widths[key] === true)) ? 'proportional' : 'literal',
                            (heights && (heights[key] === true)) ? 'proportional' : 'literal'
                        ];
        				node.size = [ // PORTED
                            (widths && (widths[key] === true)) ? 1 : subView.width,
                            (heights && (heights[key] === true)) ? 1 : subView.height
                        ];
        				node.position = [ // PORTED
                            x + subView.left,
                            y + subView.top,
                            subView.zIndex * 5
                        ];
        			}
                }
            }
            if (this._reflowLayout) {
                this._reflowLayout = false;

                // TODO replace with Motor render task
                Public(this).requestUpdate(this._comp);
            }
        },
    },
}))

export default AutoLayoutNode

module.exports = AutoLayoutController;
