// Module imports
import { createTask } from "./taskController.js";
import { createProject } from "./projectController.js"
import { renderSideBar, renderHomeTab, renderTodayTab, renderUpcomingTab, renderOverdueTab, renderCompletedTab, renderProjectTab } from "./displayController.js";
import { fetchItem } from "./storageController.js";

export function renderDialogBox(dialog) {
    dialog.showModal();
}

export function closeForm(dialog, form = null) {
    const DIALOG_BOX_TIMING = 150;

    if (form?.taskId) form.taskId.value = "";
    if (form?.projectId) form.projectId.value = "";
    if (form?.complete) form.complete.value = "";
    if (form?.dateCreated) form.dateCreated.value = "";
    if (form?.editTask) form.editTask.value = "";

    dialog.classList.add('is-closing');
    setTimeout(() => {
        dialog.close();
        dialog.classList.remove('is-closing');
        if (form) form.reset();
    }, DIALOG_BOX_TIMING);
}

export function submitForm(form) {
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const name = (data.taskName || data.projectName).trim();

    if (!name) {
        alert("Name cannot be blank");
        return;
    }

    let project;
    if (data.formType === "newTask") {
        createTask(data);
    } else {
        project = createProject(data);
    }

    renderSideBar();

    const TAB_RENDERERS = {
        home: renderHomeTab,
        today: renderTodayTab,
        upcoming: renderUpcomingTab,
        overdue: renderOverdueTab,
        completed: renderCompletedTab,
    };

    if (data.editTask === "true") {
        const header = document.getElementById("main-tab-header");
        const projectTab = header.dataset.projectTab;
        const tab = header.dataset.tabId;
        const renderTab = projectTab === "true" ? () => renderProjectTab(tab) : (TAB_RENDERERS[tab] ?? renderHomeTab);
        return renderTab();
    }

    if (data.formType === "newProject") return renderProjectTab(project.id);
    if (data.project !== "null") return renderProjectTab(data.project);

    renderHomeTab();
}

export function renderEditTaskFormData(li, newTaskFormDialog) {
    const task = fetchItem(li.dataset.taskId);
    const form = newTaskFormDialog.querySelector("form");

    form.taskId.value = task.id;
    form.complete.value = task.complete;
    form.dateCreated.value = task.dateCreated;
    form.editTask.value = true;

    document.getElementById("taskName").value = task.name;
    document.getElementById("taskDescription").value = task.desc;
    document.getElementById("date").value = task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : null;
    document.getElementById("priority").value = task.priority;
    document.getElementById("project").value = task.project;
    document.getElementById("add-task-btn").textContent = "Save";
}

export function renderEditProjectFormData(projectId, newProjectFormDialog) {
    const project = fetchItem(projectId);
    const form = newProjectFormDialog.querySelector("form");

    form.projectId.value = project.id;
    form.dateCreated.value = project.dateCreated;

    document.getElementById("projectName").value = project.name;
    document.getElementById("projectColour").value = project.colour;
    document.getElementById("new-project-header").textContent = "Edit Project";
    document.getElementById("add-project-btn").textContent = "Save";
}