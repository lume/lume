
/**
 * The ImperativeBase class is the base class for the Imperative version of the
 * API, for people who chose to take the all-JavaScript approach and who will
 * not use the HTML-based API (infamous/motor-html).
 *
 * In the future when there is an option to disable the HTML-DOM rendering (and
 * render only WebGL, for example) then the imperative API will be the only API
 * available since the HTML API will be turned off as a result of disabling
 * HTML rendering. Disabling both WebGL and HTML won't make sense, as we'll need
 * at least one of those to render with.
 */
class ImperativeBase {
}

export {ImperativeBase as default}
