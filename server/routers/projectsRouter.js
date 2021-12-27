const projectsRouter = require("express").Router();
const {
  getAllProjects,
  getProjectById,
} = require("../controllers/ProjectController");
const {
  handlesMethodNotAllowedError,
} = require("../controllers/ErrorController");

projectsRouter
  .route("/project/:_id")
  .get(getProjectById)
  .all(handlesMethodNotAllowedError);

projectsRouter.route("/").get(getAllProjects).all(handlesMethodNotAllowedError);

module.exports = projectsRouter;
