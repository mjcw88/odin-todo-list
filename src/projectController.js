// Module imports
import { saveToStorage } from "./storageController.js";

// Default projects IIFE
const DEFAULT_PROJECTS = (() => {
    const now = new Date();
    return [
        {
            id: "a1b2c3d4-0000-0000-0000-000000000000",
            type: "project",
            name: "Gym",
            colour: [5.6, 68.4, 89.6],
            dateCreated: now,
        },
        {
            id: "a1b2c3d4-0001-0000-0000-000000000000",
            type: "project",
            name: "Study",
            colour: [224.4, 61.6, 83.9],
            dateCreated: new Date(now.getTime() + 1000),
        },
        {
            id: "a1b2c3d4-0002-0000-0000-000000000000",
            type: "project",
            name: "Garden",
            colour: [132, 52.5, 75.5],
            dateCreated: new Date(now.getTime() + 2000),
        },
        {
            id: "a1b2c3d4-0003-0000-0000-000000000000",
            type: "project",
            name: "Holiday",
            colour: null,
            dateCreated: new Date(now.getTime() + 3000),
        },
    ];
})();

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
    const id = data.projectId === "" ? crypto.randomUUID() : data.projectId;
    const name = data.projectName.trim();
    const colour = data.projectColour === "null" ? null : data.projectColour.split(",");
    const dateCreated = data.dateCreated === "" ? new Date() : new Date(data.dateCreated);

    const project = createProjectObj(id, name, colour, dateCreated);
    
    saveToStorage(project);

    return project;
}