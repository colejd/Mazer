import { lambda } from "../utils/lambda.js";
import { timeout } from "../utils/async.js";
var SimplexNoise = require('simplex-noise');
let noise = new SimplexNoise(Math.random);

export class MazeGenerator {
    constructor() {
        this.biasFunction = BiasFunctions.Random;
        this.generatorFunction = Generators.Backtrack;
    }

    Reset() {
        this.generating = false;
        this.finished = false;
    }


    Generate(maze) {
        this.Reset();

        this.generating = true;

        this.generatorFunction.call(this, maze).then(() => {
            this.generating = false;
            this.finished = true;
            console.log("Generator finished.");
        });
    }

}

export let Generators = {
    Prim: async function(maze) {
        let frontier = [];

        let initialCell = maze.GetRandomCell();
        initialCell.inMaze = true;
        for (let neighbor of maze.GetNeighbors(initialCell)) {
            frontier.push(neighbor);
            neighbor.inFrontier = true;
        }


        let GetNeighborInMaze = (cell) => {
            let neighbors = maze.GetNeighbors(cell);
            let mazeNeighbors = neighbors.filter(item => item.inMaze === true);
            // Pick the neighbor (if multiple) using the bias function
            return lambda(mazeNeighbors, this.biasFunction)[0];
        }

        let reps = 0;
        while(frontier.length > 0) {
            // Get a random cell from the frontier
            let frontierCell = frontier[Math.random() * frontier.length | 0];
            let neighboringMazeCell = GetNeighborInMaze(frontierCell);

            // Connect the frontier cell to the neighboring maze cell
            maze.Connect(frontierCell, neighboringMazeCell);

            // Mark the frontier cell as part of the maze
            frontierCell.inMaze = true;

            // Remove the cell from the frontier
            frontier = frontier.filter(item => item !== frontierCell);

            // Add the frontier cell's non-maze neighbors to the frontier
            let nonMazeNeighbors = maze.GetNeighbors(frontierCell).filter(item => !item.inMaze && !item.inFrontier);
            for (let neighbor of nonMazeNeighbors) {
                frontier.push(neighbor);
            }

            reps += 1;
            if(maze.wait && reps >= maze.repsPerLoop){
                await timeout(maze.waitMS);
                reps = 0;
            }
        }


    },

    /**
     * Maze generation using recursive backtracking method
     */
    Backtrack: async function(maze) {

        let stack = [];

        let cellsExplored = 1;

        let initialCell = maze.cells[0][0];
        initialCell.visited = true;
        let currentCell = initialCell;
        initialCell.activeStyle = true;

        let reps = 0;
        while (cellsExplored < maze.width * maze.height) {
            // Get unvisited neighbors of the current cell
            let neighbors = maze.GetNeighbors(currentCell).filter(item => !item.visited);

            // If the current cell has unexplored neighbors, pick one and connect to it
            if(neighbors.length > 0) {
                // If the current cell has more than one neighbor, put it back on the stack
                // TODO: Not a great fix. Where cells used to be left orange, they now get processed twice
                if(neighbors.length > 1) stack.push(currentCell);

                currentCell.SetDrawOption("fillColor", "orange");
                // Chooose a neighbor of the current cell (using bias function) that has not been visited
                let randomNeighbor = lambda(neighbors, this.biasFunction)[0];
                // Push the neighbor to the stack
                stack.push(randomNeighbor);

                // Connect the current cell to the neighbor
                maze.Connect(currentCell, randomNeighbor);
                // Mark the neighbor as visited
                randomNeighbor.visited = true;
                randomNeighbor.activeStyle = true;
                    
                cellsExplored += 1;
                // Make the neighbor the current cell
                currentCell = randomNeighbor;

                currentCell.SetDrawOption("fillColor", "yellow");
            }
            // Otherwise backtrack (will continue until reaching a cell with neighbors to explore)
            else if (stack.length > 0) {
                // Pop a cell from the stack and make it the current cell
                currentCell.SetDrawOption("fillColor", "white");
                currentCell = stack.pop();
                
                currentCell.SetDrawOption("fillColor", "yellow");
            }

            reps += 1;
            if(reps >= maze.repsPerLoop && maze.wait){
                await timeout(maze.waitMS);
                reps = 0;
            }

        }

        // Walk the stack backward marking everything white (just for visuals)
        for(let i = stack.length - 1; i >= 0; i--) {
            stack[i].SetDrawOption("fillColor", "white");

            reps += 1;
            if(reps >= maze.repsPerLoop && maze.wait){
                await timeout(maze.waitMS);
                reps = 0;
            }
        }

        maze.redrawAll = true;

    },

    // HuntAndKill: async function(maze) {
    //     /*
    //     1. Choose a starting location.
    //     2. Perform a random walk, carving passages to unvisited neighbors, until 
    //         the current cell has no unvisited neighbors.
    //     3. Enter “hunt” mode, where you scan the grid looking for an unvisited cell 
    //         that is adjacent to a visited cell. If found, carve a passage between the 
    //         two and let the formerly unvisited cell be the new starting location.
    //     4. Repeat steps 2 and 3 until the hunt mode scans the entire grid and finds no unvisited cells.
    //     */
    // },

}

export let BiasFunctions = {
    Random: function(obj) {
        return Math.random();
    },

    Sin: function(obj) {
        return (Math.random() * 2) * Math.sin(obj.position.x / 10) + obj.position.x;
    },

    Checker: function(obj) {
        let n = 2;
        return (obj.position.x * obj.position.y) % n + obj.position.y;
    },

    Noise: function(obj) {
        return noise.noise2D((obj.position.x + (Math.random() * 100)) / 100, (obj.position.y + (Math.random() * 100)) / 100);
    },

    Weird: function(obj) {
        let n = 4;
        return (obj.position.x * obj.position.y) % (n + obj.position.x);
    },
}