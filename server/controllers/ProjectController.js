const ProjectModel = require("../models/ProjectModel");

exports.getAllProjects = (req, res, next) => {
  const query = req.query;
  const types = ["Solo", "Pair", "Group"];
  const tech = [
    "Javascript",
    "PSQL",
    "Node.js",
    "Express",
    "Axios",
    "React",
    "Jest",
    "HTML",
    "CSS",
    "MongoDB",
    "Mongoose",
    "React Native",
    "Expo",
    "Firebase",
    "Mocha",
    "Chai",
  ];

  if (!query.sortby) sortby = "creation_date";
  else sortby = query.sortby;

  if (!query.order) order = "desc";
  else order = query.order;

  if (query.type && !types.includes(query.type)) {
    return Promise.reject(res.status(400).send({ msg: "Invalid type query." }));
  }

  if (typeof query.tech_tags === "object") {
    let tagsArray = [...query.tech_tags];
    if (tagsArray.every((tag) => tech.includes(tag)))
      query.tech_tags = { $all: tagsArray };
    else {
      return Promise.reject(
        res.status(400).send({ msg: "Invalid tech tag query." })
      );
    }
  } else if (query.tech_tags && !tech.includes(query.tech_tags)) {
    return Promise.reject(
      res.status(400).send({ msg: "Invalid tech tag query." })
    );
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
      if (project.length < 1)
        res.status(404).json({ msg: "Project not found." });
      else res.status(200).json(project[0]);
    })
    .catch(next);
};
