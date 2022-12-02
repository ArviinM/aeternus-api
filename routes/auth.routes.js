const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameorEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
  app.post("/api/auth/password-reset", controller.findUser);
  app.put("/api/auth/user-change-pw/:id/:token", controller.userChangePassword);
  app.get(
    "/api/auth/forgot-password/:id/:token",
    controller.forgotChangePassword
  );
  app.put(
    "/api/auth/changePassword/:id",
    [authJwt.verifyToken],
    controller.changePassword
  );
  app.put(
    "/api/auth/admin-change-pw/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminChangePassword
  );
};
