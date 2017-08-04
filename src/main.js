import p5 from "p5";
import { Mazer } from "./mazer.js";
import { GUI } from "./gui.js";

let container = document.getElementById("mazer-container");

if (!container) {
    throw "No object with ID 'mazer-container' found.";
}

new p5((p) => {
    // Make p global 
    // TODO: This is bad. Find some other way to do this.
    window.p = p;

    let mazer = new Mazer();

    p.setup = function () {
        //p.noSmooth();
        mazer.Setup(container.offsetWidth, container.offsetHeight);
        GUI.Init(mazer);
    }

    p.draw = function () {
        mazer.Draw();
    }
});