// Module imports
import { createTask } from "./taskController.js";
import { createProject } from "./projectController.js"
import { renderSideBar } from "./displayerController.js";

// New Task consts
const newTaskBtn = document.getElementById("open-new-task-btn");
const newTaskFormDialog = document.getElementById("new-task-form");
const newTaskForm = newTaskFormDialog.querySelector("form");
const closeNewTaskForm = document.getElementById("close-new-task-form-btn");
const date = document.getElementById("date")

// New Project consts
const newProjectBtn = document.getElementById("new-project-btn");
const newProjectFormDialog = document.getElementById("new-project-form");
const newProjectForm = newProjectFormDialog.querySelector("form");
const closeNewProjectForm = document.getElementById("close-new-project-form-btn");

// Helper functions
function renderDialogBox(dialog) {
    dialog.showModal();
}

function closeForm(dialog, form) {
    dialog.close();
    form.reset();
}

function submitForm(form) {
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
}

export const addFormController = {
    init() {
        // New Task Event Listeners
        newTaskBtn.addEventListener("click", () => {
            date.value = new Date().toISOString().split("T")[0];
            renderDialogBox(newTaskFormDialog);
        });

        closeNewTaskForm.addEventListener("click", () => {
            closeForm(newTaskFormDialog, newTaskForm);
        });

        newTaskFormDialog.addEventListener("submit", (e) => {
            e.preventDefault();
            submitForm(newTaskForm);
            closeForm(newTaskFormDialog, newTaskForm);
        });

        // New Project Event Listeners
        newProjectBtn.addEventListener("click", () => {
            renderDialogBox(newProjectFormDialog);
        });

        closeNewProjectForm.addEventListener("click", () => {
            closeForm(newProjectFormDialog, newProjectForm);
        });

        newProjectFormDialog.addEventListener("submit", (e) => {
            e.preventDefault();
            submitForm(newProjectForm);
            closeForm(newProjectFormDialog, newProjectForm);
        });
    }
}