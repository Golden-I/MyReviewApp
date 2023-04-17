const nodemailer = require("nodemailer");
const User = require("../models/user.js");
const EmailVerificationToken = require("../models/emailVerificationToken.js");
const { isValidObjectId } = require("mongoose");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser)
    return res.status(401).json({ error: "This email already exists" });

  const newUser = new User({ name, email, password });
  await newUser.save();

  //generate 6 digit otp
  let OTP = "";
  for (let i = 0; i <= 5; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }

  //store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  //send otp to our user
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "96628649a63c20",
      pass: "5fe34ee566a9cd",
    },
  });

  transport.sendMail({
    from: "verification@myreviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
      <p> Your verification OTP </P>
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
  if (!user) return res.json({ error: "User not found!" });

  if (user.isVerified) return res.json({ error: "User already verified" });

  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) return res.json({ error: "Token not found!" });

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return res.json({ error: "Please submit a valid OTP!" });

  user.isVerified = true;
  await user.save();
  await EmailVerificationToken.findByIdAndDelete(token._id);
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "96628649a63c20",
      pass: "5fe34ee566a9cd",
    },
  });

  transport.sendMail({
    from: "verification@myreviewapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1>Thanks for joining MyReviewApp!</h1>",
  });
  res.json({ message: "Your email is verified." });
};
