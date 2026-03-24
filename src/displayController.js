// Module imports
import { loadSideBarData, loadHomeTabData, loadTodayTabData, loadUpcomingTabData, loadCompletedTabData, loadOverdueTabData, loadProjectData } from "./dataController.js";
import { addClickEvent } from "./eventsController.js";

// Consts
const dropDownMenuLabel = document.getElementById("dropdown-menu-label");
const dropDownMenuCheckBox = document.getElementById("dropdown-menu-checkbox");
const projectSidebarList = document.getElementById("project-sidebar-list");
const projectSelection = document.getElementById("project");
const content = document.getElementById("content");

function renderTaskList(tasks, headerText) {
    // Render tasks
    content.innerHTML = "";

    const header = document.createElement("div");
    header.className = "todo-list-header";

    const headerEl = document.createElement("h2");
    headerEl.textContent = `${headerText}`;

    const ul = document.createElement("ul");
    ul.className = "todo-list-container";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "todo-container";

        const todoContainerLeft = document.createElement("div");
        todoContainerLeft.className = "todo-container-left";

        const titleDiv = document.createElement("div");
        titleDiv.textContent = task.name;

        const projectDiv = document.createElement("div");
        if (task.projectName) projectDiv.textContent = task.projectName;

        const todoContainerRight = document.createElement("div");
        todoContainerRight.className = "todo-container-right";

        const date = document.createElement("div");
        date.textContent = task.dueDate;

        const editDiv = document.createElement("div");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        const deleteDiv = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        editDiv.appendChild(editBtn);
        deleteDiv.appendChild(deleteBtn);
        todoContainerLeft.append(titleDiv, projectDiv);
        todoContainerRight.append(date, editDiv, deleteDiv);
        li.append(todoContainerLeft, todoContainerRight);
        ul.appendChild(li);
    })

    header.append(headerEl);
    content.append(header, ul);
}

// Functions
export function renderSideBar() {
    const info = loadSideBarData();

    // Renders task counts on main buttons
    const homeCount = document.getElementById("home-count");
    const todayCount = document.getElementById("today-count");
    const upcomingCount = document.getElementById("upcoming-count");
    const completedCount = document.getElementById("completed-count");
    const overdueCount = document.getElementById("overdue-count");
    
    homeCount.textContent = `(${info.homeCount})`;
    todayCount.textContent = `(${info.todayCount})`;
    upcomingCount.textContent = `(${info.upcomingCount})`;
    completedCount.textContent = `(${info.completedCount})`;
    overdueCount.textContent = `(${info.overdueCount})`;

    // Renders projects
    projectSidebarList.innerHTML = "";
    projectSelection.innerHTML = "";

    const option = document.createElement("option");
    option.value = "home";
    option.textContent = "Home";
    projectSelection.appendChild(option);

    info.projects.forEach(project => {
        // Adds projects to sidebar
        const li = document.createElement("li");

        const btn = document.createElement("button");
        btn.dataset.projectId = project.id;

        const projectName = document.createElement("div");
        projectName.textContent = project.name;

        const taskCount = document.createElement("div");
        taskCount.textContent = `(${project.taskCount})`;

        projectSidebarList.appendChild(li);
        li.appendChild(btn);
        btn.append(projectName, taskCount);

        addClickEvent(btn);

        // Adds projects to add task form
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        projectSelection.appendChild(option);
    })
}

export function renderHomeTab() {
    const tasks = loadHomeTabData();
    renderTaskList(tasks, "All Tasks");
}

export function renderTodayTab() {
    const tasks = loadTodayTabData();
    renderTaskList(tasks, "Tasks Due Today");
}

export function renderUpcomingTab() {
    const tasks = loadUpcomingTabData();
    renderTaskList(tasks, "Upcoming Tasks");
}

export function renderCompletedTab() {
    const tasks = loadCompletedTabData();
    renderTaskList(tasks, "Completed Tasks");
}

export function renderOverdueTab() {
    const tasks = loadOverdueTabData();
    renderTaskList(tasks, "Overdue Tasks");
}

export function renderProjectTab(projectId) {
    const { projectTasks, projectName } = loadProjectData(projectId);
    renderTaskList(projectTasks, projectName);
}

export const windowResize = {
    init() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('no-transition');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('no-transition');
            }, 200);

            if (getComputedStyle(dropDownMenuLabel).display === 'none') {
                dropDownMenuCheckBox.checked = false;
            }
        });
    }
};
