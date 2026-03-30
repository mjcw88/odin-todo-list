import { renderHomeTab, renderTodayTab, renderUpcomingTab, renderCompletedTab, renderOverdueTab, renderProjectTab, renderSideBar, removeTaskFromPage, renderShowMore, renderShowLess, renderDeleteText } from "./displayController.js";
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

        // Delete Tasks consts
        const deleteDialog = document.getElementById("delete-dialog-box");
        const cancelDeleteTask = document.getElementById("cancel-delete-task");
        const confirmDeleteTask = document.getElementById("confirm-delete-task");

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

        // Delete Tasks Event Listeners
        cancelDeleteTask.addEventListener("click", () => {
            closeForm(deleteDialog);
        });

        confirmDeleteTask.addEventListener("click", () => {
            deleteTaskFromStorage(confirmDeleteTask.dataset.deleteId);
            removeTaskFromPage(confirmDeleteTask.dataset.deleteId);
            renderSideBar();
            closeForm(deleteDialog);
        });
    }
}

export function addProjectClickEvent(btn) {
    btn.addEventListener("click", () => {
        renderProjectTab(btn.dataset.projectId)
    });
}

export function addEditClickEvent(li) {
    li.addEventListener("click", (e) => {
        if (e.target.closest("button, input")) return;
        e.stopPropagation();
        const newTaskFormDialog = document.getElementById("new-task-form");
        renderEditTaskFormData(li, newTaskFormDialog);
        renderDialogBox(newTaskFormDialog);
    });
}

export function addCompleteChangeEvent(checkBox) {
    checkBox.addEventListener("change", (e) => {
        e.stopPropagation();
        const header = document.getElementById("main-tab-header");

        toggleCompleteStatus(checkBox.dataset.completeId);

        if (header.dataset.projectTab === "false" && header.dataset.tabId !== "home") {
            removeTaskFromPage(checkBox.dataset.completeId);
        }

        renderSideBar();
    });
}

export function addDeleteClickEvent(btn) {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const dialogBox = document.getElementById("delete-dialog-box");
        renderDialogBox(dialogBox);

        renderDeleteText(btn.dataset.deleteId);

        const confirmDeleteTask = document.getElementById("confirm-delete-task");
        confirmDeleteTask.dataset.deleteId = btn.dataset.deleteId;
    });
}

export function addShowMoreClickEvent(btn) {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderShowMore(btn.dataset.showMoreId);
    })
}

export function addShowLessClickEvent(btn) {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderShowLess(btn.dataset.showLessId);
    })
}