const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Login route api endpoint.");
});
router.get("/signup", (req, res) => {
  res.send("Signup route api endpoint.");
});

module.exports = router;
