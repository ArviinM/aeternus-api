const config = require("../config/auth.config");
const db = require("../models");
const ServiceRequest = require("../models/service_request.model");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const GravePlot = require("../models/graveplot.model");
const Service = require("../models/service.model");

//Testing but probably will be removed
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content");
};

//Add role to a specific id
exports.addRole = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to add role cannot be empty!",
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(
    id,
    { username: req.body.username, roles: req.body.roles },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      } else res.send({ message: "User was updated succesfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id + " " + err,
      });
    });
};

exports.updateUser = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to add role cannot be empty!",
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(
    id,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      address: req.body.address,
      contact_no: req.body.contact_no,
      email: req.body.email,
    },
    { useFindAndModify: false }
  )
    .then((data) => {
      console.log(data);
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            data.roles = roles.map((role) => role._id);
            data.save((err) => {
              if (err) {
                res.status(500).send({
                  message:
                    "Cannot update User with id=${id}. Maybe User was not found! " +
                    err,
                });
                return;
              }
              res
                .status(200)
                .send({ message: "User was updated succesfully." });
            });
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id + " " + err,
      });
    });
};

// exports.findBlockLot = (req, res) => {
//   const block = req.params.block;
//   const id = req.params.id;
//   User.find({
//     _id: "63c93a6229e6bb3e59e71e2b",
//     grave_plot: "63c87a19e5e8505821d85034",
//   })
//     // .populate("grave_plot")
//     // .populate({
//     //   path: "grave_plot",
//     //   populate: {
//     //     path: "block",
//     //   },
//     // })
//     .then((data) => {
//       if (!data) {
//         res
//           .status(404)
//           .send({ message: "Grave Plot not found with block " + block });
//       } else {
//         console.log(data);
//         res.status(200).send(data);
//         // res.json(data.toString("base64"));
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error retrieving Grave Plot with block=" + block + " " + err,
//       });
//     });
// };

// exports.findBlockLot2 = (req, res) => {
//   const block = req.params.block;
//   const id = req.params.id;
//   console.log(block);
//   User.aggregate([
//     {
//       $unwind: "$grave_plot",
//     },
//     {
//       $lookup: {
//         from: "grave_plot",
//         localField: "item",
//         foreignField: "block",
//         as: "grave_plot_docs",
//       },
//     },
//     // {
//     //   $match: {
//     //     "grave_plot._id": "63c93a6229e6bb3e59e71e2b",
//     //   },
//     // },
//   ])
//     .then((data) => {
//       if (!data) {
//         res
//           .status(404)
//           .send({ message: "Grave Plot not found with block " + block });
//       } else {
//         console.log(data);
//         res.status(200).send(data);
//         // res.json(data.toString("base64"));
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error retrieving Grave Plot with block=" + block + " " + err,
//       });
//     });
// };

//Fetch a role of a user
exports.getUserRole = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .select("-password")
    .populate("roles")
    .then((user) => {
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        roles: authorities,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error getting the user roles " + err });
    });
};

exports.allUsers = (req, res) => {
  //retrieve all users
  const name = req.query.username;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};
  User.find(condition)
    .select("-password")
    .populate("roles grave_plot", "-__v")
    .populate({
      path: "grave_plot",
      populate: {
        path: "block",
      },
    })
    .exec((err, user) => {
      var myObject = [];

      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "No users found!" });
      }

      let authorities = [];
      let grave_block = [];
      let grave_lot = [];
      for (let i = 0; i < user.length; i++) {
        for (let x = 0; x < user[i].roles.length; x++) {
          authorities.push(user[i].roles[x].name);
        }
        for (let y = 0; y < user[i].grave_plot.length; y++) {
          grave_block.push(user[i].grave_plot[y].block.name);
        }
        for (let y = 0; y < user[i].grave_plot.length; y++) {
          grave_lot.push(user[i].grave_plot[y].lot);
        }

        // console.log(grave_block);
        // console.log(grave_lot);
        // console.log(user);

        myObject.push({
          id: user[i]._id,
          username: user[i].username,
          first_name: user[i].first_name,
          last_name: user[i].last_name,
          email: user[i].email,
          address: user[i].address,
          contact_no: user[i].contact_no,
          grave_plot: { block: { name: grave_block }, lot: grave_lot },
          roles: authorities,
        });
        authorities = [];
        grave_block = [];
        grave_lot = [];
      }
      console.log(myObject);
      res.status(200).send(myObject);
    });
};

exports.addLotOwned = (req, res) => {
  console.log(req.body);

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const id = req.params.id;
  console.log(id);

  User.findByIdAndUpdate(
    id,
    { $push: { grave_plot: req.body.grave_plot } },
    { new: true, useFindAndModify: false }
  )
    .then((data) => {
      console.log(data);
      if (data) {
        GravePlot.findByIdAndUpdate(
          req.body.grave_plot,
          { lot_owner: id },
          { new: true, useFindAndModify: false }
        )
          .then((data2) => {
            console.log(data2);
            res.status(200).send(data2);
            //
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Error updating the Deceased Information with id=" + id + " " + err,
      });
    });
};

//delete a signle user
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.findById(id).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot delete User with id=${id}. Maybe User doesn't exist`,
      });
    } else {
      console.log("delete user");
      console.log(data);

      User.findByIdAndUpdate(
        { _id: "63c7afb7fb9fe79294b6288c" },
        { $push: { grave_plot: data.grave_plot } },
        { new: true, useFindandModify: false }
      ).then((result) => {
        console.log(result);
      });

      GravePlot.updateMany(
        { lot_owner: data._id },
        { lot_owner: "63c7afb7fb9fe79294b6288c" },
        { safe: true, new: true, multi: true, useFindandModify: false }
      ).then((results2) => {
        console.log(results2);
      });

      ServiceRequest.find({ user: data._id })
        .remove()
        .then((data2) => {
          console.log("service request deleted");
          console.log(data2);
          User.findByIdAndRemove(id)
            .then((data) => {
              if (!data) {
                res.status(404).send({
                  message: `Cannot delete User with id=${id}. Maybe User doesn't exist`,
                });
              } else {
                // ServiceRequest.findOneAndRemove({user: id})
                // User.findByIdAndUpdate({_id: "63c7afb7fb9fe79294b6288c"}, {})
                res.status(200).send({
                  message: "User deleted successfully",
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Could not delete User with id=" + id + " " + err,
              });
            });
        });
    }
  });
};
