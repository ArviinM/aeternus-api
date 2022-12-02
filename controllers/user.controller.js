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
    .populate("roles", "-__v")
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
      for (let i = 0; i < user.length; i++) {
        for (let x = 0; x < user[i].roles.length; x++) {
          authorities.push(user[i].roles[x].name);
        }
        myObject.push({
          id: user[i]._id,
          username: user[i].username,
          first_name: user[i].first_name,
          last_name: user[i].last_name,
          email: user[i].email,
          address: user[i].address,
          contact_no: user[i].contact_no,
          roles: authorities,
        });
        authorities = [];
      }

      res.status(200).send(myObject);
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
