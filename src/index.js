// Module imports
import "./styles.css";
import { defaultTasks } from "./taskController.js";
import { defaultProjects } from "./projectController.js"
import { renderSideBar, renderHomeTab, windowResize } from "./displayController.js";
import { eventListeners } from "./eventsController.js";

// Initilisation
defaultTasks.init();
defaultProjects.init();

renderSideBar();
renderHomeTab();

eventListeners.init();
windowResize.init();