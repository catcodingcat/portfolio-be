exports.orderErrors = (query, res) => {
  if (!query.order) order = "desc";
  else if (query.order !== "desc" && query.order !== "asc") {
    return Promise.reject(
      res.status(400).send({ msg: `Invalid order query.` })
    );
  } else order = query.order;
};
