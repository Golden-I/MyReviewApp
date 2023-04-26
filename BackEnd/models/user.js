const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { stringify } = require("querystring");
const { nextTick } = require("process");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // more than 10 makes the app slow
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
