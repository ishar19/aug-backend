const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const applicationModel = require("../models/application.model");
const { authMiddleware } = require("../middleware/auth");
// get id from token
// get user from that id 

router.get("/", async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user).status(200);
    }
    catch (err) {
        next(err);
    }
});

router.delete("/", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" }).status(200);
    }
    catch (err) {
        next(err);
    }
});

router.put("/", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user).status(200);
    }
    catch (err) {
        next(err);
    }
});
// /api/user/jobs?createdJobs=true&savedJobs=false&appliedJobs=true
router.get("/jobs", authMiddleware, async (req, res, next) => {
    try {
        const { createdJobs, savedJobs, appliedJobs } = req.query;
        const jobs = await userModel.findById(req.user.id);
        if (!jobs) {
            return res.status(404).json({ message: "User not found" });
        }
        const query = {};
        if (createdJobs) {
            query.createdJobs = true;
        }
        if (savedJobs) {
            query.savedJobs = true;
        }
        if (appliedJobs) {
            query.appliedJobs = true;
        }
        else {
            const jobs = await userModel.findById(req.user.id).select({ ...query });
            return res.json(jobs).status(200);
        }
    }
    catch (err) {
        next(err);
    }
})

router.get("/status", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const applications = await applicationModel.find({ user: id });
        const acceptedApplications = applications.filter(app => app.status === "accepted");
        return res.json({ acceptedApplications }).status(200);
    }
    catch (err) {
        next(err);
    }
})



module.exports = router;