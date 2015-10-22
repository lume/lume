import WorkerScene from '../nodes/WorkerScene'
import WorkerNode from '../nodes/WorkerNode'

let nodes = {}

self.addEventListener('message', function(message) {
    let data = message.data

    if (data instanceof Object && data.method === 'registerNode') {
        let workerNode = new WorkerNode(data.id)

        // memory and garabage collection implications of this?
        nodes[workerNode.id] = workerNode
    }
})
