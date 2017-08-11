import { MazeGenerator } from "./maze-generator.js";
import { MazeSolver } from "./maze-solver.js";
import { Cell } from "./cell.js";
import { gui } from "../gui.js";


export class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [[]];

        this.group = new Group();

        this.drawVertexConnections = false;

        this.solving = false;

        // Compound path that holds each cell's path object. Fairly large speedup.
        this.mazePath = new CompoundPath({
            strokeColor: "black",
            strokeWidth: 1,
            strokeCap: "round"
        });

        this.generator = new MazeGenerator();
        this.solver = new MazeSolver();
        this.solver.group.insertAbove(this.group);

        this.wait = true;
        this.waitMS = 30;
        this.repsPerLoop = 1;

        this.Generate();
        //this.Solve();

        this.redrawAll = true;

        // Make border
        let border = new Path({
            strokeColor: "black",
            strokeWidth: 1
        })
        border.moveTo(0, 0);
        border.lineTo(view.size.width, 0);
        border.lineTo(view.size.width, view.size.height);
        border.lineTo(0, view.size.height);
        border.lineTo(0, 0);
        border.bringToFront();


    }

    Draw(event) {
        if(this.redrawAll) {
            console.log("Redrawing all");
        }

        // Draw each cell if dirty or forced
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++) {
                let cell = this.cells[y][x];

                if(cell.drawing.dirty || this.redrawAll) {
                    if(cell == this.startCell) cell.SetDrawOption("fillColor", new Color(0, 1.0, 0));
                    if(cell == this.goalCell) cell.SetDrawOption("fillColor", new Color(1.0, 0, 0));
                    cell.Draw(event);
                }
            }
        }

        if(this.solver.dirty || this.redrawAll) {
            this.solver.Draw(event);
        }



        // Do last
        this.redrawAll = false;
    }

    GetRandomCell(){
        return this.cells[Math.floor(Math.random() * this.height)][Math.floor(Math.random() * this.width)];
    }

    PokeHoles(numHoles = 200) {
        for(let i = 0; i < numHoles; i++) {

            let cellA = this.GetRandomCell();
            let neighbors = this.GetNeighbors(cellA);
            let cellB = neighbors[Math.floor(Math.random() * neighbors.length)];

            this.Connect(cellA, cellB);
        }
        this.redrawAll = true;
    }

    GetNeighbors(cell) {
        let x = cell.position.x;
        let y = cell.position.y;
        let neighbors = [];

        let RegisterCell = (x, y) => {
            if (x >= 0 && y >= 0 && x < this.width && y < this.width) {
                 neighbors.push(this.cells[y][x]);
            }
        }

        RegisterCell (x, y - 1);
        RegisterCell (x, y + 1);
        RegisterCell (x - 1, y);
        RegisterCell (x + 1, y);

        return neighbors;
    }

    // Remove the walls between the two given cells
    Connect(cellA, cellB) {
        if (Math.abs(cellA.position.x - cellB.position.x) > 1 || Math.abs(cellA.position.y - cellB.position.y) > 1) {
            console.error("Cells are not adjacent.");
            return;
        }

        // B is left of A
        if(cellB.position.x < cellA.position.x) {
            cellB.walls.right = false;
            cellA.walls.left = false;
        }

        // B is right of A
        if(cellB.position.x > cellA.position.x) {
            cellB.walls.left = false;
            cellA.walls.right = false;
        }

        // B is above A
        if(cellB.position.y < cellA.position.y) {
            cellB.walls.bottom = false;
            cellA.walls.top = false;
        }

        // B is below A
        if(cellB.position.y > cellA.position.y) {
            cellB.walls.top = false;
            cellA.walls.bottom = false;
        }

        cellA.drawing.dirty = true;
        cellB.drawing.dirty = true;
    }

    Reset() {
        this.GenerateCells();
        this.solver.Reset();
        this.generator.Reset();
        this.redrawAll = true;
    }

    /**
     * Creates `this.cells`, a 2D array of Cell objects.
     */
    GenerateCells() {
        this.group.removeChildren();
        this.mazePath.removeChildren();

        this.cells = [this.height];
        for(let y = 0; y < this.height; y++){
            this.cells[y] = [];
            for(let x = 0; x < this.width; x++) {
                this.cells[y][x] = new Cell(x, y, this);
                this.group.addChild(this.cells[y][x].group);
                //this.cells[y][x].dirty = true;
            }
        }
    }

    Generate() {
        if(this.solver.solving) {
            gui.Toast("Wait for the solver to finish first!");
            return;
        }
        
        this.Reset();

        this.startCell = this.cells[0][0];

        // Pick a random cell for the goal, repeating if we chose the start cell.
        this.goalCell = this.GetRandomCell();
        while(this.goalCell == this.startCell) {
            this.goalCell = this.GetRandomCell();
        }

        //this.goalCell = this.cells[this.height - 1][this.width - 1];

        this.generator.Generate(this); 
    }

    Solve() {
        if(!this.generator.finished) {
            gui.Toast("Wait for generation to finish first!");
            return;
        }
        if(this.solver.solving) {
            gui.Toast("Wait for the solver to finish first!");
            return;
        }

        this.solver.Solve(this);
    }



}