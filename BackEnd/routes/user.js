const express = require("express");
// const { check } = require("express-validator");
const { create, verifyEmail } = require("../controller/user");
const { userValidator, validate } = require("../middleWares/validator.js");

const router = express.Router();

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);

module.exports = router;

// router.get this from the backend
// router.post get the data from the frontend
// router.delete
