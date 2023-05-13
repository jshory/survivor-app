const express = require("express");
const router = express.Router();

const Contestant = require("../../models/contestant");
const Season = require("../../models/season");

// Get list of season's contestants
// router.get('/', async (req, res) => {
//     try {
//         const {seasonId} = req.body;

//         const results = await Contestant.find({season: seasonId});

//         return res.send(results);
//     } catch (err) {
//         res.status(400).json({message: err.message});
//     }
// });

// Create a new contestant
router.post("/", async (req, res) => {
  try {
    const { name, seasonId } = req.body;

    // TODO: validate seasonId exists

    // First, create contestant
    const contestant = new Contestant({ name, season: seasonId });
    const results = await contestant.save();

    // Second, add contestant to season
    const season = await Season.findById(seasonId);
    season.contestants.push(contestant._id);
    await season.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update existing contestant
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const contestant = await Contestant.findById(id);

    // TODO: is no contestant exists, return 404(?)
    contestant.name = name;

    const results = await contestant.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete existing contestant
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Contestant.deleteOne({ _id: id });

    return res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
