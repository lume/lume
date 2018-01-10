import * as React from 'react'
import * as ReactDOM from 'react-dom'

// routes
import '../imports/routes'

import 'infamous/html'

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

let demoIndex = 0
function getNextDemo() {
    const demo = demos[demoIndex]
    demoIndex = ++demoIndex % demos.length
    return demo
}

main()
async function main() {
    const footerHeight = 50

    class App extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                currentDemo: getNextDemo()
            }
        }
        render() {
            return (
                <motor-scene>

                    <motor-node
                        sizeMode="proportional proportional"
                        proportionalSize="1 1"
                    >
                        <iframe ref="iframe" className="background-iframe" src={this.state.currentDemo}></iframe>
                    </motor-node>

                    <motor-node
                        class="gradient-background"
                        sizeMode="proportional proportional"
                        proportionalSize="1 1"
                        opacity="0.7"
                    >
                    </motor-node>

                    <motor-node
                        id="titleNode"
                        class="centerText"
                        sizeMode="proportional absolute"
                        absoluteSize="0 50"
                        proportionalSize="1"
                        align="0 0.2"
                        mountPoint="0 0.2"
                        position={`0 ${-footerHeight}`}
                    >
                        <h1>INFAMOUS</h1>
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
                            proportionalSize="0.333"
                            align="0 0.5"
                            mountPoint="0 0.5"
                        >
                            <a href="http://forums.infamous.io">Discussion</a>
                        </motor-node>

                        <motor-node
                            class="centerText"
                            sizeMode="proportional absolute"
                            absoluteSize="0 20"
                            proportionalSize="0.333"
                            align="0.333 0.5"
                            mountPoint="0 0.5"
                        >
                            <a href="http://github.com/trusktr/infamous">GitHub</a>
                        </motor-node>

                        <motor-node
                            class="centerText"
                            sizeMode="proportional proportional"
                            proportionalSize="0.333 1"
                            align="1 0.5"
                            mountPoint="1 0.5"
                        >
                            <a className="centerText" href="https://www.browserstack.com" target="_blank">
                                <span className="centerText">Testing powered by </span><img className="centerText" src="https://cloud.githubusercontent.com/assets/297678/18809725/8fc020f6-8238-11e6-9505-8a6db92f700a.png" />
                            </a>
                        </motor-node>

                    </motor-node>

                </motor-scene>
            )
        }

        componentDidMount() {
            console.log('hello')
            setInterval(() => {
                this.setState({currentDemo: getNextDemo()})
            }, 10000)
        }
    }

    ReactDOM.render(<App />, document.body)
}
