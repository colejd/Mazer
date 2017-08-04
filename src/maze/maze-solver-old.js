import { Graph } from "../graph/graph.js";

export class MazeSolver {
    constructor() {

    }

    Reset() {
        this.finished = false;
        this.solving = false;

        this.vertices = null;
        this.graph = null;
        this.solution = null;
    }

    Solve(maze) {
        this.Reset();

        // The algorithm used for maze solving
        let algo = this.SolveJon;
        
        this.solving = true;
        algo.call(this, maze).then(() => {
            this.finished = true;
            this.solving = false;
            console.log("Solver finished.");
        });
    }

    async SolveJon(maze) {
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
        this.graph = new Graph();
        // Holds cells at graph vertices
        let vertices = [];

        // Determine vertices
        for(let y = 0; y < maze.height; y++){
            for(let x = 0; x < maze.width; x++) {
                let cell = maze.cells[y][x];
                if(IsVertex(cell)) {
                    cell.isVertex = true;
                    vertices.push(cell);
                    this.graph.AddNode(cell);
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
                        this.graph.ConnectNodes(cell, currentCell);
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
                        this.graph.ConnectNodes(cell, currentCell);
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

        // Find shortest path from startCell to goalCell
        //maze.solution = [];
        
        this.graph.BFS(this.graph.GetNode(maze.startCell), this.graph.GetNode(maze.goalCell), (path) => {
            this.solution = path;
        });

    }


}