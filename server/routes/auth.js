const express = require("express");
const router = express.Router();

const User = require("../schemas/user");

const authController = require("../controllers/authController");

router.post("/register", (req, res) => authController.register(req, res));

router.get("/verify/:token", (req, res) =>
  authController.verifyEmail(req, res)
);


module.exports = router;
