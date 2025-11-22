require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const { sequelize } = require("./models/Task");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// ====== MIDDLEWARE ======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ====== SESSION CONFIG ======
app.use(session({
    secret: "sid_super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000, // 30 minutes
    }
}));

// ====== EJS SETUP ======
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ====== DATABASE CONNECTIONS ======
async function connectDatabases() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✔ MongoDB connected");
    } catch (err) {
        console.log("❌ MongoDB error:", err.message);
    }

    try {
        await sequelize.sync();   // SQLite only
        console.log("✔ SQLite synced");
    } catch (err) {
        console.log("❌ SQLite error:", err.message);
    }
}

connectDatabases();

// ====== ROUTES ======
app.use("/", authRoutes);
app.use("/", taskRoutes);

// DEFAULT ROOT
app.get("/", (req, res) => {
    res.redirect("/login");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
