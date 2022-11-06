const db = require("../models");
const GravePlot = require("../models/graveplot.model");
const Deceased = db.deceased;

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const url = req.protocol + "://" + req.get("host");

  const deceased = new Deceased({
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,
    profile_picture: url + "/public/" + req.file.filename,
    birth_date: req.body.birth_date,
    death_date: req.body.death_date,
    grave_plot: req.body.grave_plot,
    obituary: req.body.obituary,
  });

  deceased
    .save(deceased)
    .then((data) => {
      if (data) {
        GravePlot.findByIdAndUpdate(
          { _id: req.body.grave_plot },
          // status: "6363f91e750f685635b02906"
          { $push: { deceased: data.id } },
          { safe: true, upsert: true, new: true, useFindandModify: false }
        )
          .then((data) => {
            if (data) {
              GravePlot.findByIdAndUpdate(
                { _id: req.body.grave_plot },
                { status: "6363f91e750f685635b02906" },
                { safe: true, new: true, useFindandModify: false }
              ).catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occured while creating a Grave Plot.",
                });
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occured while creating a Grave Plot.",
            });
          });
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some error occured while creating a Deceased Information" +
          " " +
          err,
      });
    });
};

exports.getAllDeceased = (req, res) => {
  //retrieve all deceased informations

  const name = req.query.first_name;
  var condition = name
    ? { first_name: { $regex: new RegExp(first_name), $options: "i" } }
    : {};

  Deceased.find(condition)
    .populate("grave_plot")
    .populate({
      path: "grave_plot",
      populate: {
        path: "block status",
      },
    })
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some error occured while creating a Deceased Information" +
          " " +
          err,
      });
    });
};

exports.getOneDeceased = (req, res) => {
  const id = req.params.id;

  Deceased.findById(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Deceased information not found with id " + id });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Grave Plot with id=" + id + "" + err,
      });
    });
};

exports.updateDeceasedInformation = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const id = req.params.id;
  console.log(req.body);
  Deceased.findByIdAndUpdate(
    id,
    {
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      birth_date: req.body.birth_date,
      death_date: req.body.death_date,
      grave_plot: req.body.grave_plot,
      obituary: req.body.obituary,
    },
    { new: true, useFindandModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Deceased Information with id=${id}. Maybe Deceased Name was not found!`,
        });
      } else res.status(200).send(String(data));
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error updating the Deceased Information with id=" + id + " " + err,
      });
    });
};

exports.updateDeceasedProfilePic = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const url = req.protocol + "://" + req.get("host");
  const id = req.params.id;

  Deceased.findByIdAndUpdate(
    id,
    {
      profile_picture: url + "/public/" + req.file.filename,
    },
    { useFindandModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Deceased Profile Picture with id=${id}. Maybe Deceased was not found!`,
        });
      } else res.status(200).send(String(data));
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error updating the Deceased Profile Picture with id=" +
          id +
          " " +
          "/n/n" +
          err,
      });
    });
};

exports.deleteDeceased = (req, res) => {
  const id = req.params.id;

  Deceased.findByIdAndRemove({ _id: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Deceased with id=${id}. Maybe Deceased was not found!`,
        });
      } else {
        console.log(data.id);
        console.log(data.grave_plot);
        GravePlot.findByIdAndUpdate(
          { _id: data.grave_plot },
          { $pull: { deceased: data.id } },
          { safe: true, new: true, useFindandModify: false }
        ).catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occured while creating a Grave Plot.",
          });
        });
        res.status(200).send({
          message: "Deceased Information was delete successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Deceased with id=" + id + "/n/n" + err,
      });
    });
};

exports.deleteAllDeceased = (req, res) => {
  Deceased.deleteMany({})
    .then((data) => {
      res.status(200).send({
        message: `${data.deletedCount} Deceased were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Some error occured while removing all Deceased Information /n/n" +
          err,
      });
    });
};
