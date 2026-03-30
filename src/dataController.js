// Module imports
import { loadAllFromStorage } from "./storageController.js";

function fetchData() {
    const tasks = [];
    const projects = [];
    const objects = loadAllFromStorage();

    objects.forEach(obj => {
        if (obj.type === "task") {
            obj.dueDate = new Date(obj.dueDate);
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
        }

        task.dueDate = getDate(task.dueDate);
    });

    return tasks;
}

function sortTasksByDueDate(tasks) {
    return tasks.sort((a, b) => a.dueDate - b.dueDate);
}

function getDate(taskDueDate) {
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
    const { tasks, projects } = fetchData();

    sortTasksByDueDate(tasks);

    return assignProjectsToTasks(tasks, projects);
}

export function loadTodayTabData() {
    const { tasks, projects } = fetchData();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = tasks.filter((task) => task.dueDate.toDateString() === today.toDateString() && task.complete === false);

    sortTasksByDueDate(todayTasks);

    return assignProjectsToTasks(todayTasks, projects);
}

export function loadUpcomingTabData() {
    const { tasks, projects } = fetchData();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTasks = tasks.filter((task) => task.dueDate > today && task.complete === false);

    sortTasksByDueDate(upcomingTasks);

    return assignProjectsToTasks(upcomingTasks, projects);
} 

export function loadCompletedTabData() {
    const { tasks, projects } = fetchData();

    const completedTasks = tasks.filter((task) => task.complete === true);

    sortTasksByDueDate(completedTasks);

    return assignProjectsToTasks(completedTasks, projects);
}

export function loadOverdueTabData() {
    const { tasks, projects } = fetchData();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overDueTasks = tasks.filter((task) => task.dueDate < today && task.complete == false);

    sortTasksByDueDate(overDueTasks);

    return assignProjectsToTasks(overDueTasks, projects);
}

export function loadProjectData(projectId) {
    const { tasks, projects } = fetchData();

    const projectTasks = tasks.filter((task) => task.project === projectId);

    sortTasksByDueDate(projectTasks);

    projectTasks.forEach(task => {
        task.dueDate = getDate(task.dueDate);
    });

    const project = projects.find((project) => project.id === projectId);
    const projectName = project.name;

    return { projectTasks, projectName };
}