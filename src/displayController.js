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
    if (desc.length > 100) {
        taskDesc.textContent = desc.slice(0, 100) + "…";

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

function resetSortBy() {
    document.getElementById("dropdown-menu-checkbox").checked = false;
    document.getElementById("sort-by").value = "";

    const sortByOrderBtn = document.getElementById("sort-by-order-btn");
    sortByOrderBtn.textContent = "↑";
    sortByOrderBtn.dataset.sortByOrder = "asc";
}

function addSelectedClass(id) {
    const btns = document.querySelectorAll(".sidebar-btn");
    btns.forEach(btn => {
        if (btn.dataset.btnId === id) {
            btn.classList.add("selected-tab");
        } else {
            btn.classList.remove("selected-tab");
        }
    });
}

function renderTaskList(tasks, headerText, tab, isProjectTab = false) {
    content.innerHTML = "";

    const header = document.createElement("div");
    header.className = "todo-table-header";
    header.id = "main-tab-header";
    header.dataset.tabId = tab;
    header.setAttribute("data-project-tab", isProjectTab);

    const headerEl = document.createElement("h2");
    headerEl.textContent = headerText;
    header.append(headerEl);
    
    if (isProjectTab) {
        headerEl.className = "project-name";

        const btnDiv = document.createElement("div");

        const editDiv = document.createElement("div");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        addEditProjectClickEvent(editBtn, tab);

        const deleteDiv = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.dataset.deleteId = tab;
        deleteBtn.textContent = "Delete";

        addDeleteClickEvent(deleteBtn, isProjectTab);

        editDiv.appendChild(editBtn);
        deleteDiv.appendChild(deleteBtn);
        btnDiv.append(editDiv, deleteDiv);
        header.append(btnDiv);
    }

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
        li.dataset.dueDate = new Date(task.dueDate);
        li.dataset.priority = task.priority;
        li.dataset.dateCreated = task.dateCreated;

        addEditTaskClickEvent(li);

        const completeDiv = document.createElement("div");
        const completeCheckBox = document.createElement("input");
        completeCheckBox.className = "todo-list-complete";
        completeCheckBox.type = "checkbox";
        completeCheckBox.dataset.completeId = task.id;
        if (task.complete) completeCheckBox.checked = true;

        addCompleteChangeEvent(completeCheckBox);

        const taskDiv = document.createElement("div");

        const taskName = document.createElement("div");
        taskName.className = "todo-list-task-name";
        taskName.textContent = task.name;

        const taskDesc = document.createElement("div");
        taskDesc.dataset.taskDesc = task.id;
        renderTaskDesc(taskDesc, task.id, task.desc);
    
        const taskDateAndProject = document.createElement("div");
        const taskDate = document.createElement("div");
        taskDate.textContent = task.dueDate;

        const taskProject = document.createElement("div");
        taskProject.className = "todo-list-project-name";
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

function darkenColour(colour) {
    const darkenLevel = 0.7;
    const hex = parseInt(colour.replace("#", ""), 16);
    const r = Math.floor((hex >> 16) * darkenLevel);
    const g = Math.floor(((hex >> 8) & 0xff) * darkenLevel);
    const b = Math.floor((hex & 0xff) * darkenLevel);
    return `rgb(${r}, ${g}, ${b})`;
}

export function renderSideBar() {
    const info = loadSideBarData();

    // Renders task counts on main buttons
    document.getElementById("home-count").textContent = info.homeCount;
    document.getElementById("today-count").textContent = info.todayCount;
    document.getElementById("upcoming-count").textContent = info.upcomingCount;
    document.getElementById("completed-count").textContent = info.completedCount;
    document.getElementById("overdue-count").textContent = info.overdueCount;

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
        btn.className = "sidebar-btn";
        btn.dataset.projectId = project.id;
        btn.dataset.btnId = project.id;

        const projectNameContainer = document.createElement("div");
        projectNameContainer.className = "project-name-container";

        const projectColour = document.createElement("div");
        projectColour.className = "project-colour";
        if (!project.colour) project.colour = "transparent";
        projectColour.style.backgroundColor = project.colour;
        projectColour.style.border = `1px solid ${darkenColour(project.colour)}`;

        const projectName = document.createElement("div");
        projectName.textContent = project.name;

        const taskCount = document.createElement("div");
        taskCount.className = "task-count";
        taskCount.textContent = project.taskCount;

        projectSidebarList.appendChild(li);
        li.appendChild(btn);
        projectNameContainer.append(projectColour, projectName);
        btn.append(projectNameContainer, taskCount);

        addProjectClickEvent(btn);

        // Adds projects to add task form
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        projectSelection.appendChild(option);
    })
}

export function renderHomeTab(id) {
    const tasks = loadHomeTabData();
    const headerText = "All Tasks";
    const tabId = "home";
    resetSortBy();
    addSelectedClass(id);
    renderTaskList(tasks, headerText, tabId);
}

export function renderTodayTab(id) {
    const tasks = loadTodayTabData();
    const headerText = "Tasks Due Today";
    const tabId = "today";
    resetSortBy();
    addSelectedClass(id);
    renderTaskList(tasks, headerText, tabId);
}

