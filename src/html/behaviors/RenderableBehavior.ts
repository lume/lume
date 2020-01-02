import {Behavior} from './Behavior'

/**
 * Base class for behaviors relating to rendering
 */
export class RenderableBehavior extends Behavior {
    connectedCallback() {
        // this.loadGL()
        super.connectedCallback()
        this.loadGL()
    }

    disconnectedCallback() {
        // this.unloadGL()
        super.disconnectedCallback()
        this.unloadGL()
    }

    loadGL(): boolean {
        console.log(' ------------- LOAD GL ??????????????')

        if (!this.element.three) return false

        console.log(' ------------- LOAD GL !!!!!!!!!!!!!!!')

        if (this._glLoaded) return false
        this._glLoaded = true

        return true
    }

    unloadGL(): boolean {
        if (!this._glLoaded) return false
        this._glLoaded = false

        return true
    }

    protected _glLoaded = false
    protected _cssLoaded = false
}
