const User = require("../schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendEmailVerification } = require("../utils/sendMail");

exports.register = async (req, res) => {
  try {
    const { name, surname, cellphone, password, email, role } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "A user with this email address already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      surname,
      password: hashedPassword,
      email,
      cellphone,
      role,
    });

    await newUser.save();

    //Generate a jwt token for the email verification link and set an hour expiration
    const token = jwt.sign(
      {
        email: email,
        name: name,
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 1000 }
    );

    const resetLink = `http://localhost:5000/api/auth/verify/${token}`;

    await sendEmailVerification(name, email, resetLink);

    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user: " + error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({
        error:
          "The email verification link is not valid. Please login with your credentials to request a new reset link.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        error:
          "The email verification link is not valid. Please login with your credentials to request a new reset link.",
      });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({
      error:
        "The email verification link is not valid. Please login with your credentials to request a new reset link. ",
    });
  }
};
