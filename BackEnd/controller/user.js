const nodemailer = require("nodemailer");
// const crypto = require("crypto");
const generateRandomByte = require("../utils/mail");
// const User = require("../models/user.js");
const {
  EmailVerificationToken,
} = require("../models/emailVerificationToken.js");
const { passwordResetToken } = require("../models/passwordResetToken.js");
const { generateOTP, generateMailTransporter } = require("../utils/mail.js");
const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper.js");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser)
    return res.status(401).json({ error: "This email already exists" });

  const newUser = new User({ name, email, password });
  await newUser.save();

  //generate 6 digit otp
  let OTP = generateOTP();

  //store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  //send otp to our user
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@myreviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
      <p> Your verification OTP </p>
      <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    message:
      "Verification has been sent to your email account. Please verify your email!",
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return res.json({ error: "Invalid user!" });

  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: "User not found!" });

  if (user.isVerified) return res.json({ error: "User already verified" });

  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) return res.json({ error: "Token not found!" });

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return res.json({ error: "Please submit a valid OTP!" });

  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@myreviewapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1>Thanks for joining MyReviewApp!</h1>",
  });
  res.status(200).json({ message: "Your email is verified." });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found!");

  if (user.isVerified)
    return sendError(res, "This email id is already verified!");

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token!"
    );

  // generate 6 digit otp
  let OTP = generateOTP();

  // store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send that otp to our user
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@myreviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `
      <p> Your verification OTP </p>
      <h1>${OTP}</h1>
    `,
  });
  res.status(200).json({
    message: "New OTP has been sent to your registered email account.",
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Email is Missing!");
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "user not found!", 404);

  const alreadyHasToken = await passwordResetToken.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token!"
    );
  const token = await generateRandomByte();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@myreviewapp.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
        <p>Click here to reset password</p>
        <a href='${resetPasswordUrl}'>Change Password</a>
      `,
  });

  res.json({ message: "Link sent to your email!" });
};
