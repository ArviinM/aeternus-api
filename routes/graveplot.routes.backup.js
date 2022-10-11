const graveplot = require("../controllers/graveplot.controller");
const router = require("express").Router();
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

module.exports = function (app) {
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
    limits: 50000000, //50mb limit for profile picture size of the deceased person
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

  //create grave plot
  router.post(
    "/",
    upload.single("photoImg"),
    graveplot.create,
    function (req, res) {
      console.log(req.body.data);
      console.log(req.file);
    }
  );
  //retrieve all grave plots
  router.get("/", graveplot.findAll);
  //retrieve a single grave plot
  router.get("/:id", graveplot.findOne);
  //update a grave plot
  router.put(
    "/:id",
    upload.single("photoImg"),
    graveplot.update,
    function (req, res) {
      console.log(req.body.data);
      console.log(req.file);
    }
  );

  //delete a grave plot
  router.delete("/:id", graveplot.delete);

  //delete all grave plots
  router.delete("/", graveplot.deleteAll);
  app.use("/api/grave-plots2", router);
};
