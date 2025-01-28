exports.invalidEndpoint = (req, res) => {
  res.status(404).send({ msg: "Endpoint does not exist" });
};

exports.internalServerError = (err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
