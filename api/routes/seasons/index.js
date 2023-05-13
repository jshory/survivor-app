const express = require("express");
const router = express.Router();

const Season = require("../../models/season");

// Get list of all seasons
router.get("/", async (req, res) => {
  try {
    const results = await Season.find()
      .populate("contestants")
      .sort({ createdAt: "desc" });
    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single season by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const results = await Season.findById(id);

//     return res.send(results);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Create a new season
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const season = new Season({ name });
    const results = await season.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update existing season
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const season = await Season.findById(id);

    // TODO: is no season exists, return 404(?)

    season.name = name;

    const results = await season.save();

    return res.send(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete existing season
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     await Season.deleteOne({ _id: id });

//     return res.sendStatus(204);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;
