const db = require("../models");
const GravePlot = db.gravePlot;

exports.create = (req, res) => {
  const plot = new GravePlot({
    block: req.body.block.id,
    lot: req.body.lot,
    status: req.body.status.id,
    southWest: [req.body.southWest[0], req.body.southWest[1]],
    northEast: [req.body.northEast[0], req.body.northEast[1]],
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
  const block = req.query.block;
  var condition = block
    ? { block: { $regex: new RegExp(block), $options: "i" } }
    : {};
  GravePlot.find(condition)
    .populate("status block")
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

exports.findBlocks = (req, res) => {
  const block = req.params.block;
  GravePlot.find({ block: block })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Grave Plot not found with block " + block });
      } else {
        res.status(200).send(data);
        // res.json(data.toString("base64"));
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Grave Plot with block=" + block + " " + err,
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
      block: req.body.block.id,
      lot: req.body.lot,
      status: req.body.status.id,
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
      southWest: [req.body.southWest[0], req.body.southWest[1]],
      northEast: [req.body.northEast[0], req.body.northEast[1]],
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
