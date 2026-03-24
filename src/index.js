// Module imports
import "./styles.css";
import { defaultTasks } from "./taskController.js";
import { defaultProjects } from "./projectController.js"
import { addFormController } from "./formController.js";
import { renderSideBar, renderHomeTab, windowResize } from "./displayController.js";
import { eventListeners } from "./eventsController.js";

// Initilisation
renderSideBar();
renderHomeTab();

defaultTasks.init();
defaultProjects.init();
addFormController.init();
eventListeners.init();
windowResize.init();