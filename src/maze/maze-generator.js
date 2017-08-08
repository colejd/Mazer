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

        console.log("Generator started...");
        this.generatorFunction.call(this, maze).then(() => {
            this.generating = false;
            this.finished = true;
            console.log("Generator finished.");
        });
    }

}

export let Generators = {

    Prim: async function(maze) {
        let active = [maze.startCell];
        maze.startCell.linked = true;

        let reps = 0;
        while(active.length > 0) {

            let current = lambda(active, this.biasFunction)[0];
            let neighbors = maze.GetNeighbors(current).filter(item => item.linked !== true);

            if(neighbors.length > 0) {
                let neighbor = lambda(neighbors, this.biasFunction)[0];

                // Connect the frontier cell to the neighboring maze cell
                maze.Connect(current, neighbor);

                active.push(neighbor);

                neighbor.linked = true;

                current.SetDrawOption("fillColor", "orange");
                neighbor.SetDrawOption("fillColor", "yellow");
            }
            else {
                // remove current from active
                active = active.filter(item => item !== current);

                current.SetDrawOption("fillColor", "white");
            }

            // Timing stuff
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

        let stack = [maze.startCell];
        maze.startCell.visited = true;

        let reps = 0;
        while (stack.length > 0) {
            let current = stack[stack.length - 1];

            // Get unvisited neighbors of the current cell
            let neighbors = maze.GetNeighbors(current).filter(item => !item.visited);

            if (neighbors.length == 0) {
                // Backtrack
                current.SetDrawOption("fillColor", "white");
                stack.pop();
            }

            else {
                // Chooose a neighbor of the current cell (using bias function) that has not been visited
                let neighbor = lambda(neighbors, this.biasFunction)[0];

                // Connect the current cell to the neighbor
                maze.Connect(current, neighbor);

                // Push the neighbor to the stack
                stack.push(neighbor);

                // Mark the neighbor as visited
                neighbor.visited = true;

                current.SetDrawOption("fillColor", "orange");
                neighbor.SetDrawOption("fillColor", "yellow");
            }

            // Control timing for each loop
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
        return noise.noise2D((obj.position.x) / 25, (obj.position.y) / 25);
    },

    Weird: function(obj) {
        let n = 4;
        return (obj.position.x * obj.position.y) % (n + obj.position.x);
    },
}