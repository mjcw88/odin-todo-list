// Module imports
import "./styles.css";
import { defaultTasks } from "./taskController.js";
import { defaultProjects } from "./projectController.js"
import { addFormController } from "./formController.js";
import { renderSideBar, windowResize } from "./displayerController.js";

// Initilisation
defaultTasks.init();
defaultProjects.init();
addFormController.init();
renderSideBar();
windowResize.init();