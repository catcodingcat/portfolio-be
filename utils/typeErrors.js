exports.typeErrors = (query, res) => {
  const types = ["Solo", "Pair", "Group"];

  if (query.type && !types.includes(query.type)) {
    return Promise.reject(res.status(400).send({ msg: "Invalid type query." }));
  }
};
