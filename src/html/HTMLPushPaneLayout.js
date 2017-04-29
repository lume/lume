import HTMLNode from './HTMLNode'
import PushPaneLayout from '../components/PushPaneLayout'

class HTMLPushPaneLayout extends HTMLNode {
    static define(name) {
        customElements.define(name || 'i-push-pane-layout', HTMLPushPaneLayout)
    }

    // @override
    _makeImperativeCounterpart() {
        return new PushPaneLayout({
            _motorHtmlCounterpart: this
        })
    }

    createdCallback() {
        console.log(' -- HTMLPushPaneLayout created')
        super.createdCallback()

        const menuColor = 'rgb(45,45,45)'

        this._root = this.attachShadow({mode: 'closed'})
        this._root.innerHTML = (`
            <i-node
                sizeMode="proportional, proportional, absolute"
                proportionalSize="1, 1, 0"
                style="
                    pointer-events: none;
                    ${/*"background: #f5dabd;"*/""}
                "
                >

                <i-node id="menuNode"
                    sizeMode="absolute, proportional, absolute"
                    absoluteSize="230, 0, 0"
                    position="-230, 0, 1"
                    proportionalSize="0, 1, 0"
                    style="pointer-events: auto;"
                    >

                    <i-node id="invisibleGrip"
                        sizeMode="absolute, proportional, absolute"
                        absoluteSize="50, 0, 0"
                        proportionalSize="0, 1, 0"
                        position="225, 0, 0"
                        >
                    </i-node>

                    <i-node id="menuHint"
                        absoluteSize="10, 20, 0"
                        align="1, 0.5, 0"
                        mountPoint="0, 0.5, 0"
                        >

                        <div class="triangle" style="
                            position: absolute;
                            top: -2px;
                            width: 0;
                            height: 0;
                            border-top: 12px solid transparent;
                            border-bottom: 12px solid transparent;
                            border-left: 12px solid #1dd326;
                        ">
                        </div>

                        <div class="triangle" style="
                            position: absolute;
                            width: 0;
                            height: 0;
                            border-top: 10px solid transparent;
                            border-bottom: 10px solid transparent;
                            border-left: 10px solid ${menuColor};
                        ">
                        </div>
                    </i-node>

                    <slot name="menu"></slot>

                </i-node>

                <i-node id="contentNode"
                    sizeMode="proportional, proportional, absolute"
                    proportionalSize="1, 1, 0"
                    position="0, 0, -1"
                    style="${/*background: salmon;*/""} pointer-events: auto;"
                    >

                    <slot name="content"></slot>
                </i-node>

                <i-node id="fadeEffect"
                    sizeMode="proportional, proportional, absolute"
                    proportionalSize="1, 1, 0"
                    position="0, 0, -0.9"
                    opacity="0.0"
                    style="background: #333; pointer-events: none;"
                    >
                </i-node>

            </i-node>
        `)
    }
}

export {HTMLPushPaneLayout as default}
