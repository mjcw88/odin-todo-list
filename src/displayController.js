// Module imports
import { loadSideBarData, loadHomeTabData, loadTodayTabData, loadUpcomingTabData, loadCompletedTabData, loadOverdueTabData, loadProjectData } from "./dataController.js";
import { addCompleteChangeEvent, addProjectClickEvent, addEditProjectClickEvent, addEditTaskClickEvent, addDeleteClickEvent, addShowMoreClickEvent, addShowLessClickEvent } from "./eventsController.js";
import { fetchItem } from "./storageController.js";

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

function renderTaskDesc(taskDesc, id, desc) {
    if (desc.length > 125) {
        taskDesc.textContent = desc.slice(0, 125) + "…";

        const showMoreDiv = document.createElement("div");

        const showMoreBtn = document.createElement("button");
        showMoreBtn.className = "show-more-btn";
        showMoreBtn.dataset.showMoreId = id;
        showMoreBtn.textContent = "Show More";

        addShowMoreClickEvent(showMoreBtn);

        showMoreDiv.append(showMoreBtn);
        taskDesc.append(showMoreDiv);
    } else {
        taskDesc.textContent = desc;
    }
}

function renderTaskList(tasks, headerText, tab, isProjectTab = false) {
    content.innerHTML = "";

    const header = document.createElement("div");
    header.className = "todo-table-header";
    header.id = "main-tab-header";
    header.dataset.tabId = tab;
    header.setAttribute("data-project-tab", isProjectTab);

    if (isProjectTab) addEditProjectClickEvent(header, tab);

    const headerEl = document.createElement("h2");
    headerEl.textContent = headerText;
    if (isProjectTab) headerEl.className = "project-name";

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
        li.dataset.taskId = task.id;

        addEditTaskClickEvent(li);

        const completeDiv = document.createElement("div");
        const completeCheckBox = document.createElement("input");
        completeCheckBox.type = "checkbox";
        completeCheckBox.dataset.completeId = task.id;
        if (task.complete) completeCheckBox.checked = true;

        addCompleteChangeEvent(completeCheckBox);

        const taskDiv = document.createElement("div");

        const taskName = document.createElement("div");
        taskName.textContent = task.name;

        const taskDesc = document.createElement("div");
        taskDesc.dataset.taskDesc = task.id;
        renderTaskDesc(taskDesc, task.id, task.desc);
    
        const taskDateAndProject = document.createElement("div");
        const taskDate = document.createElement("div");
        taskDate.textContent = task.dueDate;

        const taskProject = document.createElement("div");
        if (task.projectName) taskProject.textContent = task.projectName;

        const deleteDiv = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.dataset.deleteId = task.id;
        deleteBtn.textContent = "Delete";

        addDeleteClickEvent(deleteBtn);

        completeDiv.appendChild(completeCheckBox);
        taskDateAndProject.append(taskDate, taskProject);
        taskDiv.append(taskName, taskDesc, taskDateAndProject);
        deleteDiv.appendChild(deleteBtn);
        li.append(completeDiv, taskDiv, deleteDiv);
        ul.appendChild(li);
    })

    content.appendChild(ul);
}

export function renderSideBar() {
    const info = loadSideBarData();

    // Renders task counts on main buttons
    document.getElementById("home-count").textContent = `(${info.homeCount})`;
    document.getElementById("today-count").textContent = `(${info.todayCount})`;
    document.getElementById("upcoming-count").textContent = `(${info.upcomingCount})`;
    document.getElementById("completed-count").textContent = `(${info.completedCount})`;
    document.getElementById("overdue-count").textContent = `(${info.overdueCount})`;

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

export function renderShowMore(taskId) {
    const task = fetchItem(taskId);
    const descEl = document.querySelector(`[data-task-desc="${taskId}"]`);
    descEl.textContent = task.desc;

    const showLessDiv = document.createElement("div");

    const showLessBtn = document.createElement("button");
    showLessBtn.className = "show-less-btn";
    showLessBtn.dataset.showLessId = task.id;
    showLessBtn.textContent = "Show Less";

    addShowLessClickEvent(showLessBtn);

    showLessDiv.append(showLessBtn);
    descEl.append(showLessDiv);
}

export function renderShowLess(taskId) {
    const task = fetchItem(taskId);
    const descEl = document.querySelector(`[data-task-desc="${taskId}"]`);
    renderTaskDesc(descEl, task.id, task.desc);
}

export function renderDeleteText(taskId) {
    const task = fetchItem(taskId);
    const el = document.getElementById("delete-textbox");
    
    el.textContent = "The ";
    
    const strong = document.createElement("strong");
    strong.textContent = task.name;
    
    el.appendChild(strong);
    el.appendChild(document.createTextNode(" task will be permanently deleted."));
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