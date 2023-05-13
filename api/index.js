const express = require("express");
const app = express();

require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const seasons = require("./routes/seasons");
const contestants = require("./routes/contestants");
const tribes = require("./routes/tribes");

// Connect to DB
mongoose.connect(process.env.MONGO_STRING);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Load API routes
app.use("/seasons", seasons);
app.use("/contestants", contestants);
// app.use("/tribes", tribes);

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
