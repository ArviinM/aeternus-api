const db = require("../models");
const GravePlot = db.gravePlot;

exports.create = (req, res) => {
  const plot = new GravePlot({
    lot_address: req.body.lot_address,
    status: req.body.status,
    southWest: [req.body.southWest, req.body.southWest2],
    northEast: [req.body.northEast, req.body.northEast2],
  });

  //save plot to database
  plot
    .save(plot)
    .then((data) => {
      res.status(200).send(data);
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
  const lot_address = req.query.lot_address;
  var condition = lot_address
    ? { lot_address: { $regex: new RegExp(lot_address), $options: "i" } }
    : {};
  GravePlot.find(condition)
    .populate("status")
    .then((data) => {
      res.status(200).send(data);
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
        res.status(404).send({ message: "Grave Plot not found with id " + id });
      } else {
        res.status(200).send(data);
        // res.json(data.toString("base64"));
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Grave Plot with id=" + id + " " + err,
      });
    });
};

exports.updateName = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }
  const id = req.params.id;

  GravePlot.findByIdAndUpdate(
    id,
    {
      lot_address: req.body.lot_address,
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
        message: "Error updating Grave Plot with id=" + id + " " + err,
      });
    });
};

exports.updateLocation = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }
  const id = req.params.id;

  GravePlot.findByIdAndUpdate(
    id,
    {
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
        message: "Error updating Grave Plot with id=" + id + " " + err,
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
        message: "Could not delete Grave Plot with id=" + id + " " + err,
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
