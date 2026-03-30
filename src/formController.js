// Module imports
import { createTask } from "./taskController.js";
import { createProject } from "./projectController.js"
import { renderSideBar, renderHomeTab, renderProjectTab } from "./displayController.js";
import { fetchItem } from "./storageController.js";

export function renderDialogBox(dialog) {
    dialog.showModal();
}

export function closeForm(dialog, form = null) {
    if (form?.taskId) form.taskId.value = "";
    if (form?.projectId) form.projectId.value = "";
    if (form?.complete) form.complete.value = "";
    if (form?.dateCreated) form.dateCreated.value = "";
    if (form) form.reset();
    dialog.close();
}

export function submitForm(form) {
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.formType === "newTask") {
        createTask(data);
    } else {
        createProject(data);
    }

    renderSideBar();

    if (data.project !== "null") {
        renderProjectTab(data.projectId);
    } else {
        renderHomeTab();
    }
}

export function renderEditTaskFormData(li, newTaskFormDialog) {
    const task = fetchItem(li.dataset.taskId);
    const form = newTaskFormDialog.querySelector("form");

    form.taskId.value = task.id;
    form.complete.value = task.complete;
    form.dateCreated.value = task.dateCreated;

    document.getElementById("taskName").value = task.name;
    document.getElementById("taskDescription").value = task.desc;
    document.getElementById("date").value = new Date(task.dueDate).toISOString().split("T")[0];
    document.getElementById("priority").value = task.priority;
    document.getElementById("project").value = task.project;
    document.getElementById("add-task-btn").textContent = "Save";
    document.getElementById("add-task-form-header").textContent = "Edit Task";
}

export function renderEditProjectFormData(projectId, newProjectFormDialog) {
    const project = fetchItem(projectId);
    const form = newProjectFormDialog.querySelector("form");

    form.projectId.value = project.id;
    form.dateCreated.value = project.dateCreated;

    document.getElementById("projectName").value = project.name;
    document.getElementById("projectColour").value = project.colour;
    document.getElementById("add-project-btn").textContent = "Save";
    document.getElementById("add-project-form-header").textContent = "Edit Project";
}