const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  //Getting all User Data excluding Password
  app.get(
    "/api/auth/allUsers",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.allUsers
  );

  //Roles
  app.put(
    "/api/auth/addRole/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addRole
  );
  app.get(
    "/api/auth/getRole/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUserRole
  );

  //Delete user
  app.delete(
    "/api/auth/removeUser/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );
};
