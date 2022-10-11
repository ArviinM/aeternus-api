const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String },
    address: { type: String },
    contact_no: { type: String },
    email: { type: String },
    password: { type: String },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);
//exports
module.exports = User;
