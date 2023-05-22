const express = require("express");

const router = express.Router();

const Rule = require("../../models/rule");
const Season = require("../../models/season");

// Create a new rule
router.post("/", async (req, res) => {
  try {
    const { description, points, seasonId } = req.body;

    // TODO: validate seasonId exists

    // First, create rule
    const rule = new Rule({
      description,
      points,
      season: seasonId,
    });
    const results = await rule.save();

    // Second, add rule to season
    const season = await Season.findById(seasonId);
    season.rules.push(rule._id);
    await season.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update existing rule
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, points } = req.body;

    const rule = await Rule.findById(id);

    // TODO: is no rule exists, return 404(?)

    rule.description = description;
    rule.points = points;

    const results = await rule.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete existing tribe
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Rule.deleteOne({ _id: id });

    return res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
