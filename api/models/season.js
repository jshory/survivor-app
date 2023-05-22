const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  contestants: [{ type: Schema.Types.ObjectId, ref: "Contestant" }],
  tribes: [{ type: Schema.Types.ObjectId, ref: "Tribe" }],
  rules: [{ type: Schema.Types.ObjectId, ref: "Rule" }],
});

schema.set("timestamps", true);

module.exports = mongoose.model("Season", schema);
