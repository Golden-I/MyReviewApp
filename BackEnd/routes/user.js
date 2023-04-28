const { Router } = require("express");

const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
} = require("../controller/user");
const {
  userValidator,
  validate,
  isValidPassResetToken,
} = require("../middlewares/validator");

const router = new Router();

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post("/verify-pass-reset-token", isValidPassResetToken, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
