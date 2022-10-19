const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema(
  {
    block: { type: mongoose.Schema.Types.ObjectId, ref: "Block" },
    lot: { type: String, required: true },
    status: { type: mongoose.Schema.Types.ObjectId, ref: "Status" },
    southWest: [{ type: Number, required: true }],
    northEast: [{ type: Number, required: true }],
  },
  { timestamps: true }
);

mapSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const GravePlot = mongoose.model("GravePlot", mapSchema);
module.exports = GravePlot;
