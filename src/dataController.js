// Module imports
import { loadFromStorage } from "./storageController.js";

export function loadSideBarData() {
    let homeCount = 0;
    let todayCount = 0;
    let upcomingCount = 0;
    let overdueCount = 0;
    let completedCount = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = [];
    const projects = [];
    const objects = loadFromStorage();

    objects.forEach(obj => {
        if (obj.type === "task") {
            obj.dueDate = new Date(obj.dueDate);
            tasks.push(obj);
        } else if (obj.type === "project") {
            projects.push(obj);
        }
    });

    homeCount = tasks.length;

    tasks.forEach(task => {
        if (task.complete === true) {
            completedCount++;
            return;
        }

        if (task.dueDate.toDateString() === today.toDateString()) {
            todayCount++;
        } else if (task.dueDate > today) {
            upcomingCount++;
        } else {
            overdueCount++;
        }
    })

    projects.forEach(project => {
        project.dateCreated = new Date(project.dateCreated);
        project.taskCount = 0;
        tasks.forEach(task => {
            if (task.project === project.id) {
                project.taskCount++;
            }
        });
    });

    projects.sort((a, b) => a.dateCreated - b.dateCreated);

    return { homeCount, todayCount, upcomingCount, overdueCount, completedCount, projects };
}

export function loadHomeTabData() {
    const tasks = [];
    const projects = [];
    const objects = loadFromStorage();

    objects.forEach(obj => {
        if (obj.type === "task") {
            obj.dueDate = new Date(obj.dueDate);
            tasks.push(obj);
        } else if (obj.type === "project") {
            projects.push(obj);
        }
    });

    tasks.sort((a, b) => a.dueDate - b.dueDate);

    tasks.forEach(task => {
        if (task.project) {
            const project = projects.find(({ id }) => id === task.project);
            task.projectName = project?.name;
        }
        task.dueDate = task.dueDate.toLocaleDateString();
    });

    return tasks;
};