export function renderUpcomingTab(id) {
    const tasks = loadUpcomingTabData();
    const headerText = "Upcoming Tasks";
    const tabId = "upcoming";
    resetSortBy();
    addSelectedClass(id);
    renderTaskList(tasks, headerText, tabId);
}

export function renderCompletedTab(id) {
    const tasks = loadCompletedTabData();
    const headerText = "Completed Tasks";
    const tabId = "completed";
    resetSortBy();
    addSelectedClass(id);
    renderTaskList(tasks, headerText, tabId);
}

export function renderOverdueTab(id) {
    const tasks = loadOverdueTabData();
    const headerText = "Overdue Tasks";
    const tabId = "overdue";
    resetSortBy();
    addSelectedClass(id);
    renderTaskList(tasks, headerText, tabId);
}

export function renderProjectTab(id) {
    const { projectTasks, projectName } = loadProjectData(id);
    const isProjecTab = true;
    resetSortBy();
    addSelectedClass(id);
    renderTaskList(projectTasks, projectName, id, isProjecTab);
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

export function renderDeleteText(id, isProjectTab) {
    const item = fetchItem(id);
    const header = document.getElementById("delete-header");
    const textBox = document.getElementById("delete-textbox");
    
    isProjectTab ? header.textContent = "Delete Project?" : header.textContent = "Delete Task?"

    textBox.textContent = "The ";
    
    const strong = document.createElement("strong");
    strong.textContent = item.name;
    
    textBox.appendChild(strong);

    if (isProjectTab) {
        textBox.appendChild(document.createTextNode(" project will be permanently deleted. This will also delete all associated tasks."));
    } else {
        textBox.appendChild(document.createTextNode(" task will be permanently deleted."));
    }
}

export function sortTaskList(sortBy, orderBy) {
    const toDoList = document.getElementById("todo-list-container");
    const listItems = Array.from(toDoList.querySelectorAll("li"));

    let comparator;

    switch(sortBy) {
        case "complete":
            comparator = (a, b) => {
                let aVal = a.querySelector(".todo-list-complete").checked;
                let bVal = b.querySelector(".todo-list-complete").checked;

                if (aVal !== bVal) return aVal - bVal;

                aVal = a.querySelector(".todo-list-task-name").textContent;
                bVal = b.querySelector(".todo-list-task-name").textContent;

                const nameCompare = aVal.localeCompare(bVal);
                
                if (nameCompare !== 0) return nameCompare;

                aVal = new Date(a.dataset.dateCreated).getTime();
                bVal = new Date(b.dataset.dateCreated).getTime();

                return aVal - bVal;
            };
            break;
        case "dueDate":
            comparator = (a, b) => {
                let aVal = new Date(a.dataset.dueDate).getTime();
                let bVal = new Date(b.dataset.dueDate).getTime();

                if (aVal !== bVal) return aVal - bVal;

                aVal = a.querySelector(".todo-list-task-name").textContent;
                bVal = b.querySelector(".todo-list-task-name").textContent;

                const nameCompare = aVal.localeCompare(bVal);
                
                if (nameCompare !== 0) return nameCompare;

                aVal = new Date(a.dataset.dateCreated).getTime();
                bVal = new Date(b.dataset.dateCreated).getTime();

                return aVal - bVal;
            };
            break;
        case "priority":
            comparator = (a, b) => {
                let aVal = parseInt(a.dataset.priority);
                let bVal = parseInt(b.dataset.priority);

                if (aVal !== bVal) return aVal - bVal;

                aVal = a.querySelector(".todo-list-task-name").textContent;
                bVal = b.querySelector(".todo-list-task-name").textContent;

                const nameCompare = aVal.localeCompare(bVal);
                
                if (nameCompare !== 0) return nameCompare;

                aVal = new Date(a.dataset.dateCreated).getTime();
                bVal = new Date(b.dataset.dateCreated).getTime();

                return aVal - bVal;
            }
            break;
        case "project":
            comparator = (a, b) => {
                let aVal = a.querySelector(".todo-list-project-name").textContent;
                let bVal = b.querySelector(".todo-list-project-name").textContent;

                if (aVal !== bVal) return aVal.localeCompare(bVal);

                aVal = a.querySelector(".todo-list-task-name").textContent;
                bVal = b.querySelector(".todo-list-task-name").textContent;

                const nameCompare = aVal.localeCompare(bVal);
                
                if (nameCompare !== 0) return nameCompare;

                aVal = new Date(a.dataset.dateCreated).getTime();
                bVal = new Date(b.dataset.dateCreated).getTime();

                return aVal - bVal;
            };
            break;
        default:
            comparator = (a, b) => {
                let aVal = a.querySelector(".todo-list-task-name").textContent;
                let bVal = b.querySelector(".todo-list-task-name").textContent;

                const nameCompare = aVal.localeCompare(bVal);
                
                if (nameCompare !== 0) return nameCompare;

                aVal = new Date(a.dataset.dateCreated).getTime();
                bVal = new Date(b.dataset.dateCreated).getTime();

                return aVal - bVal;
            };
            break;
    }

    listItems.sort(comparator);

    if (orderBy === "desc") listItems.reverse();

    toDoList.innerHTML = "";

    toDoList.append(...listItems);
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