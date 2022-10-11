const graveplot = require("../controllers/graveplot.controller");
const router = require("express").Router();
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  //retrieve all grave plots
  router.get("/", graveplot.findAll);

  //create grave plot
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], graveplot.create);
  //delete all grave plots
  router.delete(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    graveplot.deleteAll
  );
  //update a grave lot name
  router.put(
    "/update-name/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    graveplot.updateName
  );

  //update a grave lot location via id
  router.put(
    "/update-loc/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    graveplot.updateLocation
  );

  //retrieve a single grave plot
  router.get("/:id", graveplot.findOne);
  //delete a grave plot
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    graveplot.delete
  );
  app.use("/api/grave-plots", router);
};
