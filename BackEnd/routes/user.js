const express = require("express");
const { create } = require("../controller/user");
const { userValidator, validate } = require("../middleWares/validator.js");

const router = express.Router();

router.post("/create", userValidator, validate, create);

module.exports = router;
