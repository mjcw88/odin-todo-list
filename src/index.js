// Module imports
import "./styles.css";
import { defaultTasks } from "./taskController.js";
import { defaultProjects } from "./projectController.js"
import { addFormController } from "./addFormController.js";
import { renderProjects, windowResize } from "./displayerController.js";

defaultTasks.init();
defaultProjects.init();
addFormController.init();
renderProjects.init();
windowResize.init();
