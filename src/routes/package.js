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
      .find({}, { __v: 0, "images._id": 0 })
      .limit(limit);
    res.status(200).send({
      success: true,
      data: allPackages,
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

export default routeAll;
export { route as singlePackage };
