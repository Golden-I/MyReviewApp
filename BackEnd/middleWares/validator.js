//express validator in order not to store row data and store the correct data.

const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Please enter your name!"),
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter your password!")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be 6-20 characters!"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};
