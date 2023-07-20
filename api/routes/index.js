"use strict";

const express = require("express");
const router = express.Router();

const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

const _ = require("lodash");

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);

(async function () {
  await doc.loadInfo();
})();

// Get list of contestants
router.get("/contestants", async (req, res) => {
  try {
    const contestantSheet = doc.sheetsByTitle["Contestants"];
    const rows = await contestantSheet.getRows();

    const contestants = rows.map((row) => {
      return {
        name: row.get("name"),
        originalTribe: row.get("original_tribe"),
        totalPoints: Number(row.get("total_points")),
        votedOut: row.get("voted_out") === "TRUE",
      };
    });

    return res.send(contestants);
  } catch (err) {
    const errStatus = err.status || 400;
    res.status(errStatus).json({ message: err.message });
  }
});

// Get list of teams
router.get("/teams", async (req, res) => {
  try {
    const teamSheet = doc.sheetsByTitle["Teams"];
    const teamRows = await teamSheet.getRows();

    const contestantSheet = doc.sheetsByTitle["Contestants"];
    const contestantRows = await contestantSheet.getRows();

    const contestantObjects = contestantRows.map((row) => {
      return {
        name: row.get("name"),
        originalTribe: row.get("original_tribe"),
        totalPoints: Number(row.get("total_points")),
        votedOut: row.get("voted_out") === "TRUE",
      };
    });

    const teams = teamRows.map((row) => {
      const team = {
        name: row.get("team_name"),
        owner: row.get("team_owner"),
      };

      let totalPoints = 0;

      let contestants = [];

      const contestantOne = contestantObjects.find(
        (obj) => obj.name === row.get("contestant_1")
      );
      contestants.push(contestantOne);
      totalPoints += contestantOne.totalPoints;

      const contestantTwo = contestantObjects.find(
        (obj) => obj.name === row.get("contestant_2")
      );
      contestants.push(contestantTwo);
      totalPoints += contestantTwo.totalPoints;

      const contestantThree = contestantObjects.find(
        (obj) => obj.name === row.get("contestant_3")
      );
      contestants.push(contestantThree);
      totalPoints += contestantThree.totalPoints;

      const contestantFour = contestantObjects.find(
        (obj) => obj.name === row.get("contestant_4")
      );
      contestants.push(contestantFour);
      totalPoints += contestantFour.totalPoints;

      const contestantFive = contestantObjects.find(
        (obj) => obj.name === row.get("contestant_5")
      );
      contestants.push(contestantFive);
      totalPoints += contestantFive.totalPoints;

      return { ...team, contestants, totalPoints };
    });

    return res.send(teams);
  } catch (err) {
    const errStatus = err.status || 400;
    res.status(errStatus).json({ message: err.message });
  }
});

// Get list of weekly score sheets
router.get("/scores", async (req, res) => {
  try {
    // Get all sheets
    const scoreSheets = [];
    const totalSheets = doc.sheetCount;

    for (var i = 0; i < totalSheets; i++) {
      const sheet = doc.sheetsByIndex[i];
      const sheetTitle = sheet.title;

      // Loop over all sheets
      // Check if current sheet is a weekly score sheet
      const pattern = /Week [0-9][0-9]*/;
      if (pattern.test(sheetTitle)) {
        // If current sheet is a weekly score sheet,
        // create an array of contestants
        await sheet.loadHeaderRow();
        let contestants = sheet.headerValues;
        contestants = contestants
          .filter(
            (value) =>
              value && value !== "rule_description" && value !== "rule_value"
          )
          .map((contestant) => {
            return { name: contestant, scores: [] };
          });

        // Loop over all rows (i.e., rules) and add
        // scores to contestants array if score is checked off
        const scoreRows = await sheet.getRows();
        scoreRows.forEach((row) => {
          const rule = row.get("rule_description");
          const ruleValue = Number(row.get("rule_value"));

          if (rule && rule !== "Weekly Total") {
            contestants.forEach((contestant) => {
              const isCheckedOff = row.get(contestant.name) === "TRUE";

              if (isCheckedOff) {
                contestant.scores.push({ rule, value: ruleValue });
              }
            });
          }
        });
        scoreSheets.push({ name: sheetTitle, contestants });
      }
    }

    // Return array of weekly scores, sorted by name
    return res.send(_.sortBy(scoreSheets, "name"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
