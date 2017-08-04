import { MazeGenerator } from "./maze-generator.js";
import { MazeSolver } from "./maze-solver.js";
import { Cell } from "./cell.js";


export class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [[]];

        this.drawVertexConnections = false;

        this.solving = false;

        this.generator = new MazeGenerator();
        this.solver = new MazeSolver();

        this.wait = true;
        this.waitMS = 0;
        this.repsPerLoop = 60;

        this.Generate();
        //this.Solve();

    }

    Draw() {

        // Draw each cell
        let cellWidth = p.width / this.width;
        let cellHeight = p.height / this.height;

        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++) {
                let cell = this.cells[y][x];

                let options = {
                    width: cellWidth,
                    height: cellHeight,
                }

                // Add optional properties
                if(cell == this.startCell) options.fill = [0, 255, 0];
                if(cell == this.goalCell) options.fill = [255, 0, 0];

                //if(cell.dirty || this.generator.generating)
                    cell.Draw(options);
            }
        }

        // Draw connected vertices
        if(this.solver.graph && this.drawVertexConnections) {
            p.stroke(0, 0, 255, 20);
            p.strokeWeight(1);

            for(let node of this.solver.graph.GetNodes()) {
                for(let neighbor of node.GetNeighbors()) {
                    let offset = -0.5;
                    let x1 = (node.val.position.x * cellWidth) + (cellWidth * 0.5) + offset;
                    let y1 = (node.val.position.y * cellHeight) + (cellHeight * 0.5) + offset;
                    let x2 = (neighbor.val.position.x * cellWidth) + (cellWidth * 0.5) + offset;
                    let y2 = (neighbor.val.position.y * cellHeight) + (cellHeight * 0.5) + offset;
                    p.line(x1, y1, x2, y2);
                }
            }
        }

        // Draw solution
        if(this.solver.solution) {
            p.stroke(0, 0, 255);
            p.strokeCap(p.ROUND);
            p.strokeWeight(3);
            for(let i = 0; i < this.solver.solution.length; i++) {
                let current = this.solver.solution[i];
                let next = this.solver.solution[i + 1];

                if(next) {
                    let offset = -0.5;
                    let x1 = (current.val.position.x * cellWidth) + (cellWidth * 0.5) + offset;
                    let y1 = (current.val.position.y * cellHeight) + (cellHeight * 0.5) + offset;
                    let x2 = (next.val.position.x * cellWidth) + (cellWidth * 0.5) + offset;
                    let y2 = (next.val.position.y * cellHeight) + (cellHeight * 0.5) + offset;
                    p.line(x1, y1, x2, y2);
                }

            }
            p.strokeWeight(1);
        }

        // Draw border
        p.strokeWeight(1);
        p.stroke(0, 0, 0, 255);
        p.fill(0, 0, 0, 0);
        p.rect(0, 0, p.width, p.height);

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
    }

    Reset() {
        this.GenerateCells();
        this.solver.Reset();
        this.generator.Reset();
        //this.MarkAllDirty();
    }

    /**
     * Creates `this.cells`, a 2D array of Cell objects.
     */
    GenerateCells() {
        this.cells = [this.height];
        for(let y = 0; y < this.height; y++){
            this.cells[y] = [];
            for(let x = 0; x < this.width; x++) {
                this.cells[y][x] = new Cell(x, y);
                this.cells[y][x].dirty = true;
            }
        }
    }

    Generate() {
        if(this.solver.solving) {
            console.warn("Wait for the solver to finish first!");
            return;
        }
        if(this.generator.generating) {
            console.warn("Wait for generation to finish first!");
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
            console.warn("Wait for generation to finish first!");
            return;
        }
        if(this.solver.solving) {
            console.warn("Wait for the solver to finish first!");
            return;
        }

        this.solver.Solve(this);
    }



}