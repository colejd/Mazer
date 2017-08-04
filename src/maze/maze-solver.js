import { Graph } from "../graph/graph.js";

export class MazeSolver {
    constructor() {

    }

    Reset() {
        this.finished = false;
        this.solving = false;

        this.solution = null;

        this.solverFunction = Solvers.DFS;
    }

    Solve(maze) {
        this.Reset();

        let graph = GenerateGraph(maze);
        
        this.solving = true;
        this.solverFunction.call(this, maze, graph, (path) => {
            this.solution = path;

            this.finished = true;
            this.solving = false;
            console.log("Solver finished.");
        });
    }

}

function GenerateGraph(maze) {
    /*

    My own method. Make a graph of the maze with vertices at any cell
    that doesn't constitute a "hallway" (only two opposing walls),
    then solve using a graph search.

    Two passes to create graph: one to determine vertices, and one to determine connectedness.

    TODO:
    Since we're pruning dead ends, can we also prune the vertices that lead to them?

    */

    let IsVertex = (cell) => {

        // Count start and goal nodes as vertices always
        if (cell == maze.startCell || cell == maze.goalCell) {
            return true;
        }

        let numWalls = cell.NumWalls();

        // Ignore any hallways
        if(numWalls == 2) {
            if ((cell.walls.top && cell.walls.bottom) || (cell.walls.right && cell.walls.left)){
                return false;
            }
        }

        // Ignore any dead ends
        else if(numWalls == 3) {
            return false;
        }

        return true;

    }

    // Structure: { cell: [neighbors], ... }
    let graph = new Graph();
    let vertices = []

    // Determine vertices
    for(let y = 0; y < maze.height; y++){
        for(let x = 0; x < maze.width; x++) {
            let cell = maze.cells[y][x];
            if(IsVertex(cell)) {
                cell.isVertex = true;
                vertices.push(cell);
                graph.AddNode(cell);
            }
            //await timeout(this.waitMS);
        }
    }

    // Build graph from vertex connectedness
    for(let cell of vertices) {
            
        let xpos = cell.position.x;
        let ypos = cell.position.y;
        let currentCell = cell;

        // Go right until we hit a wall. If we find a vertex, it's connected.
        xpos = cell.position.x;
        ypos = cell.position.y;
        while(true) {
            let currentCell = maze.cells[ypos][xpos];
            if (!currentCell) break; // If we're outside the maze, break

            if(currentCell.isVertex) {
                if(currentCell != cell) {
                    graph.ConnectNodes(cell, currentCell);
                    break;
                }
            }

            // If there is a wall to the right, break.
            if(currentCell.walls.right) {
                break;
            }
            xpos += 1;

            //await timeout(this.waitMS);
        }


        // Go down until we hit a wall. If we find a vertex, it's connected.
        xpos = cell.position.x;
        ypos = cell.position.y;
        while(true) {
            let currentCell = maze.cells[ypos][xpos];
            if (!currentCell) break; // If we're outside the maze, break

            if(currentCell.isVertex) {
                if(currentCell != cell) {
                    graph.ConnectNodes(cell, currentCell);
                    break;
                }
            }

            // If there is a wall on bottom, break.
            if(currentCell.walls.bottom) {
                break;
            }
            ypos += 1;

            //await timeout(this.waitMS);
        }



    }

    return graph;

}

export let Solvers = {
    BFS: async function(maze, graph, finishedCallback) {
        graph.BFS(graph.GetNode(maze.startCell), graph.GetNode(maze.goalCell), finishedCallback);
    },

    DFS: async function(maze, graph, finishedCallback) {
        graph.DFS(graph.GetNode(maze.startCell), graph.GetNode(maze.goalCell), finishedCallback);
    },

    AStar: async function(maze, graph, finishedCallback) {
        graph.AStar(graph.GetNode(maze.startCell), graph.GetNode(maze.goalCell), finishedCallback);
    },
}