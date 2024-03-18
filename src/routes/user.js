import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyTokenKey from "../middleware/verifyTokenKey.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import serverHelper from "../utils/server-helper.js";
import { userModel } from "../models/userModel.js";

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

export default routeAll;
export { route as user };
