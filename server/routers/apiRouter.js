const apiRouter = require("express").Router();
const projectsRouter = require("./projectsRouter");

apiRouter.use("/", projectsRouter);
apiRouter.use("/projects", projectsRouter);

module.exports = apiRouter;
