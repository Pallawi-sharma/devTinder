const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Email is not valid" + value)
        }
      }
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18
    },
    about: {
      type: String,
      default: "Short decription about me.",
      maxLength: 200,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid!!");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// const User = mongoose.model("user", userSchema);

module.exports = mongoose.model("user", userSchema);
