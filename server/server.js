// ======================
// 1. Imports and Configuration
// ======================
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: "../.env" }); // Load .env from the root directory

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// 2. Middleware Setup
// ======================
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from Vite
  })
);
app.use(express.json()); // Parse JSON bodies

// ======================
// 3. Routes
// ======================
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ======================
// 4. Production Configuration (Serving React Frontend)
// ======================
if (process.env.NODE_ENV === "production") {
  console.log(
    "Production environment detected. Serving frontend from the build folder."
  );
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Handle React routing, return all requests to React app
  app.get("/login", (req, res) => {
    return res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

// ======================
// 5. Database Connection
// ======================
async function connectToDatabase() {
  try {
    const clientOptions = {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    };

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
}

// ======================
// 6. Server Startup
// ======================
async function startServer() {
  await connectToDatabase(); // Connect to the database
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Start the server
startServer();
