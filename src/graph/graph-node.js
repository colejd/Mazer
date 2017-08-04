export class GraphNode {
    constructor(val) {
        this.neighbors = [];
        this.val = val;
    }

    AddNeighbor(node) {
        this.neighbors.push(node);
    }

    GetNeighbors() {
        return this.neighbors;
    }

    toString() {
        return `[Node] ${this.val.toString()}`;
    }
}