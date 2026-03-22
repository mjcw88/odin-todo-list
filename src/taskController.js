// Module imports
import { storageAvailable } from "./storageAvailable.js";
import { compareAsc, format } from "date-fns";

// Task array
const myTasks = [];

// Task factory function
function createTaskObj({ name, desc, dueDate, priority, project }) {
    return {
        id: crypto.randomUUID(),
        name,
        desc,
        dueDate,
        priority,
        project,
        complete: false,
    };
}

export function createTask(data) {
    const name = data.taskName;
    const desc = data.taskDescription;
    const dueDate = new Date(data.date);
    const priority = parseInt(data.priority);
    let project;
    if (data.project === "home") {
        project = null;
    } else {
        project = data.project;
    }

    const task = createTaskObj(name, desc, dueDate, priority, project);
    myTasks.push(task);
}


//    if (storageAvailable("localStorage")) {
//        localStorage.setItem("newForm", JSON.stringify(data));
//    } else {
//        console.error("localStorage unavailable");
//        return;
//    }