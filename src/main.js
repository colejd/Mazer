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
        var container = document.getElementById('mazer-container');

        // Make the canvas that Paper will use for rendering
        var canvas = document.createElement("canvas");
        container.appendChild(canvas);

        canvas.style.position = "absolute";
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        // Setup directly from canvas id:
        paper.setup(canvas);

        // Make background
        var rect = new Path.Rectangle({
            point: [0, 0],
            size: [view.size.width, view.size.height],
            strokeColor: "white"
        });
        rect.sendToBack();
        rect.fillColor = "white";

        this.maze = new Maze(32, 32);
        GUI.Init(this.maze, container);

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