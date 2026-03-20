import "./styles.css";
import { addTaskFormController } from "./addTaskFormController.js";

let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('no-transition');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 200);
});

addTaskFormController.init();