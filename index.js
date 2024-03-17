import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authentication from "./src/routes/authentication.js";
dotenv.config();

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5001;
// eslint-disable-next-line no-undef
const dbUrl = process.env.DB_CONNECT;

(async () => {
  try {
    console.log("connecting...");
    await mongoose.connect(dbUrl);
    console.log("connected DB");
  } catch (err) {
    console.log("connection failed");
    console.log(err);
  }
})();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PATCH"],
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Server is running",
  });
});

app.use("/authentication", authentication);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
