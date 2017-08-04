import { GraphNode } from "./graph-node.js";
import { timeout } from "../utils/async.js";

export class Graph {
    constructor() {
        this.nodes = {};
    }

    AddNode(cell) {
        //console.log(`Adding cell ${cell}`);
        this.nodes[cell] = new GraphNode(cell);
    }

    GetNodes() {
        return Object.values(this.nodes);
    }

    GetNode(cell) {
        return this.nodes[cell];
    }

    ConnectNodes(cellA, cellB) {
        this.nodes[cellA].neighbors.push(this.nodes[cellB]);
        this.nodes[cellB].neighbors.push(this.nodes[cellA]);
    }

    async BFS(start, goal, cb) {
        let visited = new Set();
        let queue = [[start]];

        let ret = [];

        let reps = 0;
        let repsPerUnit = 100;

        while (queue.length > 0) {
            let path = queue.shift();
            let node = path[path.length - 1];

            if(node == goal) {
                ret = path;
                break;
            }
            else if(!visited.has(node)){
                for(let adjacent of node.GetNeighbors()) {
                    let new_path = path.slice();
                    new_path.push(adjacent);
                    queue.push(new_path);
                }

                visited.add(node);
            }

            reps += 1;
            if(reps >= repsPerUnit){
                await timeout(0);
                reps = 0;
            }

        }

        cb(ret);
    }

    async DFS(start, goal, cb) {
        let visited = new Set();
        let queue = [[start]];

        let ret = []

        while (queue.length > 0) {
            let path = queue.pop();
            let node = path[path.length - 1];

            if(node == goal) {
                ret = path;
                break;
            }
            else if(!visited.has(node)){
                for(let adjacent of node.GetNeighbors()) {
                    let new_path = path.slice();
                    new_path.push(adjacent);
                    queue.push(new_path);
                }

                visited.add(node);
            }

        }

        cb(ret);
    }

    // TODO: This doesn't make any sense since we're working on an arbitrary graph.
    async AStar(start, goal, cb) {
        let visited = new Set();
        let queue = [[start]];

        let ret = [];

        let reps = 0;
        let repsPerUnit = 100;

        // Weight is +1 for each traversal + manhattan distance from path end to goal
        let GetPathWeight = (path) => {
            //let weight = path.length - 1; // Cost is 1 for each traversal

            // Calculate the weight of the path
            let weight = 0;
            for(let i = 1; i < path.length; i++) {
                let dist = Math.abs(path[i].val.position.x - path[i - 1].val.position.x) + Math.abs(path[i].val.position.y - path[i - 1].val.position.y);
                weight += dist;
            }

            // Add manhattan distance from last node in path to the goal
            let last = path[path.length - 1];
            let manhattan = Math.abs(last.val.position.x - goal.val.position.x) + Math.abs(last.val.position.y - goal.val.position.y);
            weight += manhattan;
            
            return weight;
        }

        while (queue.length > 0) {
            let path = queue.shift();
            let node = path[path.length - 1];

            if(node == goal) {
                ret = path;
                break;
            }
            else if(!visited.has(node)){
                for(let adjacent of node.GetNeighbors()) {
                    // If a neighbor is the goal, stop now.
                    // if(adjacent == goal) {
                    //     path.push(adjacent);
                    //     ret = path;
                    //     break;
                    // }

                    // Otherwise add the new path to the queue
                    let new_path = path.slice();
                    new_path.push(adjacent);
                    queue.push(new_path);
                }

                visited.add(node);
            }

            // Sort the queue by weight
            queue.sort((a, b) => {
                return GetPathWeight(a) - GetPathWeight(b);
            });

            reps += 1;
            if(reps >= repsPerUnit){
                await timeout(0);
                reps = 0;
            }

        }

        cb(ret);
    }


}