// Module imports
import { loadSideBarData, loadHomeTabData, loadTodayTabData, loadUpcomingTabData, loadCompletedTabData, loadOverdueTabData, loadProjectData } from "./dataController.js";
import { addCompleteChangeEvent, addProjectClickEvent, addEditClickEvent, addDeleteClickEvent } from "./eventsController.js";

// Consts
const dropDownMenuLabel = document.getElementById("dropdown-menu-label");
const dropDownMenuCheckBox = document.getElementById("dropdown-menu-checkbox");
const projectSidebarList = document.getElementById("project-sidebar-list");
const projectSelection = document.getElementById("project");
const content = document.getElementById("content");

function renderEmptyTable() {
    const div = document.createElement("div");
    div.textContent = "Empty!";
    div.className = "empty-tasks";
    content.appendChild(div);
}

function renderTaskList(tasks, headerText, tab, isProjectTab = false) {
    content.innerHTML = "";

    const header = document.createElement("div");
    header.className = "todo-table-header";
    header.id = "main-tab-header";
    header.dataset.tabId = tab;
    header.setAttribute("data-project-tab", isProjectTab);

    const headerEl = document.createElement("h2");
    headerEl.textContent = `${headerText}`;

    header.append(headerEl);
    content.appendChild(header);

    if (tasks.length === 0) {
        renderEmptyTable();
        return;
    }

    const ul = document.createElement("ul");
    ul.id = "todo-list-container";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "todo-container";
        li.dataset.taskId = `${task.id}`;

        addEditClickEvent(li);

        const completeDiv = document.createElement("div");
        const completeCheckBox = document.createElement("input");
        completeCheckBox.type = "checkbox";
        completeCheckBox.dataset.completeId = `${task.id}`;
        if (task.complete) completeCheckBox.checked = true;

        addCompleteChangeEvent(completeCheckBox);

        const taskDiv = document.createElement("div");

        const taskName = document.createElement("div");
        taskName.textContent = task.name;

        const taskDesc = document.createElement("div");
        taskDesc.textContent = task.desc;

        const taskDate = document.createElement("div");
        taskDate.textContent = task.dueDate;

        const projectDiv = document.createElement("div");
        projectDiv.textContent = task.projectName;        

        const deleteDiv = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.dataset.deleteId = `${task.id}`;
        deleteBtn.textContent = "Delete";

        addDeleteClickEvent(deleteBtn);

        completeDiv.appendChild(completeCheckBox);
        taskDiv.append(taskName, taskDesc, taskDate);
        deleteDiv.appendChild(deleteBtn);
        li.append(completeDiv, taskDiv, projectDiv, deleteDiv);
        ul.appendChild(li);
    })

    content.appendChild(ul);
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
    option.value = null;
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

        addProjectClickEvent(btn);

        // Adds projects to add task form
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        projectSelection.appendChild(option);
    })
}

export function renderHomeTab() {
    const tasks = loadHomeTabData();
    const headerText = "All Tasks";
    const tabId = "home";
    renderTaskList(tasks, headerText, tabId);
}

export function renderTodayTab() {
    const tasks = loadTodayTabData();
    const headerText = "Tasks Due Today";
    const tabId = "today";
    renderTaskList(tasks, headerText, tabId);
}

export function renderUpcomingTab() {
    const tasks = loadUpcomingTabData();
    const headerText = "Upcoming Tasks";
    const tabId = "upcoming";
    renderTaskList(tasks, headerText, tabId);
}

export function renderCompletedTab() {
    const tasks = loadCompletedTabData();
    const headerText = "Completed Tasks";
    const tabId = "completed";
    renderTaskList(tasks, headerText, tabId);
}

export function renderOverdueTab() {
    const tasks = loadOverdueTabData();
    const headerText = "Overdue Tasks";
    const tabId = "overdue";
    renderTaskList(tasks, headerText, tabId);
}

export function renderProjectTab(projectId) {
    const { projectTasks, projectName } = loadProjectData(projectId);
    const isProjecTab = true;
    renderTaskList(projectTasks, projectName, projectId, isProjecTab);
}

export function removeTaskFromPage(taskId) {
    const taskEl = document.querySelector(`[data-task-id="${taskId}"]`);
    taskEl.remove();

    const tasks = document.querySelectorAll('[data-task-id]');
    if (tasks.length === 0) {
        document.getElementById("todo-list-container").remove();
        renderEmptyTable();
    }
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