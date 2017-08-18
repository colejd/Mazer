import { BiasFunctions, Generators } from "./maze/maze-generator.js";
import { Solvers } from "./maze/maze-solver.js";

function propertyNameOfItemInObject(obj, item) {
    return Object.getOwnPropertyNames(obj)[Object.values(obj).indexOf(item)];
}

class GUI {

    Init(maze, container) {

        if(!guify) {
            console.log("Guify was not found! Include it on the page to show the GUI for this program.");
        }
        
        this.panel = new guify.GUI({
            title: 'Mazer', 
            theme: 'dark', 
            root: container,
            barMode: 'above',
            align: 'right',
            opacity: 0.95,
        });

        this.panel.Register([
            { type: 'button', label: 'Generate', action: () => { maze.Generate(); } },
            { type: 'button', label: 'Solve', action: () => { maze.Solve(); } },
            { type: 'button', label: 'Poke Holes', action: () => { maze.PokeHoles(); } },
        ])

        this.panel.Register({
            type: 'checkbox', label: 'Wait',
            object: maze, property: "wait"
        });
        this.panel.Register({
            type: 'range', label: 'Loop Delay', 
            min: 0, max: 200, step: 1,
            object: maze, property: "waitMS"
        })
        this.panel.Register({
            type: 'range', label: 'Reps Per Loop', 
            min: 1, max: 200, step:1,
            object: maze, property: "repsPerLoop"
        })
        
        this.panel.Register({
            type: 'select', 
            label: 'Generator', 
            options: Object.getOwnPropertyNames(Generators), 
            initial: propertyNameOfItemInObject(Generators, maze.generator.generatorFunction),
            onChange: (data) => {
                maze.generator.generatorFunction = Generators[data];
            }
        })
        this.panel.Register({
            type: 'select', 
            label: 'Bias', 
            options: Object.getOwnPropertyNames(BiasFunctions), 
            initial: propertyNameOfItemInObject(BiasFunctions, maze.generator.biasFunction),
            onChange: (data) => {
                maze.generator.biasFunction = BiasFunctions[data];
            }
        })
        this.panel.Register({
            type: 'select', 
            label: 'Solver', 
            options: Object.getOwnPropertyNames(Solvers), 
            initial: propertyNameOfItemInObject(Solvers, maze.solver.solverFunction),
            onChange: (data) => {
                maze.solver.solverFunction = Solvers[data];
            }
        })

    }

}

// Export "singleton" instance
export let gui = new GUI();