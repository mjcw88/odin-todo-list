// Module imports
import "./styles.css";
import { defaultTasks } from "./taskController.js";
import { defaultProjects } from "./projectController.js"
import { renderSideBar, renderHomeTab, windowResize } from "./displayController.js";
import { eventListeners } from "./eventsController.js";

const homeBtnId = document.getElementById("home-btn").dataset.btnId;

// Initilisation
defaultTasks.init();
defaultProjects.init();

renderSideBar();
renderHomeTab(homeBtnId);

eventListeners.init();
windowResize.init();