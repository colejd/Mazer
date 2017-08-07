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
                let neighbors = node.GetNeighbors();
                for(let i = 0; i < neighbors.length; i++) {
                    let new_path = path.slice(); // Clone
                    new_path.push(neighbors[i]);
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
                let neighbors = node.GetNeighbors();
                for(let i = 0; i < neighbors.length; i++) {
                    let new_path = path.slice(); // Clone
                    new_path.push(neighbors[i]);
                    queue.push(new_path);
                }

                visited.add(node);
            }

        }

        cb(ret);
    }

    // http://web.mit.edu/eranki/www/tutorials/search/
    async AStar(start, goal, cb) {
        let open = [start];
        let closed = [];

        let VerifyNode = (node) => {
            if(!node.f) node.f = 0;
            if(!node.g) node.g = 0;
            if(!node.h) node.h = 0;
        }

        let Manhattan = (a, b) => {
            return Math.abs(a.val.position.x - b.val.position.x) + Math.abs(a.val.position.y - b.val.position.y);
        }

        let CollectionHasBetterNode = (collection, node) => {
            let similar = collection.filter((item) => {
                return item.val.position.x == node.val.position.x &&
                        item.val.position.y == node.val.position.y;
            });

            for(let item of similar){
                if(item.f < node.f){
                    return true;
                }
            }

            return false;
        }

        let reps = 0;
        let repsPerUnit = 100;
        let found = false;
        
        while(open.length > 0){

            // Debug visualization
            // for(let node of open) {
            //     node.val.SetDrawOption("fillColor", "orange");
            // }
            // for(let node of closed) {
            //     node.val.SetDrawOption("fillColor", "blue");
            // }

            // Sort by F cost
            open.sort((a, b) => {
                return a.f - b.f;
            });

            // Get `q`: the node with the lowest f cost in `open`
            let q = open.shift();

            VerifyNode(q);

            // Examine each neighbor of Q
            for(let neighbor of q.GetNeighbors()) {
                // Ignore any neighbors on the closed list
                if(closed.includes(neighbor)) continue;
                
                VerifyNode(neighbor);
                neighbor.parent = q;

                // If a neighbor is the goal, break out of while loop
                if(neighbor == goal) {
                    found = true;
                    break;
                }

                // Distance from q.g to neighbor 
                neighbor.g = q.g + Manhattan(q, neighbor);
                // Distance from neighbor to goal (heuristic)
                neighbor.h = Manhattan(neighbor, goal);
                neighbor.f = neighbor.g + neighbor.h;

                // If open has a node with a better F score, skip this neighbor
                if(CollectionHasBetterNode(open, neighbor)) continue;

                // If closed has a node with a better F score, skip this neighbor
                if(CollectionHasBetterNode(closed, neighbor)) continue;

                // Otherwise add the neighbor to the open list
                open.push(neighbor);


            }

            if(found) {
                break;
            }

            // Push Q on the closed list
            closed.push(q);

            reps += 1;
            if(reps >= repsPerUnit){
                await timeout(0);
                reps = 0;
            }
        }

        let path = [];

        if(found){
            // Rebuild path
            let current = goal;
            path = [current];
            while(current.parent) {
                path.push(current.parent);
                current = current.parent;
            }

        }

        cb(path);

    }


}