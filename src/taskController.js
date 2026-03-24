// Module imports
import { saveToStorage } from "./storageController.js";

const now = new Date();

// defaultDates IIFE
const defaultDates = (() => {
    const dates = {};

    // Dynmically creates a date one year from today
    const oneYearFromToday = new Date(new Date().setDate(new Date().getDate() + 365));
    oneYearFromToday.setUTCHours(0, 0, 0, 0);
    dates.year = oneYearFromToday;

    // Dynamically creates a date six months from today
    const sixMonthsFromToday = new Date(new Date().setDate(new Date().getDate() + 180));
    sixMonthsFromToday.setUTCHours(0, 0, 0, 0);
    dates.sixMonths = sixMonthsFromToday;

    // Dynamically creates a date one month from today
    const oneMonthFromToday = new Date(new Date().setDate(new Date().getDate() + 30));
    oneMonthFromToday.setUTCHours(0, 0, 0, 0);
    dates.month = oneMonthFromToday;

    // Dynamically creates a date one week from today
    const oneWeekFromToday = new Date(new Date().setDate(new Date().getDate() + 7));
    oneWeekFromToday.setUTCHours(0, 0, 0, 0);
    dates.week = oneWeekFromToday;

    // Dynamically creates a date for today
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    dates.today = today;

    // Dynamically creates a date one week behind from today
    const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    oneWeekAgo.setUTCHours(0, 0, 0, 0);
    dates.weekAgo = oneWeekAgo;


    return dates;
})();

// Default tasks on load 
const DEFAULT_TASKS = [
    {
        id: "a1b2c3d4-0004-0000-0000-000000000000",
        type: "task",
        name: "bench 2 plates",
        desc: "bench press 100kg for 5 reps",
        dueDate: defaultDates.year,
        priority: 2,
        project: "a1b2c3d4-0000-0000-0000-000000000000",
        complete: false,
        dateCreated: new Date(now.getTime() + 4000),
    },
    {
        id: "a1b2c3d4-0005-0000-0000-000000000000",
        type: "task",
        name: "squat 3 plates",
        desc: "squat 140kg for 5 reps",
        dueDate: defaultDates.year,
        priority: 2,
        project: "a1b2c3d4-0000-0000-0000-000000000000",
        complete: false,
        dateCreated: new Date(now.getTime() + 5000),
    },
    {
        id: "a1b2c3d4-0006-0000-0000-000000000000",
        type: "task",
        name: "deadlift 4 plates",
        desc: "deadlift 180kg for 5 reps",
        dueDate: defaultDates.year,
        priority: 2,
        project: "a1b2c3d4-0000-0000-0000-000000000000",
        complete: false,
        dateCreated: new Date(now.getTime() + 6000),
    },
    {
        id: "a1b2c3d4-0007-0000-0000-000000000000",
        type: "task",
        name: "complete the odin project",
        desc: "complete the odin project full stack javascript course",
        dueDate: defaultDates.sixMonths,
        priority: 3,
        project: "a1b2c3d4-0001-0000-0000-000000000000",
        complete: false,
        dateCreated: new Date(now.getTime() + 7000),
    },
    {
        id: "a1b2c3d4-0008-0000-0000-000000000000",
        type: "task",
        name: "fix fence",
        desc: "fix hole in fence to stop dog from escaping",
        dueDate: defaultDates.sixMonths,
        priority: 1,
        project: "a1b2c3d4-0002-0000-0000-000000000000",
        complete: true,
        dateCreated: new Date(now.getTime() + 8000),
    },
    {
        id: "a1b2c3d4-0009-0000-0000-000000000000",
        type: "task",
        name: "grass seed",
        desc: "lay down grass seed",
        dueDate: defaultDates.month,
        priority: 2,
        project: "a1b2c3d4-0002-0000-0000-000000000000",
        complete: false,
        dateCreated: new Date(now.getTime() + 9000),
    },
    {
        id: "a1b2c3d4-0010-0000-0000-000000000000",
        type: "task",
        name: "chop up wood",
        desc: "chop up left over wood and take to recycling centre",
        dueDate: defaultDates.month,
        priority: 1,
        project: "a1b2c3d4-0002-0000-0000-000000000000",
        complete: false,
        dateCreated: new Date(now.getTime() + 10000),
    },
    {
        id: "a1b2c3d4-0011-0000-0000-000000000000",
        type: "task",
        name: "book flights",
        desc: "book return flights for upcoming holiday",
        dueDate: defaultDates.sixMonths,
        priority: 2,
        project: "a1b2c3d4-0003-0000-0000-000000000000",
        complete: false,
        dateCreated: new Date(now.getTime() + 11000),
    },
    {
        id: "a1b2c3d4-0012-0000-0000-000000000000",
        type: "task",
        name: "book hotel",
        desc: "book hotel - max budget £100p/n",
        dueDate: defaultDates.sixMonths,
        priority: 2,
        project: "a1b2c3d4-0003-0000-0000-000000000000",
        complete: true,
        dateCreated: new Date(now.getTime() + 12000),
    },
    {
        id: "a1b2c3d4-0013-0000-0000-000000000000",
        type: "task",
        name: "take cat to vets",
        desc: "take the cat to the vets for their checkup and vaccinations",
        dueDate: defaultDates.today,
        priority: 2,
        project: null,
        complete: false,
        dateCreated: new Date(now.getTime() + 13000),
    },
    {
        id: "a1b2c3d4-0014-0000-0000-000000000000",
        type: "task",
        name: "take nan to the GP",
        desc: "take nan to the GP for her routine checkup",
        dueDate: defaultDates.weekAgo,
        priority: 3,
        project: null,
        complete: false,
        dateCreated: new Date(now.getTime() + 14000),
    },
    {
        id: "a1b2c3d4-0015-0000-0000-000000000000",
        type: "task",
        name: "fix drawer",
        desc: "fix broken screw in drawer meaning I can't open it properly",
        dueDate: defaultDates.sixMonths,
        priority: 1,
        project: null,
        complete: true,
        dateCreated: new Date(now.getTime() + 15000),
    },
]

// Save default tasks to local storage if not already
export const defaultTasks = {
    init() {
        const alreadySeeded = localStorage.getItem("defaultTasksSeeded");
        if (alreadySeeded) return;

        DEFAULT_TASKS.forEach(task => saveToStorage(task));
        localStorage.setItem("defaultTasksSeeded", true);
    }
}

// Task factory function
function createTaskObj(name, desc, dueDate, priority, project) {
    return {
        id: crypto.randomUUID(),
        type: "task",
        name: name,
        desc: desc,
        dueDate: dueDate,
        priority: priority,
        project: project,
        complete: false,
        dateCreated: new Date(),
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
    saveToStorage(task);
}
