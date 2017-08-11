import { BiasFunctions, Generators } from "./maze/maze-generator.js";
import { Solvers } from "./maze/maze-solver.js";
//let guify = require("guify");
import {GUI as guify} from "guify";

function propertyNameOfItemInObject(obj, item) {
    return Object.getOwnPropertyNames(obj)[Object.values(obj).indexOf(item)];
}

class GUI {

    Init(maze, container) {

        this.panel = new guify({
            title: "Mazer", 
            theme: 'dark', 
            root: container,
            barMode: "offset",
            align: 'right',
            opacity: "0.95",
            useMenuBar: true
        }, []);

        // this.panel.Register({
        //     type: 'button', label: 'Generate', action: () => { maze.Generate(); }
        // })
        // this.panel.Register({
        //     type: 'button', label: 'Solve', action: () => { maze.Solve(); }
        // })
        // this.panel.Register({
        //     type: 'button', label: 'Poke Holes', action: () => { maze.PokeHoles(); }
        // })

        // this.panel.RegisterVariable(maze, "wait", {
        //     type: 'checkbox', label: 'Wait'
        // });
        // this.panel.RegisterVariable(maze, "waitMS", {
        //     type: 'range', label: 'Loop Delay', min: 0, max: 200, step: 1
        // })
        // this.panel.RegisterVariable(maze, "repsPerLoop", {
        //     type: 'range', label: 'Reps Per Loop', min: 1, max: 200, step:1,
        // })
        // this.panel.Register({
        //     type: 'select', 
        //     label: 'Generator', 
        //     options: Object.getOwnPropertyNames(Generators), 
        //     initial: propertyNameOfItemInObject(Generators, maze.generator.generatorFunction),
        //     onChange: (data) => {
        //         maze.generator.generatorFunction = Generators[data];
        //     }
        // })
        // this.panel.Register({
        //     type: 'select', 
        //     label: 'Bias', 
        //     options: Object.getOwnPropertyNames(BiasFunctions), 
        //     initial: propertyNameOfItemInObject(BiasFunctions, maze.generator.biasFunction),
        //     onChange: (data) => {
        //         maze.generator.biasFunction = BiasFunctions[data];
        //     }
        // })
        // this.panel.Register({
        //     type: 'select', 
        //     label: 'Solver', 
        //     options: Object.getOwnPropertyNames(Solvers), 
        //     initial: propertyNameOfItemInObject(Solvers, maze.solver.solverFunction),
        //     onChange: (data) => {
        //         maze.solver.solverFunction = Solvers[data];
        //     }
        // })

    }

    Toast(message) {
        this.panel.Toast(message);
    }

}

// Export "singleton" instance
export let gui = new GUI();