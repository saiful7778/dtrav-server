import mongoose from "mongoose";

const packageBookSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "package",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["review", "rejected", "accepted"],
      default: "review",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tourData: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const packageBookModel = mongoose.model(
  "packageBooked",
  packageBookSchema,
);
