const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");

db.gravePlot = require("./graveplot.model");
db.status = require("./status.model");

db.deceased = require("./deceased.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
