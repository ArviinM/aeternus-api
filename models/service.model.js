const mongoose = require("mongoose");
const Service = mongoose.model(
  "Service",
  new mongoose.Schema({
    name: String,
  })
);
//export
module.exports = Service;
