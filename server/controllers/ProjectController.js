const ProjectModel = require("../models/ProjectModel");

exports.getAllProjects = (req, res, next) => {
  const query = req.query;

  if (!query.sortby) sortby = "creation_date";
  else sortby = query.sortby;

  if (!query.order) order = "desc";
  else order = query.order;

  if (typeof query.tech_tags === "object") {
    let tagsArray = [...query.tech_tags];
    query.tech_tags = { $all: tagsArray };
  }

  ProjectModel.find(query)
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
      if (project === null) res.status(404).json({ msg: "Project not found." });
      else res.status(200).json(project[0]);
    })
    .catch(next);
};
