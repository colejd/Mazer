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
        rect.sendToBack();
        rect.fillColor = "white";

        this.maze = new Maze(16, 16);
        GUI.Init(this.maze);

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