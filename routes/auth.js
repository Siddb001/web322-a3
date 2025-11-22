const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// REGISTER PAGE
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

// REGISTER POST
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const exists = await User.findOne({ email });

        if (exists)
            return res.render("register", { error: "Email already exists!" });

        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashed
        });

        res.redirect("/login");

    } catch (err) {
        console.log(err);
        res.render("register", { error: "Something went wrong!" });
    }
});

// LOGIN PAGE
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// LOGIN POST
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.render("login", { error: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res.render("login", { error: "Invalid email or password" });

        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        res.render("login", { error: "Something went wrong!" });
    }
});

// LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
