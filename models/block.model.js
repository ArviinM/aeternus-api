const mongoose = require("mongoose");
const Block = mongoose.model(
  "Block",
  new mongoose.Schema({
    name: String,
  })
);
//export
module.exports = Block;
