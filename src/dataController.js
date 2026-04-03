// Module imports
import { loadAllFromStorage } from "./storageController.js";

function fetchData() {
    const tasks = [];
    const projects = [];
    const objects = loadAllFromStorage();

    objects.forEach(obj => {
        if (obj.type === "task") {
            if (obj.dueDate) obj.dueDate = new Date(obj.dueDate);
            tasks.push(obj);
        } else if (obj.type === "project") {
            projects.push(obj);
        }
    });

    return { tasks, projects };
}

function assignProjectsToTasks(tasks, projects) {
    tasks.forEach(task => {
        if (task.project) {
            const project = projects.find(({ id }) => id === task.project);
            task.projectName = project?.name;
            task.projectColour = project?.colour;
        }

        task.dueDate = task.dueDate ? formatDate(task.dueDate) : null;
    });

    return tasks;
}

function sortTasks(tasks) {
    tasks.sort((a, b) => {
        const aDueDate = a.dueDate ? new Date(a.dueDate).getTime() : null;
        const bDueDate = b.dueDate ? new Date(b.dueDate).getTime() : null;

        if (aDueDate !== bDueDate) {
            if (aDueDate === null) return 1;
            if (bDueDate === null) return -1;
            return aDueDate - bDueDate;
        }

        const nameCompare = a.name.localeCompare(b.name);

        if (nameCompare !== 0) return nameCompare;

        return a.dateCreated - b.dateCreated;
    });
    return tasks;
}

function formatDate(taskDueDate) {
    const date = new Date(taskDueDate);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export function loadSideBarData() {
    const { tasks, projects } = fetchData();

    const homeCount = tasks.length;
    let todayCount = 0;
    let upcomingCount = 0;
    let overdueCount = 0;
    let completedCount = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        if (task.complete) {
            completedCount++;
            return;
        }

        if (task.dueDate === null) {
            upcomingCount++;
        } else if (task.dueDate.toDateString() === today.toDateString()) {
            todayCount++;
        } else if (task.dueDate > today) {
            upcomingCount++;
        } else {
            overdueCount++;
        }
    });

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
    const { tasks, projects } = fetchData();

    sortTasks(tasks);

    return assignProjectsToTasks(tasks, projects);
}

export function loadTodayTabData() {
    const { tasks, projects } = fetchData();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = tasks.filter((task) => task.dueDate !== null && task.dueDate.toDateString() === today.toDateString() && task.complete === false);

    sortTasks(todayTasks);

    return assignProjectsToTasks(todayTasks, projects);
}

export function loadUpcomingTabData() {
    const { tasks, projects } = fetchData();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate > today && task.complete === false;
    });

    sortTasks(upcomingTasks);

    return assignProjectsToTasks(upcomingTasks, projects);
} 

export function loadCompletedTabData() {
    const { tasks, projects } = fetchData();

    const completedTasks = tasks.filter((task) => task.complete === true);

    sortTasks(completedTasks);

    return assignProjectsToTasks(completedTasks, projects);
}

export function loadOverdueTabData() {
    const { tasks, projects } = fetchData();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overDueTasks = tasks.filter((task) => task.dueDate !== null && task.dueDate < today && task.complete === false);

    sortTasks(overDueTasks);

    return assignProjectsToTasks(overDueTasks, projects);
}

export function loadProjectData(projectId) {
    const { tasks, projects } = fetchData();

    const projectTasks = tasks.filter((task) => task.project === projectId);

    sortTasks(projectTasks);

    projectTasks.forEach(task => {
        if (task.dueDate) task.dueDate = formatDate(task.dueDate);
    });

    const project = projects.find((project) => project.id === projectId);

    const projectName = project.name;

    return { projectTasks, projectName };
}