import { Maze } from "./maze/maze.js";

export class Mazer {
    constructor() {
        this.maze = new Maze(48, 48);
    }

    Setup() {
        //let canvas = p.createCanvas(width, height);
        //canvas.parent("mazer-container");
    }

    Draw(event) {

        // Redraw dirty maze elements
        this.maze.Draw(event);
    }

    
}