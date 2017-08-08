import { BiasFunctions, Generators } from "./maze/maze-generator.js";
import { Solvers } from "./maze/maze-solver.js";

function propertyNameOfItemInObject(obj, item) {
    return Object.getOwnPropertyNames(obj)[Object.values(obj).indexOf(item)];
}

export class GUI {

    static Init(maze, container) {
        var control = require('control-panel');

        var panel = control([
            {type: 'button', label: 'Generate', action: () => { maze.Generate(); }},
            {type: 'button', label: 'Solve', action: () => { maze.Solve(); }},
            {type: 'button', label: 'Poke Holes', action: () => { maze.PokeHoles(); }},

            {type: 'checkbox', label: 'Wait', initial: maze.wait},
            {type: 'range', label: 'Loop Delay', min: 0, max: 200, initial: maze.waitMS, step: 1},
            {type: 'range', label: 'Reps Per Loop', min: 1, max: 200, initial: maze.repsPerLoop, step:1},

            {type: 'select', label: 'Generator', options: Object.getOwnPropertyNames(Generators), initial: propertyNameOfItemInObject(Generators, maze.generator.generatorFunction)},
            {type: 'select', label: 'Bias', options: Object.getOwnPropertyNames(BiasFunctions), initial: propertyNameOfItemInObject(BiasFunctions, maze.generator.biasFunction)},
            {type: 'select', label: 'Solver', options: Object.getOwnPropertyNames(Solvers), initial: propertyNameOfItemInObject(Solvers, maze.solver.solverFunction)},
            
        ], 
        {
            title: "Mazer", 
            theme: 'dark', 
            root: container,
            insertAboveRoot: true,
            position: 'top-right',
            opacity: "0.95",
            useMenuBar: true
        }
        );

        panel.box.style.opacity = "1.0";

        panel.on('input', (data) => {
            maze.wait = data["Wait"];
            maze.waitMS = data["Loop Delay"];
            maze.repsPerLoop = data["Reps Per Loop"];
            maze.generator.generatorFunction = Generators[data["Generator"]];
            maze.generator.biasFunction = BiasFunctions[data["Bias"]];
            maze.solver.solverFunction = Solvers[data["Solver"]];
        });
    }

    /**
     * Creates and attaches a GUI to the page if DAT.GUI is included.
     */
    static InitDatGUI(maze){
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