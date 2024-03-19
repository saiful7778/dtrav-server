import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
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
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const reviewModel = mongoose.model("review", reviewSchema);
