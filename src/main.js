//import "babel-polyfill";
require("babel-polyfill");
import { Maze } from "./maze/maze.js";
import { gui } from "./gui.js";

import paper from "paper";

class Main {
    constructor() {
        let container = document.getElementById('mazer-container');

        if(!container) throw "No mazer-container found!";

        // Make the canvas that Paper will use for rendering
        let canvas = container.appendChild(document.createElement("canvas"));
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        // Setup directly from canvas id:
        paper.setup(canvas);

        canvas.style.width = "100%";
        canvas.style.height = "100%";

        // Make background
        let rect = new Path.Rectangle({
            point: [0, 0],
            size: [view.size.width, view.size.height],
            strokeColor: "white"
        });
        rect.sendToBack();
        rect.fillColor = "white";

        this.maze = new Maze(32, 32);
        gui.Init(this.maze, container);

        // Render the maze every n frames
        let renderAfterNFrames = 2;
        view.onFrame = (event) => {
            if(event.count % renderAfterNFrames == 0) {
                this.Draw(event);
            }
        }
    }

    Draw(event) {
        this.maze.Draw(event);
    }

}

if (document.readyState === 'complete') {
    paper.install(window);
    new Main();
} else {
    window.onload = () => {
        paper.install(window);
        new Main();
    }
}