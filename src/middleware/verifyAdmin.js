import { userModel } from "../models/userModel.js";

export default async function verifyAdmin(req, res, next) {
  try {
    const tokenUser = req.user;
    const user = await userModel.findOne(
      { email: tokenUser.email },
      { role: 1 },
    );
    const isAdmin = user.role === "admin";
    if (!isAdmin) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    next();
  } catch (err) {
    res.status(500).send({ success: false, message: "an error occurred" });
  }
}
