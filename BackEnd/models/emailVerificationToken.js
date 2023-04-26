const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, //60 min x 60 seconds (after one hour expire)
    default: Date.now,
  },
});

emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

emailVerificationTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);
