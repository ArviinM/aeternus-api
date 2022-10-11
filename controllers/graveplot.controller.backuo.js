const db = require("../models");
const GravePlot2 = db.gravePlot;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Content cannot be empty." });
    return;
  }
  const url = req.protocol + "://" + req.get("host");

  const plot = new GravePlot({
    name: req.body.name,
    birthdate: req.body.birthdate,
    deathdate: req.body.deathdate,
    description: req.body.description,
    photoImg: url + "/public/" + req.file.filename,
    southWest: [req.body.southWest, req.body.southWest2],
    northEast: [req.body.northEast, req.body.northEast2],
  });

  plot
    .save(plot)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while creating a Grave Plot.",
      });
    });
};

exports.findAll = (req, res) => {
  //retrieve all grave plots
  const name = req.query.name;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};
  GravePlot.find(condition)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving Grave Plots.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  GravePlot.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Not found Grave Plot with id " + id });
      } else {
        res.status(200).send(data);
        // res.json(data.toString("base64"));
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Grave Plot with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }
  const url = req.protocol + "://" + req.get("host");
  const id = req.params.id;

  const plot = GravePlot({
    name: req.body.name,
    birthdate: req.body.birthdate,
    deathdate: req.body.deathdate,
    description: req.body.description,
    photoImg: url + "/public/" + req.file.filename,
    southWest: [req.body.southWest, req.body.southWest2],
    northEast: [req.body.northEast, req.body.northEast2],
  });

  GravePlot.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      birthdate: req.body.birthdate,
      deathdate: req.body.deathdate,
      description: req.body.description,
      photoImg: url + "/public/" + req.file.filename,
      southWest: [req.body.southWest, req.body.southWest2],
      northEast: [req.body.northEast, req.body.northEast2],
    },
    { useFindandModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Grave Plot with id=${id}. Maybe Grave Plot was not found!`,
        });
      } else res.send({ message: "Grave Plot was updated succesfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Grave Plot with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  GravePlot.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Grave Plot with id=${id}. Maybe Grave Plot was not found!`,
        });
      } else {
        res.send({
          message: "Grave Plot was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Grave Plot with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  GravePlot.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Grave Plot were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while removing all grave plots",
      });
    });
};
