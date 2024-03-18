import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
  // eslint-disable-next-line no-undef
  jwt.verify(token, process.env.SITE_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    req.user = decode;
    next();
  });
}
