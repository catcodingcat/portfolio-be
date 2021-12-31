exports.sortbyErrors = (query, res) => {
  const validSortby = ["title", "type", "creation_date"];

  if (!query.sortby) sortby = "creation_date";
  else if (!validSortby.includes(query.sortby)) {
    return Promise.reject(
      res.status(400).send({ msg: `Invalid sortby query.` })
    );
  } else sortby = query.sortby;
};
