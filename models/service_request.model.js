const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    service: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    graveplot: { type: mongoose.Schema.Types.ObjectId, ref: "GravePlot" },
  },
  { timestamps: true }
);

serviceRequestSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
module.exports = ServiceRequest;
