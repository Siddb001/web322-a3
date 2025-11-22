const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const ensureLogin = require("./authMiddleware");

// DASHBOARD
router.get("/dashboard", ensureLogin, async (req, res) => {
    const tasks = await Task.findAll({
        where: { userId: req.session.user.id }
    });

    res.render("dashboard", {
        user: req.session.user,
        taskCount: tasks.length
    });
});

// ALL TASKS
router.get("/tasks", ensureLogin, async (req, res) => {
    const tasks = await Task.findAll({
        where: { userId: req.session.user.id }
    });

    res.render("tasks", { tasks });
});

// ADD TASK PAGE
router.get("/tasks/add", ensureLogin, (req, res) => {
    res.render("taskAdd", { error: null });
});

// ADD TASK POST
router.post("/tasks/add", ensureLogin, async (req, res) => {
    const { title, description, dueDate } = req.body;

    if (!title)
        return res.render("taskAdd", { error: "Title is required" });

    await Task.create({
        title,
        description,
        dueDate,
        status: "pending",
        userId: req.session.user.id
    });

    res.redirect("/tasks");
});

// EDIT PAGE
router.get("/tasks/edit/:id", ensureLogin, async (req, res) => {
    const task = await Task.findByPk(req.params.id);

    if (!task || task.userId !== req.session.user.id)
        return res.redirect("/tasks");

    res.render("taskEdit", { task, error: null });
});

// EDIT POST
router.post("/tasks/edit/:id", ensureLogin, async (req, res) => {
    const task = await Task.findByPk(req.params.id);

    if (!task || task.userId !== req.session.user.id)
        return res.redirect("/tasks");

    const { title, description, dueDate, status } = req.body;

    await task.update({ title, description, dueDate, status });

    res.redirect("/tasks");
});

// DELETE
router.post("/tasks/delete/:id", ensureLogin, async (req, res) => {
    const task = await Task.findByPk(req.params.id);

    if (task && task.userId === req.session.user.id) {
        await task.destroy();
    }

    res.redirect("/tasks");
});

// UPDATE STATUS
router.post("/tasks/status/:id", ensureLogin, async (req, res) => {
    const task = await Task.findByPk(req.params.id);

    if (task && task.userId === req.session.user.id) {
        task.status = task.status === "pending" ? "completed" : "pending";
        await task.save();
    }

    res.redirect("/tasks");
});

module.exports = router;
