exports.filterErrors = (query, res) => {
  const schemaKeys = [
    "_id",
    "title",
    "overview",
    "description",
    "creation_date",
    "type",
    "tech_tags",
    "backend_github_link",
    "frontend_github_link",
    "backend_hosted_link",
    "frontend_hosted_link",
    "main_image",
    "screenshots",
  ];
  const validFilters = ["type", "tech_tags", "sortby", "order"];
  const invalidFilter = Object.keys(query).find(
    (elem) => !schemaKeys.includes(elem)
  );
  const prohibitedFilter = Object.keys(query).find(
    (elem) => !validFilters.includes(elem)
  );

  if (
    invalidFilter &&
    invalidFilter !== "sortby" &&
    invalidFilter !== "order"
  ) {
    return Promise.reject(
      res.status(400).send({ msg: `${invalidFilter} is an invalid filter.` })
    );
  } else if (prohibitedFilter) {
    return Promise.reject(
      res.status(400).send({ msg: `Cannot filter by ${prohibitedFilter}.` })
    );
  }
};
