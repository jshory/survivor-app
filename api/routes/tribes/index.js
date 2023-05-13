const express = require("express");

const router = express.Router();

const Tribe = require("../../models/tribe");
const Season = require("../../models/season");

// Get list of season's tribes
// router.get('/', async (req, res) => {
//     try {
//         const {seasonId} = req.body;

//         const results = await Tribe.find({season: seasonId});

//         return res.send(results);
//     } catch (err) {
//         res.status(400).json({message: err.message});
//     }
// });

// Get single tribe by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const results = await Tribe.findById(id);

//     return res.send(results);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Create a new tribe
router.post("/", async (req, res) => {
  try {
    const { name, owner, seasonId, contestantIds } = req.body;

    // TODO: validate seasonId / contestantIds exist

    // First, create tribe
    const tribe = new Tribe({
      name,
      owner,
      season: seasonId,
      contestants: contestantIds,
    });
    const results = await tribe.save();

    // Second, add tribe to season
    const season = await Season.findById(seasonId);
    season.tribes.push(tribe._id);
    await season.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update existing tribe
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, owner, contestantIds } = req.body;

    const tribe = await Tribe.findById(id);

    // TODO: is no tribe exists, return 404(?)
    tribe.name = name;
    tribe.owner = owner;
    tribe.contestants = contestantIds;

    const results = await tribe.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete existing tribe
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Tribe.deleteOne({ _id: id });

    return res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
