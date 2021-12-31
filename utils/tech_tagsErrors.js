exports.tech_tagsErrors = (query, res) => {
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
};
