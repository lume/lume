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

// TODO:
// - Use MutationObserver to watch for className changes and update laid-out nodes.
// - Perhaps once we get to the ShadowDOM stuff we can use slots instead. It'll
// be more powerful, letting us distribute any number of nodes into each layout
// slot. Also it eliminated edge cases that we'll have to handle with the
// className approach.
// - Make an <i-visual-format> element that can contain visual format code to
// re-use in multiple layouts.
// - Allow visual-format to be fetch by path (like img src attribute).

import Class from 'lowclass'
import * as AutoLayout from 'autolayout'
import Node from '../core/Node'
import Motor from '../core/Motor'
import props from '../core/props'

/**
 * A Node that lays children out based on an Apple AutoLayout VFL layout
 * description.
 */
const AutoLayoutNode = Class('AutoLayoutNode').extends(Node, ({Super, Public, Private}) => ({
    static: {
        defaultElementName: 'i-autolayout-node',
        DEFAULT_PARSE_OPTIONS: {
            extended: true,
            strict: false,
        },
        props: {
            ...Node.props,
            visualFormat: String,
        },
    },

    /**
     * Constructor
     *
     * @param {Object} [options] options to set.
     * @param {String|Array} [options.visualFormat] String or array of strings containing VFL.
     * @param {Object} [options.layoutOptions] Options such as viewport, spacing, etc...
     * @return {AutoLayoutNode} this
     */
    constructor(options) {
        const self = super(options)

        this._layoutOptions = {}
        this._idToNode = {}

        // PORTED {
        this._layout = this._layout.bind(this)
        self.on('sizechange', this._layout)
        self.on('reflow', this._layout)
        // }

        if (options) {
            if (options.visualFormat) {
                self.setVisualFormat(options.visualFormat)
            }
            if (options.layoutOptions) {
                self.setLayoutOptions(options.layoutOptions)
            }
        }

        return self
    },

    updated(oldProps, modifiedProps) {
        super.updated(oldProps, modifiedProps)
        if (modifiedProps.visualFormat) {
            this.setVisualFormat(this.visualFormat)
        }
    },

    childConnected(child) {
        super.childConnected()
        if (!this._autoLayoutView) return
        this._checkNodes()
    },

    childDisconnected(child) {
        super.childConnected()
        if (!this._autoLayoutView) return
        const _idToNode = this._idToNode
        for (id in _idToNode) {
            if (_idToNode[id] === child) {
                delete _idToNode[id]
                break
            }
        }
        this._checkNodes()
    },

    /**
     * Forces a reflow of the layout.
     *
     * @return {AutoLayoutNode} this
     */
    reflowLayout() {
        if (!this._reflowLayout) {
            this._reflowLayout = true
            Motor.once(() => this.emit('reflow')) // PORTED
        }
        return this
    },

    /**
     * Sets the visual-format string.
     *
     * @param {String|Array} visualFormat String or array of strings containing VFL.
     * @param {Object} [parseOptions] Specify to override the parse options for the VFL.
     * @return {AutoLayoutNode} this
     */
    setVisualFormat(visualFormat, parseOptions) {
        this._visualFormat = visualFormat
        var constraints = AutoLayout.VisualFormat.parse(
            visualFormat,
            parseOptions || AutoLayoutNode.DEFAULT_PARSE_OPTIONS
        )
        this._metaInfo = AutoLayout.VisualFormat.parseMetaInfo(visualFormat)
        this._autoLayoutView = new AutoLayout.View({
            constraints: constraints,
        })
        this._checkNodes()
        this.reflowLayout()
        return this
    },

    /**
     * Sets the options such as viewport, spacing, etc...
     *
     * @param {Object} options Layout-options to set.
     * @return {AutoLayoutNode} this
     */
    setLayoutOptions(options) {
        this._layoutOptions = options || {}
        this.reflowLayout()
        return this
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
    add(child, id) {
        // PORTED
        super.add(child) // PORTED
        if (id) this._idToNode[id] = child
        this.reflowLayout()
        return child
    },

    /**
     * Removes a child node from another node. The passed in node must be
     * a child of the node that this method is called upon.
     *
     * @param {Node} [child] node to be removed
     * @param {String} [id] Unique id of the node which matches the id used in the Visual format.
     */
    remove(child, id) {
        // PORTED
        if (child && id) {
            super.remove(child) // PORTED
            delete this._idToNode[id]
        } else if (child) {
            for (id in this._idToNode) {
                if (this._idToNode[id] === child) {
                    delete this._idToNode[id]
                    break
                }
            }
            super.remove(child) // PORTED
        } else if (id) {
            super.remove(this._idToNode[id]) // PORTED
            delete this._idToNode[id]
        }
        this.reflowLayout()
    },

    private: {
        _setIntrinsicWidths(widths) {
            for (var key in widths) {
                var subView = this._autoLayoutView.subViews[key]
                var node = this._idToNode[key]
                if (subView && node) {
                    subView.intrinsicWidth = node.calculatedSize.x // PORTED
                }
            }
        },

        _setIntrinsicHeights(heights) {
            for (var key in heights) {
                var subView = this._autoLayoutView.subViews[key]
                var node = this._idToNode[key]
                if (subView && node) {
                    subView.intrinsicHeight = node.calculatedSize.y // PORTED
                }
            }
        },

        _setViewPortSize(size, vp) {
            size = [
                vp.width !== undefined && vp.width !== true
                    ? vp.width
                    : Math.max(Math.min(size[0], vp['max-width'] || size[0]), vp['min-width'] || 0),
                vp.height !== undefined && vp.height !== true
                    ? vp.height
                    : Math.max(Math.min(size[1], vp['max-height'] || size[1]), vp['min-height'] || 0),
            ]
            if (vp.width === true && vp.height === true) {
                size[0] = this._autoLayoutView.fittingWidth
                size[1] = this._autoLayoutView.fittingHeight
            } else if (vp.width === true) {
                this._autoLayoutView.setSize(undefined, size[1])
                size[0] = this._autoLayoutView.fittingWidth
                // TODO ASPECT RATIO?
            } else if (vp.height === true) {
                this._autoLayoutView.setSize(size[0], undefined)
                size[1] = this._autoLayoutView.fittingHeight
                // TODO ASPECT RATIO?
            } else {
                size = vp['aspect-ratio']
                    ? [Math.min(size[0], size[1] * vp['aspect-ratio']), Math.min(size[1], size[0] / vp['aspect-ratio'])]
                    : size
                this._autoLayoutView.setSize(size[0], size[1])
            }
            return size
        },

        _layout() {
            if (!this._autoLayoutView) {
                return
            }
            var x
            var y
            var size = this.size.toArray()
            if (this._layoutOptions.spacing || this._metaInfo.spacing) {
                this._autoLayoutView.setSpacing(this._layoutOptions.spacing || this._metaInfo.spacing)
            }
            var widths = this._layoutOptions.widths || this._metaInfo.widths
            if (widths) {
                this._setIntrinsicWidths(widths)
            }
            var heights = this._layoutOptions.heights || this._metaInfo.heights
            if (heights) {
                this._setIntrinsicHeights(heights)
            }
            if (this._layoutOptions.viewport || this._metaInfo.viewport) {
                var restrainedSize = this._setViewPortSize(
                    size,
                    this._layoutOptions.viewport || this._metaInfo.viewport
                )
                x = (size[0] - restrainedSize[0]) / 2
                y = (size[1] - restrainedSize[1]) / 2
            } else {
                this._autoLayoutView.setSize(size[0], size[1])
                x = 0
                y = 0
            }
            for (var key in this._autoLayoutView.subViews) {
                var subView = this._autoLayoutView.subViews[key]
                if (key.indexOf('_') !== 0 && subView.type !== 'stack') {
                    var node = this._idToNode[key]
                    if (node) {
                        this._updateNode(node, subView, x, y, widths, heights)
                    }
                }
            }
            if (this._reflowLayout) {
                this._reflowLayout = false
            }
        },

        _updateNode(node, subView, x, y, widths, heights) {
            node.sizeMode = [
                // PORTED
                widths && widths[key] === true ? 'proportional' : 'literal',
                heights && heights[key] === true ? 'proportional' : 'literal',
            ]
            node.size = [
                // PORTED
                widths && widths[key] === true ? 1 : subView.width,
                heights && heights[key] === true ? 1 : subView.height,
            ]
            node.position = [
                // PORTED
                x + subView.left,
                y + subView.top,
                subView.zIndex * 5,
            ]
        },

        _checkNodes() {
            const subViews = this._autoLayoutView.subViews
            const subViewKeys = Object.keys(subViews)
            const _idToNode = this._idToNode

            // if a node is not found for a subview key, see if exists in this's DOM children by className
            for (var key of subViewKeys) {
                var subView = subViews[key]
                if (key.indexOf('_') !== 0 && subView.type !== 'stack') {
                    var node = _idToNode[key]
                    if (!node) {
                        node = this.querySelector('.' + key)
                        if (node && node.parentElement === this) _idToNode[key] = node
                    }
                }
            }

            this._showOrHideNodes()
        },

        _showOrHideNodes() {
            const subViews = this._autoLayoutView.subViews
            const subViewKeys = Object.keys(subViews)
            const _idToNode = this._idToNode
            const nodeIds = Object.keys(_idToNode)

            // hide the child nodes that are should not be visible for the current subview.
            for (const id of nodeIds) {
                if (subViewKeys.includes(id)) _idToNode[id].visible = true
                else _idToNode[id].visible = false
            }
        },
    },
}))

export default AutoLayoutNode
