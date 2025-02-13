const User = require("../schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendEmailVerification } = require("../utils/sendMail");

exports.register = async (req, res) => {
  try {
    const { name, surname, password, email, role } = req.body;

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
    console.log("Error registering user: ", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check if the user's email has been verified
    if (!user.verified) {
      return res
        .status(400)
        .json({ error: "Please verify your email before logging in." });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate a JWT token with a 1-hour expiration
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the JWT token in a secure, HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in milliseconds
    });

    //Set the role in a cookie but not secure
    res.cookie("role", user.role, {
      httpOnly: false, // Allows access via JavaScript
      secure: false,
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log("Error logging in user: ", error);
    res.status(500).json({ error: "Error logging in user" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
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
