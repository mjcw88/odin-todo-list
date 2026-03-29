import { renderHomeTab, renderTodayTab, renderUpcomingTab, renderCompletedTab, renderOverdueTab, renderProjectTab, renderSideBar, removeTaskFromPage, renderTaskDialogData } from "./displayController.js";
import { toggleCompleteStatus } from "./taskController.js";
import { deleteTaskFromStorage } from "./storageController.js";
import { renderDialogBox, closeForm, submitForm, renderEditTaskFormData } from "./formController.js";

export const eventListeners = {
    init() {
        // Main Sidebar Buttons
        const homeBtn = document.getElementById("home-btn");
        const todayBtn = document.getElementById("today-btn");
        const upcomingBtn = document.getElementById("upcoming-btn");
        const completedBtn = document.getElementById("completed-btn");
        const overdueBtn = document.getElementById("overdue-btn");
        const projectBtns = document.querySelectorAll('[data-project-id]');

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

        // Full Task Container consts
        const taskDialogContainer = document.getElementById("task-dialog-container");
        const closeTask = document.getElementById("task-dialog-container-close");

        homeBtn.addEventListener("click", renderHomeTab);
        todayBtn.addEventListener("click", renderTodayTab);
        upcomingBtn.addEventListener("click", renderUpcomingTab);
        completedBtn.addEventListener("click", renderCompletedTab);
        overdueBtn.addEventListener("click", renderOverdueTab);

        projectBtns.forEach(btn => {
            addProjectClickEvent(btn);
        });

        // New Task Event Listeners
        newTaskBtn.addEventListener("click", () => {
            const saveBtn = document.getElementById("add-task-btn");
            const header = document.getElementById("add-task-form-header");

            saveBtn.textContent = "Add";
            header.textContent = "Add Task";
            
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

        closeTask.addEventListener("click", () => {
            closeForm(taskDialogContainer)
        })
    }
}

export function addProjectClickEvent(btn) {
    btn.addEventListener("click", () => {
        renderProjectTab(btn.dataset.projectId)
    });
}

export function addTaskClickEvent(task) {
    task.addEventListener("click", (e) => {
        if (e.target.closest("button, input")) return;
        const dialog = document.getElementById("task-dialog-container");
        renderDialogBox(dialog);
        renderTaskDialogData(task);
    });
}

export function addCompleteChangeEvent(checkBox) {
    checkBox.addEventListener("change", () => {
        const header = document.getElementById("main-tab-header");

        toggleCompleteStatus(checkBox.dataset.completeId);

        if (header.dataset.projectTab === "false" && header.dataset.tabId !== "home") {
            removeTaskFromPage(checkBox.dataset.completeId);
        }

        renderSideBar();
    });
}

export function addDeleteClickEvent(btn) {
    btn.addEventListener("click", () => {
        deleteTaskFromStorage(btn.dataset.deleteId);
        removeTaskFromPage(btn.dataset.deleteId);
        renderSideBar();
    });
}

export function addEditClickEvent(btn) {
    btn.addEventListener("click", () => {
        const newTaskFormDialog = document.getElementById("new-task-form");

        renderEditTaskFormData(btn, newTaskFormDialog);
        renderDialogBox(newTaskFormDialog);
    });
}