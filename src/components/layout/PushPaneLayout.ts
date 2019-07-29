// TODO: replace menu easing with physics so the user can throw the menu,
// using initial velocity and drag to slow it down, and stop immediately
// when it hits the fully-open or fully-closed positions.

import Node from '../../core/Node'
import {html} from '../html-template-tag'
import {Tween, Easing} from 'tween.js'
import {Motor} from '../../core'

// TODO replace native event handling with GenericSync
// import {EventHandler} from '../events/EventHandler'
// import {GenericSync} from '../events/GenericSync'

class StatusTween extends Tween {
    started = false
    stopped = false
    completed = false

    constructor(...args: any[]) {
        super(...args)

        this.onStart(() => (this.started = true))
        this.onStop(() => (this.stopped = true))
        this.onComplete(() => (this.completed = true))
    }
}

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
 * PushPaneLayout.
 *
 * Note: If you've called `openMenu` or `closeMenu` with a callback, the callback
 * will be canceled if a drag or hover on the menu happens before the animation
 * has completed. Please open an issue on GitHub if you have any opinion
 * against this. :) Maybe we can add a boolean option for this behavior.
 *
 * TODO: Embed working example here.
 *
 * @class PushPaneLayout
 * @extends Node
 */
export default class PushPaneLayout extends Node {
    static defaultElementName = 'i-push-pane-layout'

    // menuSide = 'left' // left or right
    // menuWidth = 200
    // menuHintSize = 10 // the amount of the menu that is visible before opening the menu.
    // pushAreaWidth = 40 // the area on the screen edge that the user can touch and drag to push out the menu.
    // animationDuration = 1000
    // animationType = 'foldDown' // options: foldDown moveBack
    // // TODO: Background color for the whole layout should be the color that the fade fades to.
    // // TODO: Replace fade star/end colors with a fog color value and intensity.
    // fade = true // when content recedes, it fades into the fog.
    // fadeStartColor = 'rgba(255,255,255,0)'
    // fadeEndColor = 'rgba(255,255,255,1)'
    // contentBlur = false // XXX: WIP, so false by default.
    // blurRadius = 5

    // private isOpen = false
    // private isOpening = false
    // private isClosing = false
    // private isAnimating = false // keep track of whether the menu is opening or closing.
    // isBeingDragged = false // whether the user is dragging/pushing the menu or not.

    // private touchSync!: GenericSync
    // private _eventOutput = new EventHandler()

    /**
     * Creates a new PushPaneLayout.
     *
     * @constructor
     * @param options The options to instantiate a `PushPaneLayout` with.
     */
    constructor(options: any) {
        super(options)

        // this._eventOutput.bindThis(this)
        // // Set the touch sync for pulling/pushing the menu open/closed.
        // GenericSync.register({
        //     touch: TouchSync,
        // })
        // this.touchSync = new GenericSync(['touch'])

        this.sizeMode = ['proportional', 'proportional', 'literal']
        this.size = [1, 1, 0]
    }

    // // from Famous ElementOutput class
    // private eventForwarder = (event: any) => {
    //     this._eventOutput.emit(event.type, event)
    // }

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param type event type key (for example, 'click')
     * @param fn handler callback
     */
    // // from Famous ElementOutput class
    // addListener(type: string, fn: (s: string, o: object) => void): this {
    //     this.addEventListener(type, this.eventForwarder)
    //     this._eventOutput.on(type, fn)
    //     return this
    // }

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "addListener"
     *
     * @method removeListener
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler
     */
    // // from Famous ElementOutput class
    // removeListener(type: string, fn: (s: string, o: object) => void): this {
    //     this._eventOutput.removeListener(type, fn)
    //     return this
    // }

    setBodyContent(...nodes: Node[]) {
        this.__renderMarkup()
        this.__body.addChildren(nodes)
    }

    setPaneContent(...nodes: Node[]) {
        this.__renderMarkup()
        this.__pane.addChildren(nodes)
    }

    async openPane() {
        this.__renderMarkup()

        if (!this.__menuIsOpening) {
            this.__menuIsOpening = true

            await this.animateTo(1.0)

            this.__menuIsOpening = false
        }
    }

    async closePane() {
        this.__renderMarkup()

        if (!this.__menuIsClosing) {
            this.__menuIsClosing = true

            await this.animateTo(0.0)

            this.__menuIsClosing = false
        }
    }

    updateMenuPosition(value: number) {
        this.__renderMarkup()

        // limit value to between 0 and 1
        value = value > 1 ? 1 : value < 0 ? 0 : value

        this.__menuPosition = value

        this.__pane.position.x = value * 230 - 230
        this.__body.position.z = value * -70 - 1
        this.__fade.position.z = value * -70 - 0.9
        this.__fade.opacity = value * 0.6
        // this.__grip.position.x = value * -50 + 230
    }

