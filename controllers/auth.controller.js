const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const GravePlot = require("../models/graveplot.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const { role } = require("../models");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PW,
  },
});

exports.signup = (req, res) => {
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    address: req.body.address,
    contact_no: req.body.contact_no,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    grave_plot: req.body.grave_plot.id,
  });

  user.save((err, user) => {
    console.log("Grave Plot");
    console.log(req.body.grave_plot.id);
    console.log("New User Data");
    console.log(user);
    User.findByIdAndUpdate(
      { _id: "63c7afb7fb9fe79294b6288c" },
      { $pull: { grave_plot: req.body.grave_plot.id } },
      { new: true, useFindandModify: false }
    )
      .then((data2) => {
        User.findByIdAndUpdate(
          { _id: "63c7afb7fb9fe79294b6288c" },
          { $pull: { grave_plot: req.body.grave_plot.id } },
          { new: true, useFindandModify: false }
        );
        console.log(data2);
        GravePlot.findByIdAndUpdate(
          {
            _id: req.body.grave_plot.id,
          },
          { lot_owner: user._id },
          { new: true, useFindandModify: false }
        )
          .then((results) => {
            console.log("Grave Plot Update");
            console.log(results);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    if (err) {
      res.status(500).send({ message: err });
      return;
    }
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
          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Great! You have successfully registered." });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Great! You have successfully registered." });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles grave_plot", "-__v")
    .populate({
      path: "grave_plot",
      populate: {
        path: "block",
      },
    })
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({
          message:
            "Sorry, we can't find your account with this username. Please try again or create a new account.",
        });
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message:
            "Sorry, we couldn't sign you in. Please check that you have already created an account and have entered the correct account details.",
        });
      }
      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
      let refreshToken = await RefreshToken.createToken(user);
      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      let grave_details = [];
      let grave_details2 = [];

      // console.log("Grave Plots Test");
      for (let x = 0; x < user.grave_plot.length; x++) {
        // console.log(user.grave_plot[x]);
        let obj = {
          id: user.grave_plot[x]._id,
          block: {
            id: user.grave_plot[x].block._id,
            name: user.grave_plot[x].block.name,
          },
          lot: user.grave_plot[x].lot,
        };
        grave_details.push(obj);

        let obj2 = {
          id: user.grave_plot[x]._id,
          name:
            "Block " +
            user.grave_plot[x].block.name +
            " Lot " +
            user.grave_plot[x].lot,
        };
        grave_details2.push(obj2);
      }

      // console.log("New Data");
      // console.log(grave_details);

      res.status(200).send({
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
        contact_no: user.contact_no,
        roles: authorities,
        grave_plot: grave_details,
        grave_name: grave_details2,
        accessToken: token,
        refreshToken: refreshToken,
      });
    });
};

exports.findUser = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send({ message: "Error: " + err });
      return;
    }
    if (!user) {
      return res
        .status(404)
        .send({ message: "Sorry, we can't find that user." });
    }

    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtEmailExpiration,
    });

    console.log(token);

    let setUserToken = User.findByIdAndUpdate(
      { _id: user.id },
      { password: token },
      { useFindAndModify: false }
    ).then((data) => {
      console.log(data);
    });

    if (setUserToken) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Your Password Reset",
        text: `\tYou are receiving this because you (or someone else) requested the reset of "${user.username}" user account. \n
        Please click the following link, or paste this into your browser to complete the process. \n
        http://localhost:3000/forgot-password/${user.id}/${token}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error ", err);
          res.status(401).send({ message: "Email not send. " + err });
        } else {
          console.log("Email Sent! ", info.response);
          res.status(200).send({ message: "Email sent successfully!" });
        }
      });
    }
  });
};

exports.changePassword = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to change password cannot be empty!",
    });
  }

  const id = req.params.id;

  User.findById(id).then((user) => {
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      if (isMatch) {
        const hash = bcrypt.hashSync(req.body.newPassword, 8);
        user.password = hash;
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Password changed successfully" });
        });
      } else {
        res.status(500).send({ message: "Passwords do not match" });
      }
    });
  });
};

exports.userChangePassword = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to change password cannot be empty!",
    });
  }

  const id = req.params.id;
  const token = req.params.token;

  User.findOne({ _id: id, password: token })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      let verToken = jwt.verify(token, config.secret);
      console.log(verToken);

      if (verToken) {
        User.findById(id)
          .then((user) => {
            if (!user) {
              return res
                .status(404)
                .send({ message: "Your token has expired!" });
            }

            const hash = bcrypt.hashSync(req.body.password, 8);
            user.password = hash;
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              res.send({ message: "Password changed successfully" });
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Could not your password!" + err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Change Password Token has Expired: " + err,
      });
    });
};

exports.adminChangePassword = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to change password cannot be empty!",
    });
  }

  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      const hash = bcrypt.hashSync(req.body.password, 8);
      user.password = hash;
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ message: "Password changed successfully" });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not chnage user password with id=" + id + " " + err,
      });
    });
};

exports.forgotChangePassword = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to change password cannot be empty!",
    });
  }

  const id = req.params.id;
  const token = req.params.token;

  User.findOne({ _id: id, password: token })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      let verToken = jwt.verify(token, config.secret);
      console.log(verToken);

      res.status(200).send({ message: "User found. " + user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Change Password Token has Expired: " + err,
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
