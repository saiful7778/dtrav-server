const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
const uri = process.env.CONNECT_LINK;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dtravDB = client.db("dtravDB");
const tourPackageColl = dtravDB.collection("tourPackage");

app.get("/", (req, res) => {
  res.send({
    message: "Dtrav server is running!",
  });
});

app.get("/tour_packages", async (req, res) => {
  try {
    const result = await tourPackageColl.find().toArray();
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No tour packages found!" });
    }
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching tour packages" });
  }
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
