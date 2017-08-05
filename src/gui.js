import { BiasFunctions, Generators } from "./maze/maze-generator.js";
import { Solvers } from "./maze/maze-solver.js";

export class GUI {

    /**
     * Creates and attaches a GUI to the page if DAT.GUI is included.
     */
    static Init(maze){
        if(typeof(dat) === "undefined"){
            console.warn("No DAT.GUI instance found. Import on this page to use!");
            return;
        }

        let gui = new dat.GUI();

        gui.add(maze, "Generate");
        gui.add(maze, "Solve");
        gui.add(maze, "PokeHoles");

        gui.add(maze, "drawVertexConnections");
        gui.add(maze, "wait");
        gui.add(maze, "waitMS").min(0).max(1000).step(1);
        gui.add(maze, "repsPerLoop").min(1).max(200).step(1).name("repsPerWait");

        function propertyNameOfItemInObject(obj, item) {
            return Object.getOwnPropertyNames(obj)[Object.values(obj).indexOf(item)];
        }

        // Generator function selector
        this.generatorFunctionName = propertyNameOfItemInObject(Generators, maze.generator.generatorFunction);
        gui.add(this, 'generatorFunctionName', Object.getOwnPropertyNames(Generators)).onChange(() => {
            maze.generator.generatorFunction = Generators[this.generatorFunctionName];
        }).name("Generator Function").listen();

        // Bias function selector
        this.biasFunctionName = propertyNameOfItemInObject(BiasFunctions, maze.generator.biasFunction);
        gui.add(this, 'biasFunctionName', Object.getOwnPropertyNames(BiasFunctions)).onChange(() => {
            maze.generator.biasFunction = BiasFunctions[this.biasFunctionName];
        }).name("Bias Function").listen();

        // Solver function selector
        this.solverFunctionName = propertyNameOfItemInObject(Solvers, maze.solver.solverFunction);
        gui.add(this, 'solverFunctionName', Object.getOwnPropertyNames(Solvers)).onChange(() => {
            maze.solver.solverFunction = Solvers[this.solverFunctionName];
        }).name("Solver Function").listen();


    }

}