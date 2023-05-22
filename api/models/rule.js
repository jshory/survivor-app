const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new mongoose.Schema({
  description: {
    required: true,
    type: String,
  },
  points: {
    required: true,
    type: Number,
  },
  season: { type: Schema.Types.ObjectId, ref: "Season" },
});

schema.set("timestamps", true);

module.exports = mongoose.model("Rule", schema);
