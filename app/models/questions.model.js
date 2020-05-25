const mongoose = require("mongoose");

const QuestionsSchema = mongoose.Schema(
  {
    title: { type: String, unique: true, required: true, text: true },
    description: { type: String, required: true },
    input: { type: String, required: true },
    output: { type: String, required: true },
    constraints: { type: String, required: true },
    sample_input: { type: String, required: true },
    sample_output: { type: String, required: true },
    private_input: { type: [], required: true },
    private_output: { type: [], required: true },
    time_limit: { type: String, required: true },
  },
  {
    collection: "questions",
    timestamps: true
  }
);

module.exports = mongoose.model("questions", QuestionsSchema);
