import WorkerScene from '../nodes/WorkerScene'
import WorkerNode from '../nodes/WorkerNode'

let nodeList = {}

self.nodes = { WorkerScene, WorkerNode }

self.addEventListener('message', function(message) {
    let data = message.data

    if (data instanceof Object && data.method === 'registerNode') {

        // Create a new WorkerNode or WorkerScene, the type inferred from the
        // from the ID prefix.
        let idPrefix = data.id.split('#')[0]
        let workerNode = new self.nodes["Worker"+idPrefix](data.id)

        // What are the memory and garabage collection implications of storing
        // references to every node in nodeList?
        nodeList[workerNode.id] = workerNode

        console.log('node list:', nodeList)
    }
})
