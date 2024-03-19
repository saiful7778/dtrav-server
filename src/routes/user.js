import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyTokenKey from "../middleware/verifyTokenKey.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import serverHelper from "../utils/server-helper.js";
import { userModel } from "../models/userModel.js";
import { reviewModel } from "../models/reviewModel.js";

const routeAll = express();
const route = express();

routeAll.get("/", verifyToken, verifyTokenKey, verifyAdmin, (req, res) => {
  serverHelper(async () => {
    const user = await userModel.find({}, { __v: 0 });
    res.status(200).send({ success: true, data: user });
  }, res);
});

route.patch(
  "/:userID",
  verifyToken,
  verifyTokenKey,
  verifyAdmin,
  (req, res) => {
    const userID = req.params.userID;
    const { role } = req.body;
    if (!role) {
      return res.status(400).send({
        success: false,
        message: "Invalid data",
      });
    }
    serverHelper(async () => {
      const data = await userModel.findById(userID, { _id: 1 });
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Not found",
        });
      }
      const updateData = await userModel.updateOne({ _id: userID }, { role });
      res.status(200).send({
        success: true,
        message: updateData,
      });
    }, res);
  },
);

route.get("/guide", (req, res) => {
  serverHelper(async () => {
    const guide = await userModel.find(
      { role: "guide" },
      { fullName: 1, _id: 1, image: 1 },
    );
    res.status(200).send({
      success: true,
      data: guide,
    });
  }, res);
});

route.get("/guide/:guideID", (req, res) => {
  const guideID = req.params.guideID;
  serverHelper(async () => {
    const exist = await userModel.findById(guideID, {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (!exist) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).send({
      success: true,
      data: exist,
    });
  }, res);
});

route.patch("/guide/:guideID", verifyToken, verifyTokenKey, (req, res) => {
  const reqData = req.body;
  const guideID = req.params.guideID;
  serverHelper(async () => {
    const exist = await userModel.findById(guideID);
    if (!exist) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    const guide = await userModel.updateOne({ _id: guideID }, reqData, {
      upsert: true,
    });
    res.status(200).send({
      success: true,
      data: guide,
    });
  }, res);
});

route.post(
  "/guide/review/:guideID",
  verifyToken,
  verifyTokenKey,
  (req, res) => {
    const { userID, reviewData } = req.body;
    const guideID = req.params.guideID;
    if (!reviewData || !userID) {
      return res.status(400).send({
        success: false,
        message: "Invalid data",
      });
    }
    serverHelper(async () => {
      const exist = await userModel.findById(guideID);
      if (!exist) {
        return res.status(404).send({
          success: false,
          message: "user not found",
        });
      }
      const review = await reviewModel.create({
        user: userID,
        guide: guideID,
        review: reviewData,
      });
      res.status(200).send({
        success: true,
        data: review,
      });
    }, res);
  },
);

export default routeAll;
export { route as user };
