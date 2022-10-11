const deceased = require("../controllers/deceased.controller");
const router = require("express").Router();
const { authJwt } = require("../middlewares");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

//upload deceased information the picture
var upload = multer({
  storage: storage,
  limits: 5000000000, //50mb limit for profile picture size of the deceased person
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //create a deceased
  app.post(
    "/api/deceased/create",
    [authJwt.verifyToken, authJwt.isAdmin],
    upload.single("profile_picture"),
    deceased.create
  );

  //retrieve all deceased informations
  app.get("/api/deceased", deceased.getAllDeceased);

  //retrieve a single deceased information
  app.get("/api/deceased/:id", deceased.getOneDeceased);

  //update a deceased information without the picture
  app.put(
    "/api/deceased/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    deceased.updateDeceasedInformation
  );

  //update a deceased information with picture but without the information
  // app.put(
  //   "/api/deceased/photo/:id",
  //   // [authJwt.verifyToken, authJwt.isAdmin],
  //   upload.single("profile_picture"),
  //   deceased.updateDeceasedProfilePic
  // );

  app.put(
    "/api/deceased/photo/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    upload.single("profile_picture"),
    deceased.updateDeceasedProfilePic
  );

  //delete a single deceased information
  app.delete(
    "/api/deceased/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    deceased.deleteDeceased
  );

  //delete all grave plots
  app.delete(
    "/api/deceased",
    [authJwt.verifyToken, authJwt.isAdmin],
    deceased.deleteAllDeceased
  );
};
