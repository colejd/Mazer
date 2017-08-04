import { Maze } from "./maze/maze.js";

export class Mazer {
    constructor() {
        this.maze = new Maze(48, 48);
    }

    Setup(width, height) {
        let canvas = p.createCanvas(width, height);
        canvas.parent("mazer-container");
    }

    Draw() {
        // Draw background (once)
        //if(!this.firstDraw || this.maze.generator.generating){
            p.background(255);
            //this.firstDraw = true;
        //}

        // Draw maze
        this.maze.Draw();

        // Draw FPS
        p.strokeWeight(3);
        p.fill(255);
        p.stroke(0);
        p.text("FPS: " + p.frameRate().toFixed(2), 10, p.height - 10);
    }

    
}