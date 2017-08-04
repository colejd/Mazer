import { BiasFunctions, Generators } from "./maze/maze-generator.js";
import { Solvers } from "./maze/maze-solver.js";

export class GUI {

    /**
     * Creates and attaches a GUI to the page if DAT.GUI is included.
     */
    static Init(mazer){
        if(typeof(dat) === "undefined"){
            console.warn("No DAT.GUI instance found. Import on this page to use!");
            return;
        }

        let gui = new dat.GUI();

        gui.add(mazer.maze, "Generate");
        gui.add(mazer.maze, "Solve");
        gui.add(mazer.maze, "PokeHoles");

        gui.add(mazer.maze, "drawVertexConnections");
        gui.add(mazer.maze, "wait");
        //gui.add(mazer.maze, "waitMS").min(0).max(200).step(1);
        gui.add(mazer.maze, "repsPerLoop").min(1).max(200).step(1).name("repsPerWait");

        function propertyNameOfItemInObject(obj, item) {
            return Object.getOwnPropertyNames(obj)[Object.values(obj).indexOf(item)];
        }

        // Generator function selector
        this.generatorFunctionName = propertyNameOfItemInObject(Generators, mazer.maze.generator.generatorFunction);
        gui.add(this, 'generatorFunctionName', Object.getOwnPropertyNames(Generators)).onChange(() => {
            mazer.maze.generator.generatorFunction = Generators[this.generatorFunctionName];
        }).name("Generator Function").listen();

        // Bias function selector
        this.biasFunctionName = propertyNameOfItemInObject(BiasFunctions, mazer.maze.generator.biasFunction);
        gui.add(this, 'biasFunctionName', Object.getOwnPropertyNames(BiasFunctions)).onChange(() => {
            mazer.maze.generator.biasFunction = BiasFunctions[this.biasFunctionName];
        }).name("Bias Function").listen();

        // Solver function selector
        this.solverFunctionName = propertyNameOfItemInObject(Solvers, mazer.maze.solver.solverFunction);
        gui.add(this, 'solverFunctionName', Object.getOwnPropertyNames(Solvers)).onChange(() => {
            mazer.maze.solver.solverFunction = Solvers[this.solverFunctionName];
        }).name("Solver Function").listen();
    }

}