/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: _______SIDDHANT BISHT_______________ Student ID: ___190872234___________ Date: 25 NOV 2025______________
*
********************************************************************************/
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const { connectMongoDB, connectPostgres } = require("./models/index");

const app = express();

// Connect Databases
connectMongoDB();
connectPostgres();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
  })
);

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/", authRoutes);
app.use("/", taskRoutes);

// Home
app.get("/", (req, res) => {
  res.send("<h1>WEB322 Assignment 3</h1><p>Server is running.</p>");
});

// Sync Task model
const Task = require("./models/Task");
Task.sync();

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
