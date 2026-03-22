// Module imports
import { saveToStorage } from "./saveToStorageController.js";

// Default projects on load 
const DEFAULT_PROJECTS = [
    {
        id: "a1b2c3d4-0001-0000-0000-000000000000",
        type: "project",
        name: "Gym",
        colour: "#F10102",
    },
    {
        id: "a1b2c3d4-0002-0000-0000-000000000000",
        type: "project",
        name: "Study",
        colour: "#0228F5",
    },
    {
        id: "a1b2c3d4-0003-0000-0000-000000000000",
        type: "project",
        name: "Garden",
        colour: "#03B306",
    },
    {
        id: "a1b2c3d4-0004-0000-0000-000000000000",
        type: "project",
        name: "Errands",
        colour: "#F77908",
    },
]

// Save default projects to local storage if not already
export const defaultProjects = {
    init() {
        const alreadySeeded = localStorage.getItem("defaultProjectsSeeded");
        if (alreadySeeded) return;

        DEFAULT_PROJECTS.forEach(project => saveToStorage(project));
        localStorage.setItem("defaultProjectsSeeded", true);
    }
}

// Project factory function
function createProjectObj(name, colour) {
    return {
        id: crypto.randomUUID(),
        type: "project",
        name: name,
        colour: colour,
    };
}

export function createProject(data) {
    const name = data.projectName;
    const colour = data.projectColour;

    const project = createProjectObj(name, colour);
    saveToStorage(project);
}