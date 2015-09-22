# Web Worker Strategies

## blah

* Nodes dispersed over threads
  * components can be directly messaged (e.g. setPosition)
  * components send/receive events on their node (position_change -> transform)
  * components can send to renderer (DOMElement -> DOMRenderer)
    * these should be buffered per worker snf dr
  * components can receive events from other nodes (size change -> child)
* Nodes can be created anywhere via uuid

* Need a quick way cascade sizes.
* Cascading position?  How to handle


## Switcharoo

```js
// ui.js
requestAnimationFrame(timestamp) {
  sendTimeStampToWorker(timestamp);
}

// worker.js
receiveTSfromUI(timestamp) {
  sendCalculationsFromPreviousFrame();
  beginWorkOnCalculationsForThisFrame();
}
```

* Pro: Shortly after rAf is fired, all calculations are ready
* Con: Calculations are one frame behind

Variably timed frames (assume 20ms frame for convenience)?

```
     1      2      3      4      5      6
 |- 20 -|- 20 -|- 30 -|- 10 -|- 20 -|- 20 -|
```

Frame 1 has 20ms to draw nothing
Frame 2 has 20ms to draw 20ms of calculations
Frame 3 has 30ms to draw 20ms of calculations
Frame 4 has 10ms to draw 30ms of calculations
Frame 5 has 20ms to draw 10ms of calcaulations
