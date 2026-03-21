// New Task Consts
const newTaskBtn = document.getElementById("open-new-task-btn");
const newTaskFormDialog = document.getElementById("new-task-form");
const newTaskForm = newTaskFormDialog.querySelector("form");
const closeNewTaskForm = document.getElementById("close-new-task-form-btn");
const date = document.getElementById("date")

// New Project Consts
const newProjectBtn = document.getElementById("new-project-btn");
const newProjectFormDialog = document.getElementById("new-project-form");
const newProjectForm = newProjectFormDialog.querySelector("form");
const closeNewProjectForm = document.getElementById("close-new-project-form-btn");

export const addFormController = {
    init() {

        // New Task Event Listeners
        newTaskBtn.addEventListener("click", () => {
            date.value = new Date().toISOString().split("T")[0];
            newTaskFormDialog.showModal();
        });

        closeNewTaskForm.addEventListener("click", () => {
            newTaskFormDialog.close();
            newTaskForm.reset();
        });

        newTaskFormDialog.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!newTaskForm.checkValidity()) {
                newTaskForm.reportValidity();
                return;
            }

            const formData = new FormData(newTaskForm);
            const data = Object.fromEntries(formData.entries());

            newTaskFormDialog.close();
            newTaskForm.reset();
        });

        // New Project Event Listeners
        newProjectBtn.addEventListener("click", () => {
            newProjectFormDialog.showModal();
        });

        closeNewProjectForm.addEventListener("click", () => {
            newProjectFormDialog.close();
            newProjectForm.reset();
        });

        newProjectFormDialog.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!newProjectForm.checkValidity()) {
                newProjectForm.reportValidity();
                return;
            }

            const formData = new FormData(newTaskForm);
            const data = Object.fromEntries(formData.entries());

            newProjectFormDialog.close();
            newProjectForm.reset();
        });
    }
};