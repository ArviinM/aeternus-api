const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    birthdate: {
      type: String,
    },
    deathdate: {
      type: String,
    },
    description: {
      type: String,
    },
    photoImg: {
      type: String,
    },
    southWest: [
      {
        type: Number,
      },
    ],
    northEast: [
      {
        type: Number,
      },
    ],
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
