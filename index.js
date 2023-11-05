const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "UPDATE", "OPTIONS", "PATCH"],
};

app.use(cors({ corsOptions }));
app.use(express.json());

const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send({
    message: "Dtrav server is running!",
  });
});

app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send(token);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
