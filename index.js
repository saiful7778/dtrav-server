import express from "express";
import dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5001;

const app = express();

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Server is running",
  });
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
