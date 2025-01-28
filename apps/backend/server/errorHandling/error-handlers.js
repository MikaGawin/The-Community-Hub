exports.invalidEndpoint = (req, res) => {
  res.status(404).send({ msg: "Endpoint does not exist" });
};

exports.internalServerError = (err, req, res, next) => {
  if (!err.msg) console.log(err);
  const status = err.status || 500;
  const msg = err.msg || "Internal server error";
  res.status(status).send({ msg });
};
