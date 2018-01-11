import * as React from 'react'
import * as ReactDOM from 'react-dom'

// routes
import '../imports/routes'

import 'infamous/html'
import Motor from 'infamous/core/Motor'

Tracker.autorun(function() {
    document.title = Session.get('appTitle')
})

const demos = _.shuffle([
    //'//dl.dropboxusercontent.com/u/2790629/famin/demo2/index.html?50', // FIXME in Safari 9, or remake
    //'http://devmagnet.net/boxer/demo/examples/rotate-180-nodes/', // no HTTPS, or remake
    //'//dl.dropboxusercontent.com/u/2790629/famin/demo1/index.html?50', // FIXME in Safari 9, or remake
    //'//trusktr.io/clobe', // JSS broken, FIXME
    //'//jsfiddle.net/trusktr/ymonmo70/15/embedded/result,js,html,css', // DOM car, FIXME in firefox
    //'//trusktr.io/pyramids', // WIP

    '//trusktr.io/rippleFlip',
    '//trusktr.io/geometricRotation',
    '//trusktr.io/worms',
    '//trusktr.io/webglFundamentals',
    '//trusktr.io/polydance',
    '//trusktr.io/flipDiagonal',
    '//trusktr.io/randomBits',
    '//trusktr.io/rainbowTriangles',
])

// copied from https://codepen.io/trusktr/live/JMMXPB
class MorphingColorSpiral extends React.Component {
    constructor() {
        super()

        this.state = {
            rotation: 0,
        }

        const nodes = Array(400).fill(0)

        this.staticInnerScene = (
            <motor-scene id="spiral-inner-scene">
                {nodes.map((n, i) => (
                    <motor-node
                        key={i}
                        absoluteSize="0 0 0"
                        align="0.5 0.5"
                        rotation={[0, 0, i*10]}
                    >
                        <motor-node
                            absoluteSize={[50-i%50, 50-i%50, 0]}
                            mountPoint="0.5 0.5"
                            position={[0, i*2, 0]}
                            style={{
                                background: `hsl( ${ (i*2)%360 }, 90%, 78%)`,
                                borderRadius: `${ i%50 }px`,
                            }}
                        >
                        </motor-node>
                    </motor-node>
                ))}
            </motor-scene>
        )
    }

    render() {
        return (
            <motor-scene id="spiral-outer-scene" style={{background:'#333'}}>
                <motor-node
                    absoluteSize="1630 1630"
                    align="0.5 0.5"
                    mountPoint="0.5 0.5"
                    rotation={[0, 0, this.state.rotation]}
                >

                    {this.staticInnerScene}

                </motor-node>
            </motor-scene>
        )
    }

    componentDidMount() {
        Motor.addRenderTask(() => {
            this.setState({
                rotation: this.state.rotation - 9.8
            })
        })
    }
}

main()
async function main() {
    const footerHeight = 44.5

    class App extends React.Component {
        render() {
            return (
                <motor-scene ref="scene">

                    <motor-node
                        sizeMode="proportional absolute"
                        proportionalSize="1 1"
                        ref="titleArea"
                    >
                        <motor-node
                            sizeMode="proportional proportional"
                            proportionalSize="1 1"
                        >

                            <MorphingColorSpiral />

                        </motor-node>

                        <motor-node
                            class="gradient-background"
                            sizeMode="proportional proportional"
                            proportionalSize="1 1"
                            opacity="0.85"
                        >
                        </motor-node>

                        <motor-node
                            id="titleNode"
                            class="centerText"
                            sizeMode="proportional absolute"
                            absoluteSize="0 50"
                            proportionalSize="1"
                            align="0 0.5"
                            mountPoint="0 0.5"
                        >
                            <h1>INFAMOUS</h1>
                        </motor-node>
                    </motor-node>

                    <motor-node
                        id="footerNode"
                        class="centerText"
                        sizeMode="proportional absolute"
                        absoluteSize={`0 ${footerHeight}`}
                        proportionalSize="1"
                        align="0 1"
                        mountPoint="0 1"
                    >

                        <motor-node
                            class="centerText"
                            sizeMode="proportional absolute"
                            absoluteSize="0 20"
                            proportionalSize="0.333333"
                            align="0 0.5"
                            mountPoint="0 0.5"
                        >
                            <a href="http://forums.infamous.io">Discussion</a>
                        </motor-node>

                        <motor-node
                            class="centerText"
                            sizeMode="proportional absolute"
                            absoluteSize="0 20"
                            proportionalSize="0.333333"
                            align="0.333333 0.5"
                            mountPoint="0 0.5"
                        >
                            <a href="/docs/index.html">Docs</a>
                        </motor-node>

                        <motor-node
                            class="centerText"
                            sizeMode="proportional absolute"
                            absoluteSize="0 20"
                            proportionalSize="0.333333"
                            align="0.666666 0.5"
                            mountPoint="0 0.5"
                        >
                            <a href="http://github.com/trusktr/infamous">GitHub</a>
                        </motor-node>

                    </motor-node>

                </motor-scene>
            )
        }

        updateSize() {
            const {titleArea, scene} = this.refs
            const sceneHeight = scene.actualSize.y
            console.log('???', sceneHeight, sceneHeight - footerHeight)
            titleArea.absoluteSize.y = sceneHeight - footerHeight
        }

        componentDidMount() {
            setTimeout(() => {
                this.updateSize()
                this.refs.scene.imperativeCounterpart.on('sizechange', () => this.updateSize())
            }, 0)
        }
    }

    ReactDOM.render(<App />, document.body)
}
