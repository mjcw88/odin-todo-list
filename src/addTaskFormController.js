const openFormBtn = document.getElementById("open-task-form-btn");
const addTaskForm = document.getElementById("add-task-form");
const form = document.getElementById("add-task-form").querySelector("form");
const closeFormBtn = document.getElementById("close-form-btn");
const date = document.getElementById("date")

export const addTaskFormController = {
    init() {
        openFormBtn.addEventListener("click", () => {
            date.value = new Date().toISOString().split("T")[0];
            addTaskForm.showModal();
        });
        closeFormBtn.addEventListener("click", () => {
            addTaskForm.close();
            form.reset();
        });

        addTaskForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            addTaskForm.close();
            form.reset();
        });
    }
};