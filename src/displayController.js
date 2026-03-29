// Module imports
import { loadSideBarData, loadHomeTabData, loadTodayTabData, loadUpcomingTabData, loadCompletedTabData, loadOverdueTabData, loadProjectData } from "./dataController.js";
import { addTaskClickEvent, addCompleteChangeEvent, addProjectClickEvent, addEditClickEvent, addDeleteClickEvent } from "./eventsController.js";
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

function getPriorityText(priority) {
    if (priority === 0) {
        return "Low";
    } else if (priority === 1) {
        return "Medium";
    }
    return "High";
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

    const table = document.createElement("table");
    table.id = "todo-table-container";

    const tr = document.createElement("tr");
    tr.className = "todo-container";

    const completeTh = document.createElement("th");
    completeTh.textContent = "Complete";

    const taskTh = document.createElement("th");
    taskTh.textContent = "Task";

    let projectTh;
    if (!isProjectTab) {
        projectTh = document.createElement("th");
        projectTh.textContent = "Project";
    }

    const dueDateTh = document.createElement("th");
    dueDateTh.textContent = "Due Date";

    const priorityTh = document.createElement("th");
    priorityTh.textContent = "Priority";

    const editTh = document.createElement("th");
    editTh.textContent = "Edit";

    const deleteTh = document.createElement("th");
    deleteTh.textContent = "Delete";

    tr.append(completeTh, taskTh, ...(projectTh ? [projectTh] : []), dueDateTh, priorityTh, editTh, deleteTh);
    table.append(tr);

    tasks.forEach(task => {
        const tr = document.createElement("tr");
        tr.className = "todo-container";
        tr.dataset.taskId = `${task.id}`;

        addTaskClickEvent(tr);

        const completeTd = document.createElement("td");
        const completeCheckBox = document.createElement("input");
        completeCheckBox.type = "checkbox";
        completeCheckBox.dataset.completeId = `${task.id}`;
        if (task.complete) completeCheckBox.checked = true;

        addCompleteChangeEvent(completeCheckBox);

        const titleTd = document.createElement("td");
        titleTd.textContent = task.name;

        let projectTd;
        if (!isProjectTab) {
            projectTd = document.createElement("td");
            projectTd.textContent = task.projectName;
        }

        const dateTd = document.createElement("td");
        dateTd.textContent = task.dueDate;

        const priorityTd = document.createElement("td");
        const priorityText = getPriorityText(task.priority);
        priorityTd.textContent = priorityText;

        const editTd = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.dataset.editBtnId = `${task.id}`;
        editBtn.textContent = "Edit";

        addEditClickEvent(editBtn);

        const deleteTd = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.dataset.deleteId = `${task.id}`;
        deleteBtn.textContent = "Delete";

        addDeleteClickEvent(deleteBtn);

        completeTd.appendChild(completeCheckBox);
        editTd.appendChild(editBtn);
        deleteTd.appendChild(deleteBtn);
        tr.append(completeTd, titleTd, ...(projectTd ? [projectTd] : []), dateTd, priorityTd, editTd, deleteTd);
        table.appendChild(tr);
    })

    content.appendChild(table);
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
        document.getElementById("todo-table-container").remove();
        renderEmptyTable();
    }
}

export function renderTaskDialogData(task) {
    const taskData = fetchItem(task.dataset.taskId);

    let projectData;
    if (taskData.project) projectData = fetchItem(taskData.project);

    let projectName;
    projectData ? projectName = projectData.name : projectName = "";

    const priorityText = getPriorityText(taskData.priority);

    const checkBox = document.getElementById("task-dialog-complete-checkbox");
    taskData.complete ? checkBox.checked = true : checkBox.checked = false;

    document.getElementById("task-dialog-task").textContent = taskData.name;
    document.getElementById("task-dialog-desc").textContent = taskData.desc;
    document.getElementById("task-dialog-project").textContent = projectName;
    document.getElementById("task-dialog-due-date").textContent = new Date(taskData.dueDate).toLocaleDateString();
    document.getElementById("task-dialog-priority").textContent = priorityText;
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