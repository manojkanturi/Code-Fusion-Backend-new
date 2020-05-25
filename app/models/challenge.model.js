const mongoose = require("mongoose");

const ChallengesSchema = mongoose.Schema(
  {
    challenge: {
      program_id: { type: String, required: true },
      title: { type: String, required: true, text: true },
      code: { type: String, required: true, text: true },
      username: { type: String, required: true },
      language_chosen: { type: String, required: true }
    }
  },
  {
    collection: "challenges",
    timestamps: true
  }
);

module.exports = mongoose.model("challenges", ChallengesSchema);
