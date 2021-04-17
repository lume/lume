/**
 * The **borderBoxSize** read-only property of the
 * [ResizeObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry)
 * interface returns an object containing the new border box size of the
 * observed element when the callback is run.
 */
// TODO add this to TS lib.dom
interface ResizeObserverEntryBoxSize {
	/**
	 * The length of the observed element's border box in the block dimension. For
	 * boxes with a horizontal
	 * [writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode),
	 * this is the vertical dimension, or height; if the writing-mode is vertical,
	 * this is the horizontal dimension, or width.
	 */
	blockSize: number

	/**
	 * The length of the observed element's border box in the inline dimension.
	 * For boxes with a horizontal
	 * [writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode),
	 * this is the horizontal dimension, or width; if the writing-mode is
	 * vertical, this is the vertical dimension, or height.
	 */
	inlineSize: number
}

// TODO add this to TS lib.dom
interface Window {
	ResizeObserver: typeof ResizeObserver
}
