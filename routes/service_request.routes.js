const service_request = require("../controllers/service_request.controller");
const router = require("express").Router();
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  //retrieve all service request
  router.get("/", service_request.findAll);
  //retrieve a single service request
  router.get("/:id", service_request.findOne);
  //retrieve a multiple service request of a user
  router.get("/find/:id", service_request.findAllUserServices);

  //create service request
  router.post("/", [authJwt.verifyToken], service_request.create);

  //update a service request name
  router.put(
    "/update-request/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    service_request.updateRequest
  );

  //update a service request name
  router.put(
    "/update-remarks/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    service_request.updateRemarks
  );

  //delete a grave plot
  router.delete("/:id", [authJwt.verifyToken], service_request.delete);

  app.use("/api/service-request", router);
};
