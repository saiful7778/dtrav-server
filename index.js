const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://dtrav-travle.web.app/"],
    methods: ["GET", "POST", "UPDATE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send({
    message: "Dtrav server is running!",
  });
});

app.get("/tour_packages", (req, res) => {
  console.log("Token:", req.cookies.token);
  res.send({ tour_package: 0 });
});

app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false,
    })
    .send({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
