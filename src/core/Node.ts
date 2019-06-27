import Mixin from 'lowclass/Mixin'
import 'geometry-interfaces'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import {default as HTMLInterface} from '../html/HTMLNode'
import {props, mapPropTo} from './props'

// register behaviors that can be used on this element
import '../html/behaviors/ObjModelBehavior'

initImperativeBase()

function NodeMixin<T extends Constructor>(Base: T) {
    const Parent = ImperativeBase.mixin(Base) as typeof Base

    return class Node extends Parent {
        static defaultElementName = 'i-node'
        static props = {
            ...((Parent as any).props || {}),
            visible: {...mapPropTo(props.boolean, (self: any) => self.three), default: true},
        }

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
        constructor(...args: any[]) {
            super(...args)

            // This was when using my `multiple()` implementation, we could call
            // specific constructors using specific arguments. But, we're using
            // class-factory style mixins for now, so we don't have control over the
            // specific arguments we can pass to the constructors, so we're just
            // using a single `options` parameter in all the constructors.
            //this.callSuperConstructor(Transformable, options)
            //this.callSuperConstructor(TreeNode)
            //this.callSuperConstructor(ImperativeBase)

            // `parent` can exist if this instance is in the DOM and being
            // upgraded.
            if (this.parent) {
                // if (this.isConnected) {
                this._calcSize()
                this.needsUpdate()
            }
        }

        updated(oldProps: any, modifiedProps: any) {
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
        }

        // See ImperativeBase#add and ImperativeBase#remove.
        protected _onParentSizeChange() {
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
        }

        protected _loadCSS() {
            if (this._cssLoaded) return
            console.log('                ----------------------------- LOAD NODE CSS')
            super._loadCSS()
            this.triggerUpdateForProp('visible')
        }

        protected _unloadCSS() {
            if (!this._cssLoaded) return
            console.log('                ----------------------------- UNLOAD NODE CSS')
            super._unloadCSS()
            this.triggerUpdateForProp('visible')
        }
    }
}

const _Node = Mixin(NodeMixin)

// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
export const Node = _Node.mixin(HTMLInterface)
export default Node
