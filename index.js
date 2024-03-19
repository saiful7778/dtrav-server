import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authentication from "./src/routes/authentication.js";
import packages, { singlePackage } from "./src/routes/package.js";
import users, { user } from "./src/routes/user.js";
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
    origin: ["https://dtrav-travle.web.app"],
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
app.use("/packages", packages);
app.use("/package", singlePackage);
app.use("/users", users);
app.use("/user", user);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
