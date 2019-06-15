import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import 'geometry-interfaces'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import {default as HTMLInterface} from '../html/HTMLNode'
import {props, mapPropTo} from './props'

// register behaviors that can be used on this element
import '../html/behaviors/ObjModelBehavior'

const radiansPerDegree = (1 / 360) * 2 * Math.PI

initImperativeBase()
const Brand = {brand: 'Node'}

let Node = Mixin(Base => {
    const Parent = ImperativeBase.mixin(Base)

    return Class('Node').extends(
        Parent,
        ({Super, Public, Protected}) => ({
            static: {
                defaultElementName: 'i-node',
                props: {
                    ...Parent.props,
                    visible: {...mapPropTo(props.boolean, self => self.three), default: true},
                },
            },

            /**
             * @constructor
             *
             * @param {Object} options Initial properties that the node will
             * have. This can be used when creating a node, alternatively to using the
             * setters/getters for position, rotation, etc.
             *
             * @example
             * var node = new Node({
             *   size: {x:100, y:100, z:100},
             *   rotation: {x:30, y:20, z:25}
             * })
             */
            constructor(options = {}) {
                const self = super(options)

                // This was when using my `multiple()` implementation, we could call
                // specific constructors using specific arguments. But, we're using
                // class-factory style mixins for now, so we don't have control over the
                // specific arguments we can pass to the constructors, so we're just
                // using a single `options` parameter in all the constructors.
                //self.callSuperConstructor(Transformable, options)
                //self.callSuperConstructor(TreeNode)
                //self.callSuperConstructor(ImperativeBase)

                // `parent` can exist if this instance is in the DOM and being
                // upgraded.
                if (self.parent) {
                    // if (self.isConnected) {
                    this._calcSize()
                    self.needsUpdate()
                }

                return self
            },

            updated(oldProps, modifiedProps) {
                super.updated(oldProps, modifiedProps)

                if (modifiedProps.visible) {
                    console.log(
                        '                           visibility change',
                        this.constructor.name,
                        this._cssLoaded,
                        this.visible
                    )
                    setTimeout(() => {
                        console.log(
                            '                           visibility later',
                            this.constructor.name,
                            this._cssLoaded,
                            this.visible
                        )
                    }, 1000)
                    this._elementOperations.shouldRender = this._cssLoaded && this.visible
                    this.needsUpdate()
                }
            },

            protected: {
                // See ImperativeBase#add and ImperativeBase#remove.
                _onParentSizeChange() {
                    // We only need to recalculate sizing and matrices if this node has
                    // properties that depend on parent sizing (proportional size,
                    // align, and mountPoint). mountPoint isn't obvious: if this node
                    // is proportionally sized, then the mountPoint will depend on the
                    // size of this element which depends on the size of this element's
                    // parent. Align also depends on parent sizing.
                    if (
                        this._properties.sizeMode.x === 'proportional' ||
                        this._properties.sizeMode.y === 'proportional' ||
                        this._properties.sizeMode.z === 'proportional' ||
                        this._properties.align.x !== 0 ||
                        this._properties.align.y !== 0 ||
                        this._properties.align.z !== 0
                    ) {
                        this._calcSize()
                        this.needsUpdate()
                    }
                },

                _loadCSS() {
                    if (this._cssLoaded) return
                    console.log('                ----------------------------- LOAD NODE CSS')
                    super._loadCSS()
                    this.triggerUpdateForProp('visible')
                },

                _unloadCSS() {
                    if (!this._cssLoaded) return
                    console.log('                ----------------------------- UNLOAD NODE CSS')
                    super._unloadCSS()
                    this.triggerUpdateForProp('visible')
                },
            },
        }),
        Brand
    )
})

// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
Node = Node.mixin(HTMLInterface)

export {Node as default}
