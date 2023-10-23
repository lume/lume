var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AutoLayoutNode_1;
import AutoLayout from '@lume/autolayout';
import { attribute, element } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
import { Motor } from '../core/Motor.js';
import { autoDefineElements } from '../LumeConfig.js';
export { AutoLayout };
let AutoLayoutNode = AutoLayoutNode_1 = class AutoLayoutNode extends Element3D {
    static DEFAULT_PARSE_OPTIONS = {
        extended: true,
        strict: false,
    };
    visualFormat = '';
    constructor(options) {
        super();
        this.on('sizechange', this.#layout);
        this.on('reflow', this.#layout);
        if (options) {
            if (options.visualFormat) {
                this.setVisualFormat(options.visualFormat);
            }
            if (options.layoutOptions) {
                this.setLayoutOptions(options.layoutOptions);
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.createEffect(() => {
            this.setVisualFormat(this.visualFormat || '');
        });
    }
    #autoLayoutView;
    childConnectedCallback(child) {
        if (!(child instanceof Element3D))
            throw new Error('Child elements of AutoLayoutNode must be instances of LUME.Element3D.');
        super.childConnectedCallback(child);
        if (!this.#autoLayoutView)
            return;
        this.#checkNodes();
    }
    childDisconnectedCallback(child) {
        if (!(child instanceof Element3D))
            throw new Error('Child elements of AutoLayoutNode must be instances of LUME.Element3D.');
        super.childDisconnectedCallback(child);
        if (!this.#autoLayoutView)
            return;
        const _idToNode = this.#idToNode;
        for (const id in _idToNode) {
            if (_idToNode[id] === child) {
                delete _idToNode[id];
                break;
            }
        }
        this.#checkNodes();
    }
    reflowLayout() {
        if (!this.#reflowLayout) {
            this.#reflowLayout = true;
            Motor.once(() => this.emit('reflow'));
        }
        return this;
    }
    setVisualFormat(visualFormat, parseOptions) {
        this._visualFormat = visualFormat;
        var constraints = AutoLayout.VisualFormat.parse(visualFormat, parseOptions || AutoLayoutNode_1.DEFAULT_PARSE_OPTIONS);
        this.#metaInfo = AutoLayout.VisualFormat.parseMetaInfo(visualFormat);
        this.#autoLayoutView = new AutoLayout.View({
            constraints: constraints,
        });
        this.#checkNodes();
        this.reflowLayout();
        return this;
    }
    setLayoutOptions(options) {
        this.#layoutOptions = options || {};
        this.reflowLayout();
        return this;
    }
    addToLayout(child, id) {
        this.append(child);
        if (id)
            this.#idToNode[id] = child;
        this.reflowLayout();
        return child;
    }
    removeFromLayout(child, id) {
        if (child && id) {
            this.removeChild(child);
            delete this.#idToNode[id];
        }
        else if (child) {
            for (id in this.#idToNode) {
                if (this.#idToNode[id] === child) {
                    delete this.#idToNode[id];
                    break;
                }
            }
            this.removeChild(child);
        }
        else if (id) {
            this.removeChild(this.#idToNode[id]);
            delete this.#idToNode[id];
        }
        this.reflowLayout();
    }
    #layoutOptions = {};
    #idToNode = {};
    #reflowLayout = false;
    #metaInfo;
    #setIntrinsicWidths(widths) {
        for (var key in widths) {
            var subView = this.#autoLayoutView.subViews[key];
            var node = this.#idToNode[key];
            if (subView && node) {
                subView.intrinsicWidth = node.calculatedSize.x;
            }
        }
    }
    #setIntrinsicHeights(heights) {
        for (var key in heights) {
            var subView = this.#autoLayoutView.subViews[key];
            var node = this.#idToNode[key];
            if (subView && node) {
                subView.intrinsicHeight = node.calculatedSize.y;
            }
        }
    }
    #setViewPortSize(size, vp) {
        size = [
            vp.width !== undefined && vp.width !== true
                ? vp.width
                : Math.max(Math.min(size[0], vp['max-width'] || size[0]), vp['min-width'] || 0),
            vp.height !== undefined && vp.height !== true
                ? vp.height
                : Math.max(Math.min(size[1], vp['max-height'] || size[1]), vp['min-height'] || 0),
        ];
        if (vp.width === true && vp.height === true) {
            size[0] = this.#autoLayoutView.fittingWidth;
            size[1] = this.#autoLayoutView.fittingHeight;
        }
        else if (vp.width === true) {
            this.#autoLayoutView.setSize(undefined, size[1]);
            size[0] = this.#autoLayoutView.fittingWidth;
        }
        else if (vp.height === true) {
            this.#autoLayoutView.setSize(size[0], undefined);
            size[1] = this.#autoLayoutView.fittingHeight;
        }
        else {
            size = vp['aspect-ratio']
                ? [Math.min(size[0], size[1] * vp['aspect-ratio']), Math.min(size[1], size[0] / vp['aspect-ratio'])]
                : size;
            this.#autoLayoutView.setSize(size[0], size[1]);
        }
        return size;
    }
    #layout = () => {
        if (!this.#autoLayoutView) {
            return;
        }
        var x;
        var y;
        var size = this.size.toArray();
        if (this.#layoutOptions.spacing || this.#metaInfo.spacing) {
            this.#autoLayoutView.setSpacing(this.#layoutOptions.spacing || this.#metaInfo.spacing);
        }
        var widths = this.#layoutOptions.widths || this.#metaInfo.widths;
        if (widths) {
            this.#setIntrinsicWidths(widths);
        }
        var heights = this.#layoutOptions.heights || this.#metaInfo.heights;
        if (heights) {
            this.#setIntrinsicHeights(heights);
        }
        if (this.#layoutOptions.viewport || this.#metaInfo.viewport) {
            var restrainedSize = this.#setViewPortSize(size, this.#layoutOptions.viewport || this.#metaInfo.viewport);
            x = (size[0] - restrainedSize[0]) / 2;
            y = (size[1] - restrainedSize[1]) / 2;
        }
        else {
            this.#autoLayoutView.setSize(size[0], size[1]);
            x = 0;
            y = 0;
        }
        for (var key in this.#autoLayoutView.subViews) {
            var subView = this.#autoLayoutView.subViews[key];
            if (key.indexOf('_') !== 0 && subView.type !== 'stack') {
                var node = this.#idToNode[key];
                if (node) {
                    this.#updateNode(node, subView, x, y, widths, heights);
                }
            }
        }
        if (this.#reflowLayout) {
            this.#reflowLayout = false;
        }
    };
    #updateNode(node, subView, x, y, widths, heights) {
        node.sizeMode = [
            widths && widths[key] === true ? 'proportional' : 'literal',
            heights && heights[key] === true ? 'proportional' : 'literal',
        ];
        node.size = [
            widths && widths[key] === true ? 1 : subView.width,
            heights && heights[key] === true ? 1 : subView.height,
        ];
        node.position = [
            x + subView.left,
            y + subView.top,
            subView.zIndex * 5,
        ];
    }
    #checkNodes() {
        const subViews = this.#autoLayoutView.subViews;
        const subViewKeys = Object.keys(subViews);
        const _idToNode = this.#idToNode;
        for (var key of subViewKeys) {
            var subView = subViews[key];
            if (key.indexOf('_') !== 0 && subView.type !== 'stack') {
                var node = _idToNode[key];
                if (!node) {
                    node = this.querySelector('.' + key);
                    if (node && node.parentElement === this)
                        _idToNode[key] = node;
                }
            }
        }
        this.#showOrHideNodes();
    }
    #showOrHideNodes() {
        const subViews = this.#autoLayoutView.subViews;
        const subViewKeys = Object.keys(subViews);
        const _idToNode = this.#idToNode;
        const nodeIds = Object.keys(_idToNode);
        for (const id of nodeIds) {
            if (subViewKeys.includes(id))
                _idToNode[id].visible = true;
            else
                _idToNode[id].visible = false;
        }
    }
};
__decorate([
    attribute,
    __metadata("design:type", Object)
], AutoLayoutNode.prototype, "visualFormat", void 0);
AutoLayoutNode = AutoLayoutNode_1 = __decorate([
    element('lume-autolayout-node', autoDefineElements),
    __metadata("design:paramtypes", [Object])
], AutoLayoutNode);
export { AutoLayoutNode };
//# sourceMappingURL=AutoLayoutNode.js.map