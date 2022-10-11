const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

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
    { username: req.body.name, roles: req.body.roles },
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

//fetch all users from the database
exports.allUsers = (req, res) => {
  //retrieve all users
  const name = req.query.username;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};
  User.find(condition)
    .select("-password")
    .then((data) => {
      if (data) {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving Users.",
      });
    });
};

//delete a signle user
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User doesn't exist`,
        });
      } else {
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
};
