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

function createSvg(svgPath, colour, fill = "none", size = "1.5rem") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", fill);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", svgPath);
    path.setAttribute("stroke", colour);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    svg.appendChild(path);

    return svg;
}

function renderTaskList(tasks, headerText, tab, isProjectTab = false) {
    content.innerHTML = "";

    const BLACK = "#202020";
    const RED = "#D33322";

    const editSvgPath = "M15 6.5L17.5 9M11 20H20M4 20V17.5L16.75 4.75C17.4404 4.05964 18.5596 4.05964 19.25 4.75V4.75C19.9404 5.44036 19.9404 6.55964 19.25 7.25L6.5 20H4Z";
    const deleteSvgPath = "M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16";

    const header = document.createElement("div");
    header.className = "todo-table-header";
    header.id = "main-tab-header";
    header.dataset.tabId = tab;
    header.setAttribute("data-project-tab", isProjectTab);

    const headerEl = document.createElement("h2");
    headerEl.textContent = headerText;
    header.append(headerEl);
    
    if (isProjectTab) {
        const editSvg = createSvg(editSvgPath, BLACK);
        const deleteSvg = createSvg(deleteSvgPath, RED);

        headerEl.className = "project-name";

        const btnDiv = document.createElement("div");

        const editDiv = document.createElement("div");
        const editBtn = document.createElement("button");
        editBtn.className = "todo-list-btn";
        editBtn.append(editSvg);

        addEditProjectClickEvent(editBtn, tab);

        const deleteDiv = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "todo-list-btn";
        deleteBtn.dataset.deleteId = tab;
        deleteBtn.append(deleteSvg);

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
        li.dataset.dueDate = task.dueDate ? new Date(task.dueDate) : null;
        li.dataset.priority = task.priority;
        li.dataset.dateCreated = task.dateCreated;

        addEditTaskClickEvent(li);

        const completeDiv = document.createElement("div");
        completeDiv.className = "complete-check-box-container";

        const completeLabel = document.createElement("label");
        completeLabel.className = "todo-list-complete";

        const completeCheckBox = document.createElement("input");
        completeCheckBox.type = "checkbox";
        completeCheckBox.dataset.completeId = task.id;

        let h, s, l; 
        if (task.priority === 3) {
            // Red
            h = 5.6;
            s = 68.4;
            l = 89.6;
        } else if (task.priority === 2) {
            // Yellow
            h = 40;
            s = 91;
            l = 83.5;
        } else if (task.priority === 1) {
            // Green
            h = 132;
            s = 52.5;
            l = 75.5;
        } else {
            // Grey
            h = 0;
            s = 0;
            l = 95;
        }

        completeCheckBox.style.background = `hsl(${h}, ${s}%, ${l}%)`;
        completeCheckBox.style.border = `0.125rem solid hsl(${darkenColour(h, s, l)})`;
        if (task.complete) completeCheckBox.checked = true;

        addCompleteChangeEvent(completeCheckBox);

        const tick = document.createElement("span");
        tick.className = "todo-list-tick";

        const borderStyle = `0.125rem solid hsl(${darkenColour(h, s, l)})`;
        tick.style.borderRight = borderStyle;
        tick.style.borderBottom = borderStyle;

        const taskDiv = document.createElement("div");
        taskDiv.className = "todo-list-task-container";

        const taskName = document.createElement("div");
        taskName.className = "todo-list-task-name";
        taskName.textContent = task.name;

        let taskDesc;
        if (task.desc !== "") {
            taskDesc = document.createElement("div");
            taskDesc.className = "todo-description-container";
            taskDesc.dataset.taskDesc = task.id;
            renderTaskDesc(taskDesc, task.id, task.desc);
        }

        let taskDateAndProject;
        if (task.dueDate || task.projectName) {
            taskDateAndProject = document.createElement("div");
            taskDateAndProject.className = "todo-date-and-project-container";
        }

        const taskDate = document.createElement("div");
        taskDate.className = "todo-date-container";
        if (task.dueDate) taskDate.textContent = task.dueDate;

        let taskProject;
        if (task.projectName) {
            taskProject = document.createElement("div");
            taskProject.className = "todo-list-project-name-container";

            const projectName = document.createElement("div");
            projectName.className = "todo-list-project-name";
            projectName.textContent = task.projectName;

            const projectColour = document.createElement("div");
            projectColour.className = "todo-list-project-colour";

            let h, s, l, colour;
            if (task.projectColour) {
                [h, s, l] = task.projectColour.split(",");
                colour = `hsl(${h}, ${s}%, ${l}%)`;
            } else {
                colour = "none";
            }

            const svgPath = "M3 7C3 5.89543 3.89543 5 5 5L8.67157 5C9.20201 5 9.71071 5.21071 10.0858 5.58579L10.9142 6.41421C11.2893 6.78929 11.798 7 12.3284 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z";
            const svgColour = `hsl(${darkenColour(h, s, l)})`
            const svgFill = colour;
            const svg = createSvg(svgPath, svgColour, svgFill);

            projectColour.appendChild(svg);
            taskProject.append(projectName, projectColour);
        }

        const deleteDiv = document.createElement("div");
        deleteDiv.className = "todo-list-delete-container";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "todo-list-btn";
        deleteBtn.dataset.deleteId = task.id;

        const deleteSvg = createSvg(deleteSvgPath, RED);
        deleteBtn.appendChild(deleteSvg);

        addDeleteClickEvent(deleteBtn);

        completeLabel.append(completeCheckBox, tick);
        completeDiv.appendChild(completeLabel);
        if (taskDateAndProject) taskDateAndProject.append(...[taskDate, taskProject].filter(Boolean));
        taskDiv.append(...[taskName, taskDesc, taskDateAndProject].filter(Boolean));
        deleteDiv.appendChild(deleteBtn);
        li.append(completeDiv, taskDiv, deleteDiv);
        ul.appendChild(li);
    })

    content.appendChild(ul);
}

function darkenColour(h = 0, s = 0, l = 100) {
    const AMOUNT = 40;
    return `${h}, ${s}%, ${Math.max(0, l - AMOUNT)}%`;
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

        let h, s, l, colour;
        if (project.colour) {
            [h, s, l] = project.colour.split(",");
            colour = `hsl(${h}, ${s}%, ${l}%)`;
        } else {
            colour = "none";
        }

        const svgPath = "M3 7C3 5.89543 3.89543 5 5 5L8.67157 5C9.20201 5 9.71071 5.21071 10.0858 5.58579L10.9142 6.41421C11.2893 6.78929 11.798 7 12.3284 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z";
        const svgColour = `hsl(${darkenColour(h, s, l)})`
        const svgFill = colour;
        const svg = createSvg(svgPath, svgColour, svgFill);

        projectColour.appendChild(svg);

        const projectName = document.createElement("div");
        projectName.className = "sidebar-project-name";
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
        textBox.appendChild(document.createTextNode(" project and all of its tasks will be permanently deleted."));
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
                let aVal = a.dataset.dueDate !== "null" ? new Date(a.dataset.dueDate).getTime() : null;
                let bVal = b.dataset.dueDate !== "null" ? new Date(b.dataset.dueDate).getTime() : null;

                if (aVal !== bVal) {
                    if (aVal === null) return 1;
                    if (bVal === null) return -1;
                    return aVal - bVal;
                }

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
                let aVal = a.querySelector(".todo-list-project-name") ? a.querySelector(".todo-list-project-name").textContent : "";
                let bVal = b.querySelector(".todo-list-project-name") ? b.querySelector(".todo-list-project-name").textContent : "";

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