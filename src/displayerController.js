// Module imports
import { loadSideBarData, loadHomeTabData } from "./dataController.js";

// Consts
const dropDownMenuLabel = document.getElementById("dropdown-menu-label");
const dropDownMenuCheckBox = document.getElementById("dropdown-menu-checkbox");
const projectSidebarList = document.getElementById("project-sidebar-list");
const projectSelection = document.getElementById("project");
const content = document.getElementById("content");

// Functions
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

        // Adds projects to add task form
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        projectSelection.appendChild(option);
    })
}

export function renderHomeTab() {
    const tasks = loadHomeTabData();

    // Render tasks
    content.innerHTML = "";

    const header = document.createElement("div");
    header.className = "todo-list-header";

    const headerText = document.createElement("h2");
    headerText.textContent = "All Tasks";

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

    header.append(headerText);
    content.append(header, ul);
}