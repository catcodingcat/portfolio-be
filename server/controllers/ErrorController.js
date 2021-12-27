exports.handleInvalidRoute = (req, res) => {
  res.status(404).send({ msg: "Invalid URL." });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error." });
};

exports.handlesMethodNotAllowedError = (req, res) => {
  res.status(405).send({ msg: "Method not allowed." });
};
