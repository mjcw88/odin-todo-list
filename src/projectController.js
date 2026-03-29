// Module imports
import { saveToStorage } from "./storageController.js";

const now = new Date();

// Default projects on load 
const DEFAULT_PROJECTS = [
    {
        id: "a1b2c3d4-0000-0000-0000-000000000000",
        type: "project",
        name: "Gym",
        colour: "#F10102",
        dateCreated: new Date(now),
    },
    {
        id: "a1b2c3d4-0001-0000-0000-000000000000",
        type: "project",
        name: "Study",
        colour: "#0228F5",
        dateCreated: new Date(now.getTime() + 1000),
    },
    {
        id: "a1b2c3d4-0002-0000-0000-000000000000",
        type: "project",
        name: "Garden",
        colour: "#03B306",
        dateCreated: new Date(now.getTime() + 2000),
    },
    {
        id: "a1b2c3d4-0003-0000-0000-000000000000",
        type: "project",
        name: "Holiday",
        colour: "#F77908",
        dateCreated: new Date(now.getTime() + 3000),
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
function createProjectObj(id, name, colour, dateCreated) {
    return {
        id: id,
        type: "project",
        name: name,
        colour: colour,
        dateCreated: dateCreated,
    };
}

export function createProject(data) {
    const id = crypto.randomUUID();
    const name = data.projectName;
    const colour = data.projectColour;
    const dateCreated = new Date();

    const project = createProjectObj(id, name, colour, dateCreated);
    
    saveToStorage(project);
}