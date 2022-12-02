const mongoose = require("mongoose");
const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    name: String,
  })
);
//export
module.exports = Request;
