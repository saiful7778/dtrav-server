import express from "express";
import serverHelper from "../utils/server-helper.js";
import { packageModel } from "../models/packageModel.js";
import { wishlistModel } from "../models/wishlistModel.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyTokenKey from "../middleware/verifyTokenKey.js";
import { packageBookModel } from "../models/packageBookModel.js";

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

route.post("/booking", verifyToken, verifyTokenKey, (req, res) => {
  const { packageID, userID, guideID, price, tourData } = req.body;
  if (!packageID || !userID || !guideID || !price || !tourData) {
    return res.status(400).send({
      success: false,
      message: "Invalid input data",
    });
  }
  serverHelper(async () => {
    const bookPackage = await packageBookModel.create({
      package: packageID,
      user: userID,
      guide: guideID,
      price,
      tourData,
    });
    const bookedCount = await packageBookModel.find({
      user: userID,
      status: { $ne: "rejected" },
    });
    res.status(201).send({
      success: true,
      data: { bookPackage, bookedCount: bookedCount.length },
    });
  }, res);
});

route.delete("/booking/:packageID", verifyToken, verifyTokenKey, (req, res) => {
  const packageID = req.params.packageID;
  serverHelper(async () => {
    const data = await packageBookModel.deleteOne({ _id: packageID });
    res.status(200).send({
      success: true,
      data,
    });
  }, res);
});

route.get("/booking/:userID", verifyToken, verifyTokenKey, (req, res) => {
  const userID = req.params.userID;
  serverHelper(async () => {
    const bookings = await packageBookModel
      .find({ user: userID }, { _id: 1, tourData: 1, price: 1, status: 1 })
      .populate("package", ["_id", "title"])
      .populate("guide", ["_id", "fullName"]);
    res.status(200).send({
      success: false,
      data: bookings,
    });
  }, res);
});

route.get(
  "/booking/guide/:guideID",
  verifyToken,
  verifyTokenKey,
  (req, res) => {
    const guideID = req.params.guideID;
    serverHelper(async () => {
      const bookings = await packageBookModel
        .find({ guide: guideID }, { _id: 1, tourData: 1, price: 1, status: 1 })
        .populate("package", ["_id", "title"])
        .populate("user", ["_id", "fullName"]);
      res.status(200).send({
        success: false,
        data: bookings,
      });
    }, res);
  },
);

route.patch(
  "/booking/guide/:bookedPackageID",
  verifyToken,
  verifyTokenKey,
  (req, res) => {
    const bookedPackageID = req.params.bookedPackageID;
    const { status } = req.body;
    if (!status) {
      return res.status(400).send({
        success: false,
        message: "Invalid data",
      });
    }
    serverHelper(async () => {
      const exist = await packageBookModel.findById(bookedPackageID);
      if (!exist) {
        return res.status(404).send({
          success: false,
          message: "Booked package not found",
        });
      }
      const data = await packageBookModel.updateOne(
        { _id: bookedPackageID },
        { status },
        { upsert: true },
      );
      res.status(200).send({
        success: true,
        data,
      });
    }, res);
  },
);

export default routeAll;
export { route as singlePackage };
