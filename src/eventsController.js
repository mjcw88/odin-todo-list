import { renderHomeTab, renderTodayTab, renderUpcomingTab, renderCompletedTab, renderOverdueTab, renderProjectTab, renderSideBar, toggleCompleteBtnText, removeTaskFromPage } from "./displayController.js";
import { toggleCompleteStatus } from "./taskController.js";
import { deleteTaskFromStorage } from "./storageController.js";

export const eventListeners = {
    init() {
        const homeBtn = document.getElementById("home-btn");
        const todayBtn = document.getElementById("today-btn");
        const upcomingBtn = document.getElementById("upcoming-btn");
        const completedBtn = document.getElementById("completed-btn");
        const overdueBtn = document.getElementById("overdue-btn");
        const projectBtns = document.querySelectorAll('[data-project-id]');

        homeBtn.addEventListener("click", renderHomeTab);
        todayBtn.addEventListener("click", renderTodayTab);
        upcomingBtn.addEventListener("click", renderUpcomingTab);
        completedBtn.addEventListener("click", renderCompletedTab);
        overdueBtn.addEventListener("click", renderOverdueTab);

        projectBtns.forEach(btn => {
            addProjectClickEvent(btn);
        });
    }
}

export function addProjectClickEvent(btn) {
    btn.addEventListener("click", () => {
        renderProjectTab(btn.dataset.projectId)
    });
}

export function addCompleteClickEvent(btn) {
    btn.addEventListener("click", () => {
        const header = document.getElementById("main-tab-header");

        toggleCompleteStatus(btn.dataset.completeBtnId);

        if (header.hasAttribute("data-project-tab")) {
            toggleCompleteBtnText(btn);
        } else {
            removeTaskFromPage(btn.dataset.completeBtnId);
        }

        renderSideBar();
    });
}

export function addDeleteClickEvent(btn) {
    btn.addEventListener("click", () => {
        deleteTaskFromStorage(btn.dataset.deleteBtnId);
        removeTaskFromPage(btn.dataset.deleteBtnId);
        renderSideBar();
    })
}