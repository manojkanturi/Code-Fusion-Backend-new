const mongoose = require("mongoose");

const ResultsSchema = mongoose.Schema(
  {
    program_id: { type: String, required: true },
    results: { type: [], required: true },
  },
  {
    collection: "results",
    timestamps: true
  }
);

module.exports = mongoose.model("results", ResultsSchema);
