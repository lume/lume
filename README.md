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
      side of the browser instead of JavaScript, and once cached, they are fast
      when animating only subtrees. Unfortunately for IE, the matrix tranform
      multiplications for the DOM will need to happen in our JavaScript, which
      means 3D DOM in IE might be slower (at the very least it's harder to work
      with). What we can do is use the calculations SceneWorker and apply those
      calculations to both the DOMRenderer and the WebGLRenderer to avoid
      calculating everything twice.  We already have to do all calculations
      manually for the WebGLRenderer anyways, so we might as well share the results
      of those calculations with the DOMRenderer in IE's case.
* [ ] WebGL renderer.
* [ ] Mixed Mode (webgl + dom) rendering
