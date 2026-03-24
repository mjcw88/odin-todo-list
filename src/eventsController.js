import { renderHomeTab, renderTodayTab, renderUpcomingTab, renderCompletedTab, renderOverdueTab, renderProjectTab } from "./displayController.js";

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
            addClickEvent(btn);
        });
    }
}

export function addClickEvent(btn) {
    btn.addEventListener("click", () => 
        renderProjectTab(btn.dataset.projectId))
}