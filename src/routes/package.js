import express from "express";
import serverHelper from "../utils/server-helper.js";
import { packageModel } from "../models/packageModel.js";
import { wishlistModel } from "../models/wishlistModel.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyTokenKey from "../middleware/verifyTokenKey.js";

const routeAll = express();
const route = express();

routeAll.get("/", (req, res) => {
  serverHelper(async () => {
    const query = req.query;
    const limit = parseInt(query?.limit || 0);
    const allPackages = await packageModel
      .find({}, { description: 0, __v: 0, images: 0 })
      .limit(limit);
    res.status(200).send({
      success: true,
      data: allPackages,
    });
  }, res);
});

routeAll.get("/:type", (req, res) => {
  const type = req.params.type;
  serverHelper(async () => {
    const allPackages = await packageModel.find(
      { type },
      { description: 0, __v: 0, images: 0 },
    );
    res.status(200).send({
      success: true,
      data: allPackages,
    });
  }, res);
});

route.get("/:packageID", (req, res) => {
  const packageID = req.params.packageID;
  serverHelper(async () => {
    const data = await packageModel.findById(packageID, {
      "images._id": 0,
      __v: 0,
    });
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Not found",
      });
    }
    res.status(200).send({
      success: true,
      data,
    });
  }, res);
});

route.post("/wishlist/:packageID", verifyToken, verifyTokenKey, (req, res) => {
  const packageID = req.params.packageID;
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).send({
      success: false,
      message: "User id not found",
    });
  }
  serverHelper(async () => {
    const wishlist = await wishlistModel.create({
      package: packageID,
      user: user_id,
    });
    res.status(201).send({ success: true, data: wishlist });
  }, res);
});

route.delete(
  "/wishlist/:packageID",
  verifyToken,
  verifyTokenKey,
  (req, res) => {
    const packageID = req.params.packageID;
    serverHelper(async () => {
      const data = await wishlistModel.findById(packageID, { _id: 1 });
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Not found",
        });
      }
      const deleteData = await wishlistModel.deleteOne({ _id: packageID });
      res.status(200).send({
        success: true,
        message: deleteData,
      });
    }, res);
  },
);

route.get("/wishlists/:userID", verifyToken, verifyTokenKey, (req, res) => {
  const userID = req.params.userID;
  serverHelper(async () => {
    const wishlist = await wishlistModel
      .find({ user: userID }, { __v: 0, user: 0 })
      .populate("package", ["title"]);
    res.status(201).send({ success: true, data: wishlist });
  }, res);
});

export default routeAll;
export { route as singlePackage };
