// Module imports
import { createTask } from "./taskController.js";
import { createProject } from "./projectController.js"
import { renderSideBar, renderHomeTab, renderProjectTab, renderTodayTab, renderUpcomingTab, renderOverdueTab, renderCompletedTab } from "./displayController.js";
import { fetchItem } from "./storageController.js";

export function renderDialogBox(dialog) {
    dialog.showModal();
}

export function closeForm(dialog, form) {
    if (form?.taskId) form.taskId.value = "";
    if (form?.complete) form.complete.value = "";
    if (form?.dateCreated) form.dateCreated.value = "";
    dialog.close();
    form.reset();
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

    const tab = document.querySelector('[data-tab-id]').dataset.tabId;

    switch(tab) {
        case "home":
            renderHomeTab();
            break;
        case "today":
            renderTodayTab();
            break;
        case "upcoming":
            renderUpcomingTab();
            break;
        case "overdue":
            renderOverdueTab();
            break;
        case "completed":
            renderCompletedTab();
            break;
        default:
        if (data.project !== "null") {
            renderProjectTab(data.project);
        } else {
            renderHomeTab();
        }
    }
}

export function renderEditTaskFormData(btn, newTaskFormDialog) {
    const task = fetchItem(btn.dataset.editBtnId);

    const form = newTaskFormDialog.querySelector("form");
    form.taskId.value = `${btn.dataset.editBtnId}`;
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