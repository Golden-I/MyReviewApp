const express = require("express");
const { check } = require("express-validator");
const { createUser } = require("../controller/user");
const { userValidator, validate } = require("../middleWares/validator.js");

const router = express.Router();

router.post("/create", userValidator, validate, createUser);

// router.get this from the backend
// router.post get the data from the frontend
// router.delete

module.exports = router;