    animateTo(value: number) {
        this.__renderMarkup()

        return new Promise(resolve => {
            if (this.__menuTween) this.__menuTween.stop()

            this.__menuTween = new StatusTween(this)
                .to({__menuPosition: value}, 1000)
                .easing(Easing.Exponential.Out)
                .start()

            const tween = this.__menuTween

            const task = Motor.addRenderTask(time => {
                if (tween.stopped) {
                    Motor.removeRenderTask(task)
                    setTimeout(resolve, 0) // setTimeout so that we don't resolve during rAF.
                    return
                }

                tween.update(time)

                this.updateMenuPosition(this.__menuPosition)

                if (tween.completed) {
                    Motor.removeRenderTask(task)
                    setTimeout(resolve, 0) // setTimeout so that we don't resolve during rAF.
                }
            })
        })
    }

    async connectedCallback() {
        super.connectedCallback()

        this.__renderMarkup()

        await new Promise(r => setTimeout(r, 1000))

        // push menu specific
        this.__initMouseEvents()
        this.__initTouchEvents()
    }

    private __menuIsClosing = false
    private __menuIsOpening = false
    private __menuPosition = 0
    private __menuTween: any

    private __pane!: Node
    private __body!: Node
    private __fade!: Node
    // private __grip!: Node

    private __initMouseEvents() {
        const menu = this.querySelector('.menuNode') as Node

        menu.addEventListener('mouseenter', (_event: MouseEvent) => {
            this.openPane()
        })

        menu.addEventListener('mouseleave', (_event: MouseEvent) => {
            this.closePane()
        })
    }

    private __initTouchEvents() {
        // let direction = 1 // opening
        let lastX = 0
        let delta = 0
        let dragX = 0

        this.__pane.addEventListener('touchstart', event => {
            const touches = event.touches

            if (touches.length === 1) {
                if (this.__menuTween) this.__menuTween.stop()

                lastX = touches[0].screenX
                dragX = this.__menuPosition
            }
        })

        this.__pane.addEventListener('touchmove', event => {
            const touches = event.touches

            if (touches.length === 1) {
                const touch = touches[0]

                delta = touch.screenX - lastX
                dragX += delta / 230

                this.updateMenuPosition(dragX)

                lastX = touch.screenX
            }
        })

        this.__pane.addEventListener('touchend', event => {
            const touches = event.changedTouches

            if (touches.length === 1) {
                if (delta > 0) {
                    this.openPane()
                } else if (delta < 0) {
                    this.closePane()
                } else {
                    if (this.__menuPosition >= 0.5) this.openPane()
                    else this.closePane()
                }
            }
        })
    }

    private __markupRendered = false

    private __renderMarkup() {
        if (this.__markupRendered) return
        this.__markupRendered = true

        // TODO replace this with real ShadowDOM slots, when we finish ShadowDOM in https://github.com/infamous/infamous/issues/64
        const paneContent = this.querySelector('[slot="pane"]')
        const bodyContent = this.querySelector('[slot="body"]')

        this.innerHTML = html`
            <!--
                BUG: if we remove this wrapper, then content always renders on top of the
                menu for some reason.
                TODO: See if this has to do with the root context, and preserve-3d?
            -->
            <i-node
                id="layoutRootNode"
                size-mode="proportional, proportional, literal"
                size="1, 1, 0"
                style="pointer-events: none; /*background: #F5DABD */ /* light tan*/"
            >
                <i-node
                    class="menuNode"
                    size-mode="literal, proportional, literal"
                    size="230, 1, 0"
                    position="-230, 0, 1"
                    style="pointer-events: auto"
                >
                    <i-node
                        id="invisibleGrip"
                        ref="invisibleGrip"
                        size-mode="literal, proportional, literal"
                        size="50, 1, 0"
                        position="225, 0, 0"
                    >
                        <!-- pane slot -->
                    </i-node>
                </i-node>

                <i-node
                    class="contentNode"
                    size-mode="proportional, proportional, literal"
                    size="1, 1, 0"
                    position="0, 0, -1"
                    style="/*background: salmon;*/ pointer-events: auto"
                >
                    <!-- body slot -->
                </i-node>

                <i-node
                    class="fadeEffect"
                    size-mode="proportional, proportional, literal"
                    size="1, 1, 0"
                    position-COMMENT="slightly above the content"
                    position="0, 0, -0.9"
                    opacity="0.0"
                    style="background: #333; pointer-events: none"
                >
                </i-node>
            </i-node>
        ` as string

        this.__pane = this.querySelector('.menuNode') as Node
        this.__body = this.querySelector('.contentNode') as Node
        this.__fade = this.querySelector('.fadeEffect') as Node
        // this.__grip = this.querySelector('.invisibleGrip') as Node

        setTimeout(() => {
            ;[paneContent, bodyContent].forEach((content, i) => {
                if (content) {
                    i === 0 && this.__pane.appendChild(content)
                    i === 1 && this.__body.appendChild(content)

                    if (isNode(content)) {
                        content.sizeMode = ['proportional', 'proportional']
                        content.size = [1, 1]
                    }
                }
            })
        }, 500)
    }
}

function isNode(n: any): n is Node {
    return n.isNode
}

export {PushPaneLayout}
