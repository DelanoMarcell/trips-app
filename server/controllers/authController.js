const User = require("../schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendEmailVerification } = require("../utils/sendMail");

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.LOCAL_URL; // Local URL for development
  } else {
    return process.env.AZURE_URL; // Azure URL for production
  }
};

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

    const resetLink = `${getBaseUrl()}/api/auth/verify/${token}`;

    await sendEmailVerification(
      name,
      email,
      resetLink,
      "",
      "email-verification"
    );

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

        //Set the role in a cookie but not secure
        res.cookie("email", user.email, {
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

exports.newVerificationLink = async (req, res) => {
  const { email } = req.body;

  //Find the user associated with email, generate jwt, generate reset link, send email
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const name = user.name;

  //Generate a jwt token for the email verification link and set an hour expiration
  const token = jwt.sign(
    {
      email: email,
      name: name,
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 1000 }
  );

  const resetLink = `${getBaseUrl()}/api/auth/verify/${token}`;

  await sendEmailVerification(name, email, resetLink, "", "email-verification");

  res.status(200).json({ message: "Verification link sent to your email" });
};

exports.requestreset = async (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit random code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  //Get the persons name based on the email
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const name = user.name;

  // Store the reset code in the database by updating the user field // Expires in 10 mins
  await User.findOneAndUpdate(
    { email: email },
    { resetCode: resetCode, expireCode: Date.now() + 10 * 60 * 1000 }
  );

  // Send the reset code via email
  await sendEmailVerification(name, email, "", resetCode, "reset-request");

  res.status(200).json({ message: "Reset code sent to your email" });
};

exports.verifyresetcode = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the reset code is correct and not expired
    if (!user.resetCode || user.resetCode !== resetCode) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    if (Date.now() > user.expireCode) {
      return res.status(400).json({ error: "Reset code has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword, resetCode: "", expireCode: "" }
    );

    res.status(200).json({
      message: "Your password has been reset successfully. Please login.",
    });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    res
      .status(500)
      .json({ error: "An error occurred while verifying the reset code" });
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

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({
      error:
        "The email verification link is not valid. Please login with your credentials to request a new reset link. ",
    });
  }
};
