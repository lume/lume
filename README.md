Infamous Motor
==============

> A Javascript UI engine.

This is a work in progress. Join the discussion and planning at [forums.infamous.io](http://forums.infamous.io).

TODO List (and some theory)
===========================
* [x] Making a new Scene in the UI thread instantiates the singleton Motor
      instance (the equivalent of Famous' `Engine`). Users won't have to deal with
      the Motor API like they did in Famous. The top level API will be easier than
      Famous. The conept: make a scene, add nodes to it, animate them with
      Transitions. The rest (initializing the engine, etc, happens behind the
      scenes, including web worker creation and management).
* [x] When the Motor singleton is created (by the previous step) the Motor
      instantiates a Worker thread, the SceneWorker (the same name as the worker in
      @steveblue's Boxer prototype by coincidence) and sets up a communication
      channel.
* [x] When a Node is created in the UI thread (Scenes included since they
      inherit from Node), Motor is notified, and a reciprocal WorkerNode is created
      inside of the SceneWorker. The UI-side Node is an interface for the
      SceneWorker WorkerNode. For example, setting a rotation on a node doesn't
      actually set the rotation in the UI thread, but sends the message to the
      WorkerNode in the SceneWorker. For every Node in the UI thread there is a
      WorkerNode in the SceneWorker. WorkerNodes are simple, and serve for the
      purpose of calculating transforms, opacity, etc. They don't care about things
      like DOMElement components on the UI-side. They just contain the 3D state of
      the scene graph at their position in the graph.
      NOTE: The SceneWorker can be abstracted further, and f.e., we can make each
      Node have it's own worker, etc (just an idea). The UI-thread's Node is
      associated to the SceneWorker's WorkerNode by a matching ID, randomly
      generated when making a `new Node()`.
      TODO: Handle the case of an ID collision, and generate a new ID (for the
      unlikely event this ever happens).
* [ ] Make the NodeComponent registration pattern. When adding a component to a
      node, the component registers one or more getter/setter pairs on the Node.
      Components in Motor's case don't have onUpdate methods, they just house logic
      for static values on a Node (the value is get/set with a getter/setter). Like
      Nodes, there is a UI-side NodeComponent interface, and a reciprocal
      WorkerNodeComponent inside the SceneWorker. The components in the worker
      thread are the actual components that house numerical values. Keep in mind,
      as an end user, this will be completely transparent and you won't have to
      know about all this worker stuff. The guides will show the UI-side API usage.
* [ ] Make a DOMElement component. The component registers an actual DOM
      element onto the UI-side Node to which it belongs, but doesn't need to
      register anything on the worker side. As a side effect of creating your first
      DOMElement and adding it to a Node on the UI-side, a DOMRenderer is
      instantiated (or should that happen at a different point?).
* [ ] DOM renderer. The DOM renderer constructs a DOM scene who's node
      structure matches one-to-one with the structure of he Motor scene graph in
      non-IE browsers, and creates a flat structure in IE (due to limitations in
      IE). The nested, one-to-one DOM structure in non-IE browsers serves to cache
      transforms all the way from the root of the tree to the leaf nodes so that
      matrix transform calculations for the DOM scene can be deferred to the native
      side of the browser instead of JavaScript (the browser will natively
      calculate final world transforms). Unfortunately for IE, the matrix tranform
      multiplications for the DOM will need to happen in our JavaScript, which
      means 3D DOM in IE might be slower (at the very least it'll be harder to work
      with).
      NOTE -- In Famous Engine, nodes without a DOMElement don't manifest into
      the DOM, but they can still have transforms; the Famous DOMRenderer
      treats a node chain (a chain meaning a chain of nodes with trnsforms, but
      no rendereable such as a DOMElement) like a single node, and a
      finally-calculated transform is applied to the DOMElement at the end of
      the chain. So, the question is: Should we calculate matrix transforms on
      chains of Nodes that don't have any DOMElement renderable except for one
      at the end of the chain or should we just construct an actual DOM element
      for every node, and let the browser handle transform caching 100% of the
      time (thus not needing a Web Worker for the DOMRenderer)?  The second is
      of course much easier to implement, and is what I'll do, plus it will
      take advantage of 100% DOM transform caching in non-IE browsers.
      NOTE -- At this point, the DOM version of our scene graph will be rendered
      to the page, although it will be static (no animation yet).
  * [ ] Calculate final transforms (world transforms) in the SceneWorker (so
        the results can be given to both the DOMRenderer and the WebGLRenderer as
        needed).
  * [ ] Use the selector from the root Scene to determine where to begin
        inserting the DOM scene.
* [ ] WebGL renderer.
* [ ] Mixed Mode (webgl + dom) rendering
