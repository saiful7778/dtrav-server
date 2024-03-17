import express from "express";
import serverHelper from "../utils/server-helper.js";
import { userModel } from "../models/userModel.js";

const route = express();

route.post("/register", (req, res) => {
  const { name, email, userID } = req.body;
  if (!name || !email || !userID) {
    return res.status(401).send({
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

export default route;
