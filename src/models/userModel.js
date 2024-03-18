import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "guide", "admin"],
      default: "user",
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: function (e) {
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(e);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("user", userSchema);
