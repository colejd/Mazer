import "babel-polyfill";
import { Maze } from "./maze/maze.js";
import { GUI } from "./gui.js";

import paper from "paper";

window.onload = () => {
    paper.install(window);

    new Main();

}

class Main {
    constructor() {
        // Setup directly from canvas id:
        paper.setup("mazer-container");

        // Make background
        var rect = new Path.Rectangle({
            point: [0, 0],
            size: [view.size.width, view.size.height],
            strokeColor: "white"
        });
        //rect.sendToBack();
        rect.fillColor = "white";

        this.maze = new Maze(32, 32);
        GUI.Init(this.maze);

        this.frameAccum = 0;

        view.onFrame = (event) => {
            this.Draw(event);
        }
    }

    Draw(event) {

        if(this.frameAccum == 2) {
            this.maze.Draw(event);
            this.frameAccum = 0;
        }

        this.frameAccum += 1;
    }

}