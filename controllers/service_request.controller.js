const db = require("../models");
const Service = require("../models/service.model");
const ServiceRequest = db.service_request;

exports.create = (req, res) => {
  const request = new ServiceRequest({
    user: req.body.user.id,
    request: req.body.request.id,
    graveplot: req.body.graveplot.id,
    remarks: req.body.remarks,
  });

  request.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.service) {
      Service.find(
        {
          name: { $in: req.body.service },
        },
        (err, service) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.service = service.map((service) => service._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Service was added successfully" });
          });
        }
      );
    }
  });
};

exports.findAll = (req, res) => {
  //retrieve all service requests
  const service = req.query.service;
  var condition = service
    ? { service: { $regex: new RegExp(service), $options: "i" } }
    : {};

  ServiceRequest.find(condition)
    .sort({ request: -1, createdAt: -1 })
    .populate("service user request graveplot", "-password -__v")
    .populate({
      path: "graveplot",
      populate: {
        path: "block",
      },
    })
    .exec((err, data) => {
      var myObject = [];

      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!data) {
        return res.status(404).send({ message: "No service request found!" });
      }

      let authorities = [];
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < data[i].service.length; x++) {
          authorities.push(data[i].service[x].name);
        }
        myObject.push({
          id: data[i]._id,
          graveplot: data[i].graveplot,
          request: data[i].request,
          user: data[i].user,
          service: authorities,
          remarks: data[i].remarks,
          createdAt: data[i].createdAt,
          updatedAt: data[i].updatedAt,
        });
        authorities = [];
      }
      console.log(data);
      res.status(200).send(myObject);
    });
};

exports.updateRequest = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const id = req.params.id;

  ServiceRequest.findByIdAndUpdate(
    id,
    { request: req.body.request.id },
    { useFindandModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Service Request with id=${id}. Maybe Service Request was not found!`,
        });
      } else res.send({ message: "Service Request was updated succesfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Service Request with id=" + id + " " + err,
      });
    });
};

exports.updateRemarks = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const id = req.params.id;
  console.log(req.body);

  ServiceRequest.findByIdAndUpdate(
    id,
    { remarks: req.body.remarks },
    { new: true, useFindandModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Service Request Remarkswith id=${id}. Maybe Service Request was not found!`,
        });
      } else
        res.send({
          message: "Service Request Remarks was updated succesfully.",
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error updating Service Request Remarks with id=" + id + " " + err,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  ServiceRequest.findById(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "Service Request not found with id " + id });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Service Request with id=" + id + " " + err,
      });
    });
};

exports.findAllUserServices = (req, res) => {
  const id = req.params.id;

  ServiceRequest.find({ user: id })
    .sort({ createdAt: -1, updatedAt: 1 })
    .populate("service user request graveplot", "-password -__v")
    .populate({
      path: "graveplot",
      populate: {
        path: "block",
      },
    })
    .exec((err, data) => {
      var myObject = [];

      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!data) {
        return res.status(404).send({ message: "No service request found!" });
      }

      let authorities = [];
      for (let i = 0; i < data.length; i++) {
        for (let x = 0; x < data[i].service.length; x++) {
          authorities.push(data[i].service[x].name);
        }
        myObject.push({
          id: data[i]._id,
          graveplot: data[i].graveplot,
          request: data[i].request,
          user: data[i].user,
          service: authorities,
          remarks: data[i].remarks,
          createdAt: data[i].createdAt,
          updatedAt: data[i].updatedAt,
        });
        authorities = [];
      }
      console.log(data);
      res.status(200).send(myObject);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  ServiceRequest.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Service Request with id=${id}. Maybe Service Request was not found!`,
        });
      } else {
        res.send({
          message: "Service Request was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Service Request with id=" + id + " " + err,
      });
    });
};
