import express from "express";
import serverHelper from "../utils/server-helper.js";
import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const route = express();

route.post("/register", (req, res) => {
  const { name, email, userID } = req.body;
  if (!name || !email || !userID) {
    return res.status(400).send({
      success: false,
      message: "Invalid input data",
    });
  }
  serverHelper(async () => {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(401).send({
        success: false,
        message: "User is already exist",
      });
    }
    await userModel.create({
      fullName: name,
      userID,
      email,
    });
    res.status(201).send({
      success: true,
      message: "User is created",
    });
  }, res);
});

route.post("/login", (req, res) => {
  const { email, name, userID } = req.body;

  if (!name || !email || !userID) {
    return res.status(401).send({
      success: false,
      message: "Invalid input data",
    });
  }

  serverHelper(async () => {
    const user = await userModel.findOne({ email, userID });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        name: user.fullName,
        userID: user.userID,
      },
      // eslint-disable-next-line no-undef
      process.env.SITE_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).send({
      success: true,
      token,
      user,
    });
  }, res);
});

export default route;
