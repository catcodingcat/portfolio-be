const { filterErrors } = require("../../utils/filterErrors");
const { orderErrors } = require("../../utils/orderErrors");
const { sortbyErrors } = require("../../utils/sortbyErrors");
const { typeErrors } = require("../../utils/typeErrors");
const { tech_tagsErrors } = require("../../utils/tech_tagsErrors");
const ProjectModel = require("../models/ProjectModel");

exports.getAllProjects = async (req, res, next) => {
  const query = req.query;

  await filterErrors(query, res);
  await sortbyErrors(query, res);
  await orderErrors(query, res);
  await typeErrors(query, res);
  await tech_tagsErrors(query, res);

  await ProjectModel.find(query)
    .sort({ [sortby]: order })
    .then((projects) => {
      res.status(200).json({ projects });
    })
    .catch(next);
};

exports.getProjectById = (req, res, next) => {
  const { _id } = req.params;
  ProjectModel.find({ _id })
    .then((project) => {
      if (project.length < 1)
        res.status(404).json({ msg: "Project not found." });
      else res.status(200).json(project[0]);
    })
    .catch(next);
};
