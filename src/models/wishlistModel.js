import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
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
});

export const wishlistModel = mongoose.model("wishlist", wishlistSchema);
