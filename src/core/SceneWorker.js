import Scene from '../nodes/Scene'
import Node  from '../nodes/Node'

import WorkerAlign      from '../nodeComponents/WorkerAlign'
import WorkerCamera     from '../nodeComponents/WorkerCamera'
import WorkerMountPoint from '../nodeComponents/WorkerMountPoint'
import WorkerOpacity    from '../nodeComponents/WorkerOpacity'
import WorkerOrigin     from '../nodeComponents/WorkerOrigin'
import WorkerPosition   from '../nodeComponents/WorkerPosition'
import WorkerRotation   from '../nodeComponents/WorkerRotation'
import WorkerScale      from '../nodeComponents/WorkerScale'
import WorkerSize       from '../nodeComponents/WorkerSize'
import WorkerTransform  from '../nodeComponents/WorkerTransform'

let nodeList = {}
self.nodeClasses = { Scene, Node }

let componentList = {}
self.componentClasses = {
    WorkerAlign,
    WorkerCamera,
    WorkerMountPoint,
    WorkerOpacity,
    WorkerOrigin,
    WorkerPosition,
    WorkerRotation,
    WorkerScale,
    WorkerSize,
    WorkerTransform,
}

self.addEventListener('message', function(message) {
    let data = message.data

    // XXX: Maybe we can consolidate the following register methods into a
    // single mechanism.

    if (data instanceof Object && data.method === 'registerComponent') {

        // Create a new WorkerNodeComponent, the type inferred from the from
        // the ID prefix.
        console.log(' --- worker component ID: ', data.id)
        let idPrefix = data.id.split('#')[0]
        let workerComponent = new self.componentClasses["Worker"+idPrefix](data.id)

        // What are the memory and garabage collection implications of storing
        // references to every component in componentList?
        componentList[workerComponent.id] = workerComponent

        console.log('component list:', componentList)
    }

    else if (data instanceof Object && data.method === 'registerNode') {

        // Create a new worker Node or Scene, the type inferred from the
        // from the ID prefix.
        let idPrefix = data.id.split('#')[0]
        console.log('Making a worker-side ', idPrefix)
        let workerNode = new self.nodeClasses[idPrefix](data.id)

        // What are the memory and garabage collection implications of storing
        // references to every node in nodeList?
        nodeList[workerNode.id] = workerNode

        console.log('node list:', nodeList)
    }
})
