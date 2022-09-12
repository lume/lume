# NASA Astrobee Robot

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<!--
  Collada model of NASA's Astrobee robot loaded into a space station scene.
  Model from https://github.com/nasa/astrobee_media/tree/master/astrobee_freeflyer/meshes.
-->

<script src="${location.origin+location.pathname}global.js"><\/script>

<style>
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    background: #27304d;
  }
  lume-scene {
    touch-action: none;
  }
</style>

<astrobee-app id="astrobee">

<script>
  const {defineElements, booleanAttribute, Element, element, attribute, html} = LUME

  const bodyModelUrl = '${location.origin+location.pathname}examples/nasa-astrobee-robot/astrobee/body.dae'
  const pmcModelUrl = '${location.origin+location.pathname}examples/nasa-astrobee-robot/astrobee/pmc.dae'
  const pmcSkinModelUrl = '${location.origin+location.pathname}examples/nasa-astrobee-robot/astrobee/pmc_skin_.dae'
  const pmcBumperModelUrl = '${location.origin+location.pathname}examples/nasa-astrobee-robot/astrobee/pmc_bumper.dae'

  // Find more at https://blog.kuula.co/360-images-ruben-frosali
  const lunaStation = '${location.origin+location.pathname}examples/nasa-astrobee-robot/luna-station.jpg'

  // Registers the LUME elements with their default tag names.
  defineElements()

  // Long live HTML elements!

  element('astrobee-app')((() => {
    class App extends Element {
      constructor() {
        super()

        this.rotationDirection = 1 // clockwise
        this.rotationAmount = 0.2 // degrees

        this.rotationEnabled = true
        this.view = 'free'

        this.astrobee
        this.sceneContainer
        this.loading
        this.models = []
      }

      template = () => html\`
        <>
          <loading-icon ref=\${el => this.loading = el}></loading-icon>

          <div class="sceneContainer hidden" ref=\${el => this.sceneContainer = el}>
            <lume-scene webgl enable-css="false" environment=\${() => lunaStation}>
              <lume-element3d align-point="0.5 0.5 0.5">
                <lume-camera-rig
                  active=\${() => this.view === 'free'}
                  initial-polar-angle="30"
                  min-distance="0.4"
                  max-distance="2"
                  dolly-speed="0.002"
                  initial-distance="1"
                />
                <lume-element3d rotation=\${() => [this.view === 'top' ? -90 : 0, 0, 0]}>
                  <lume-perspective-camera active=\${() => this.view !== 'free'} position="0 0 0.7" />
                </lume-element3d>
              </lume-element3d>

              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 90 0" />
              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 -90 0" />
              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 0 90" />
              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="0 0 -90" />
              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="90 80 0" />
              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="90 -80 0" />
              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="-90 80 0" />
              <lume-point-light intensity="0.3" align-point="0.5 0.5 0.5" color="#a3ffff" position="-90 -80 0" />

              <lume-element3d ref=\${el => this.astrobee = el} align-point="0.5 0.5 0.5" rotation=\${() => this.astrobeeRotation}>
                <lume-collada-model ref=\${el => this.models.push(el)} src=\${() => bodyModelUrl} />
                <lume-collada-model ref=\${el => this.models.push(el)} src=\${() => pmcModelUrl} />
                <lume-collada-model ref=\${el => this.models.push(el)} src=\${() => pmcSkinModelUrl} />
                <lume-collada-model ref=\${el => this.models.push(el)} src=\${() => pmcBumperModelUrl} />

                <comment style="display:none">The other side.</comment>
                <lume-element3d scale="1 1 -1">
                  <lume-collada-model ref=\${el => this.models.push(el)} src=\${() => pmcModelUrl} />
                  <lume-collada-model ref=\${el => this.models.push(el)} src=\${() => pmcSkinModelUrl} />
                  <lume-collada-model ref=\${el => this.models.push(el)} src=\${() => pmcBumperModelUrl} />
                </lume-element3d>
              </lume-element3d>

              <lume-sphere
                has="basic-material"
                texture=\${() => lunaStation}
                color="white"
                align-point="0.5 0.5 0.5"
                mount-point="0.5 0.5 0.5"
                size="100 100 100"
                sidedness="double"
                cast-shadow="false"
                receive-shadow="false"
              />
            </lume-scene>
          </div>

          <div class="ui">
            <fieldset>
              <legend>Rotation</legend>
              <label>
                <input type="checkbox" checked=\${() => this.rotationEnabled} onChange=\${this.toggleRotation} />&nbsp;
                Enable rotation.
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked=\${() => this.rotationDirection < 0}
                  onChange=\${this.toggleRotationDirection}
                />&nbsp;
                Clockwise rotation.
              </label>
            </fieldset>
            <fieldset>
              <legend>View</legend>
              <label>
                <input type="radio" name="side" checked=\${() => this.view === 'side'} onChange=\${this.changeView} />&nbsp;
                Side view.
              </label>
              <br />
              <label>
                <input type="radio" name="top" checked=\${() => this.view === 'top'} onChange=\${this.changeView} />&nbsp;
                Top view
              </label>
              <br />
              <label>
                <input type="radio" name="free" checked=\${() => this.view === 'free'} onChange=\${this.changeView} />&nbsp;
                Free view
              </label>
            </fieldset>
          </div>
        </>
      \`

      css = /*css*/ \`
        :host {
          width: 100%;
          height: 100%;
        }

        loading-icon {
          --loading-icon-color: 117, 199, 199; /*light teal*/
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 10px; height: 10px;
        }

        .sceneContainer { width: 100%; height: 100%; }

        .ui {
          position: absolute;
          margin: 15px;
          padding: 10px;
          top: 0;
          left: 0;
          color: white;
          font-family: sans-serif;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 7px;
        }

        fieldset legend {
          color: #75c7c7;
        }
        fieldset {
          border-color: #75c7c7;
          border-radius: 4px;
        }
        fieldset:nth-child(2) legend {
          color: #c595c9;
        }
        fieldset:nth-child(2) {
          border-color: #c595c9;
        }

        .hidden { display: none; }
      \`

      astrobeeRotation = (x, y, z, _time) => [
        x,
        y + this.rotationAmount * this.rotationDirection,
        z,
      ]

      toggleRotation = () => {
        this.rotationEnabled = !this.rotationEnabled

        if (this.rotationEnabled) this.astrobee.rotation = this.astrobeeRotation
        else this.astrobee.rotation = () => false // stops rotation
      }

      toggleRotationDirection = () => (this.rotationDirection *= -1)

      changeView = (event) => {
        const input = event.target

        if (input.checked) this.view = input.name
      }

      async connectedCallback() {
        super.connectedCallback()
        const promises = []

        for (const model of this.models)
          promises.push(new Promise(resolve => model.on('MODEL_LOAD', resolve)))

        await Promise.all(promises)

        this.sceneContainer.classList.remove('hidden')
        this.loading.classList.add('hidden')
      }
    }

    App.observedAttributes = {
      rotationDirection: attribute.number(1),
      rotationAmount: attribute.number(1),
      rotationEnabled: attribute.boolean(true),
      view: attribute.string('free'),
    }

    return App
  })())
<\/script>
`
},
})
</script>
