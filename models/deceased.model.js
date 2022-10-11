const mongoose = require("mongoose");

const deceasedSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    profile_picture: { type: String },
    birth_date: { type: Date, required: true },
    death_date: { type: Date, requried: true },
    obituary: { type: String },
    grave_plot: { type: mongoose.Schema.Types.ObjectId, ref: "GravePlot" },
  },
  { timestamps: true }
);

deceasedSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Deceased = mongoose.model("Deceased", deceasedSchema);
module.exports = Deceased;
