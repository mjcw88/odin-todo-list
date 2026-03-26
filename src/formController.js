// Module imports
import { createTask } from "./taskController.js";
import { createProject } from "./projectController.js"
import { renderSideBar, renderHomeTab, renderProjectTab, renderTodayTab, renderUpcomingTab, renderOverdueTab, renderCompletedTab } from "./displayController.js";
import { fetchItem } from "./storageController.js";

export function renderDialogBox(dialog) {
    dialog.showModal();
}

export function closeForm(dialog, form) {
    form.taskId.value = "";
    form.complete.value = "";
    form.dateCreated.value = "";
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
    const form = newTaskFormDialog.querySelector("form");
    const editTaskName = document.getElementById("taskName");
    const editTaskDesc = document.getElementById("taskDescription");
    const editDate = document.getElementById("date");
    const editPriority = document.getElementById("priority");
    const editProject = document.getElementById("project");
    const saveBtn = document.getElementById("add-task-btn");
    const header = document.getElementById("add-task-form-header");

    const task = fetchItem(btn.dataset.editBtnId);

    form.taskId.value = `${btn.dataset.editBtnId}`;
    form.complete.value = task.complete;
    form.dateCreated.value = task.dateCreated;

    editTaskName.value = task.name;
    editTaskDesc.value = task.desc;
    editDate.value = new Date(task.dueDate).toISOString().split("T")[0];
    editPriority.value = task.priority;
    editProject.value = task.project;
    saveBtn.textContent = "Save";
    header.textContent = "Edit Task";
}