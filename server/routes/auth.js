const express = require("express");
const router = express.Router();

const User = require("../schemas/user");

const authController = require("../controllers/authController");

router.post("/register", (req, res) => authController.register(req, res));

router.post("/login", (req, res) => authController.login(req, res));

router.get("/logout", (req, res) => authController.logout(req, res));

router.post("/new-verification-link", (req, res) =>
  authController.newVerificationLink(req, res)
);

router.post("/request-reset", (req, res) =>
  authController.requestreset(req, res)
);

router.post("/verify-reset-code", (req, res) =>
  authController.verifyresetcode(req, res)
);

router.get("/verify/:token", (req, res) =>
  authController.verifyEmail(req, res)
);

module.exports = router;
