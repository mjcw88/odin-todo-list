import { renderHomeTab, renderTodayTab, renderUpcomingTab, renderCompletedTab, renderOverdueTab, renderProjectTab, renderSideBar, removeTaskFromPage, renderShowMore, renderShowLess, renderDeleteText, sortTaskList } from "./displayController.js";
import { toggleCompleteStatus } from "./taskController.js";
import { deleteTaskFromStorage, deleteProjectFromStorage } from "./storageController.js";
import { renderDialogBox, closeForm, submitForm, renderEditTaskFormData, renderEditProjectFormData } from "./formController.js";

export const eventListeners = {
    init() {
        // Main Sidebar Buttons
        const homeBtn = document.getElementById("home-btn");
        const todayBtn = document.getElementById("today-btn");
        const upcomingBtn = document.getElementById("upcoming-btn");
        const completedBtn = document.getElementById("completed-btn");
        const overdueBtn = document.getElementById("overdue-btn");

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

        // Delete consts
        const deleteDialog = document.getElementById("delete-dialog-box");
        const cancelDelete = document.getElementById("cancel-delete");
        const confirmDelete = document.getElementById("confirm-delete");

        // Sort By consts
        const sortBy = document.getElementById("sort-by");
        const sortbyOrderBtn = document.getElementById("sort-by-order-btn");

        // Sidebar Button Event Listeners
        homeBtn.addEventListener("click", () => renderHomeTab(homeBtn.dataset.btnId));
        todayBtn.addEventListener("click", () => renderTodayTab(todayBtn.dataset.btnId));
        upcomingBtn.addEventListener("click", () => renderUpcomingTab(upcomingBtn.dataset.btnId));
        completedBtn.addEventListener("click", () => renderCompletedTab(completedBtn.dataset.btnId));
        overdueBtn.addEventListener("click", () => renderOverdueTab(overdueBtn.dataset.btnId));

        // New Task Event Listeners
        newTaskBtn.addEventListener("click", () => {
            date.value = new Date().toISOString().split("T")[0];
            document.getElementById("add-task-btn").textContent = "Add Task";
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
            document.getElementById("add-task-btn").textContent = "Add Project";
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
        cancelDelete.addEventListener("click", () => {
            closeForm(deleteDialog);
        });

        confirmDelete.addEventListener("click", () => {
            const isProjectTab = confirmDelete.dataset.isProjectTab === "true" ? true : false;

            if (isProjectTab) {
                deleteProjectFromStorage(confirmDelete.dataset.deleteId);
                renderHomeTab();
            } else {
                deleteTaskFromStorage(confirmDelete.dataset.deleteId);
                removeTaskFromPage(confirmDelete.dataset.deleteId);
            }

            renderSideBar();
            closeForm(deleteDialog);
        });

        // Sort By Event Listeners
        sortBy.addEventListener("change", () => {
            sortTaskList(sortBy.value, sortbyOrderBtn.dataset.sortByOrder);
        })

        sortbyOrderBtn.addEventListener("click", () => {
            if (sortbyOrderBtn.dataset.sortByOrder === "asc") {
                sortbyOrderBtn.textContent = "↓";
                sortbyOrderBtn.dataset.sortByOrder = "desc"
            } else {
                sortbyOrderBtn.textContent = "↑";
                sortbyOrderBtn.dataset.sortByOrder = "asc"
            }

            if (sortBy.value === "") return;

            sortTaskList(sortBy.value, sortbyOrderBtn.dataset.sortByOrder);
        })
    }
}

export function addProjectClickEvent(btn) {
    btn.addEventListener("click", () => {
        renderProjectTab(btn.dataset.projectId);
    });
}

export function addEditProjectClickEvent(header, projectId) {
    header.addEventListener("click", () => {
        const newProjectFormDialog = document.getElementById("new-project-form");
        renderEditProjectFormData(projectId, newProjectFormDialog);
        renderDialogBox(newProjectFormDialog);
    });
}

export function addEditTaskClickEvent(li) {
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

export function addDeleteClickEvent(btn, isProjectTab = false) {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const dialogBox = document.getElementById("delete-dialog-box");
        renderDialogBox(dialogBox);

        renderDeleteText(btn.dataset.deleteId, isProjectTab);

        const confirmDelete = document.getElementById("confirm-delete");
        confirmDelete.dataset.deleteId = btn.dataset.deleteId;
        confirmDelete.dataset.isProjectTab = isProjectTab;
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

